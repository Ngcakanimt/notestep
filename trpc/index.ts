import { privateProcedure, publicProcedure, router } from './trpc';
import { currentUser } from '@clerk/nextjs';
import { TRPCError } from '@trpc/server';
import { db } from '@/app/db';

import { z } from 'zod';
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';
import { absoluteUrl } from '@/lib/utils';
import { getUserSubscriptionPlan, paystack } from '@/lib/paystack';
import { PLANS } from '@/config/paystack';
import { url } from 'inspector';
import { get } from 'http';

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const user = await currentUser();

    if(!user?.id || !user?.emailAddresses[0].emailAddress)
      throw new TRPCError({ code : 'UNAUTHORIZED' })

      // Check if user is in the database
      const dbUser = await db.user.findFirst({
        where: {
          id: user?.id
        }
      })

      if(!dbUser) {
        // Create user in the database
        await db.user.create({
          data: {
            id: user?.id,
            email: user?.emailAddresses[0].emailAddress
          }
        })
      
      // await paystack.customer.create({
      //   email: user?.emailAddresses[0].emailAddress,
      //   first_name: user?.firstName ?? '',
      //   last_name: user?.lastName ?? '',
      // });

        
    }
    return { success: true }
  }),

  getFileMessages: privateProcedure
  .input(
    z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
    })
  ).query(async ({ input, ctx }) => {
      const { userId } = ctx
      const { fileId, cursor } = input
      const limit = input.limit ?? INFINITE_QUERY_LIMIT

      const file = await db.file.findFirst({
        where: {
          id: fileId,
          userId,
        },
      })

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

      const messages = await db.message.findMany({
        take: limit + 1,
        where: {
          fileId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true,
        },
      })

      let nextCursor: typeof cursor | undefined = undefined
      if (messages.length > limit) {
        const nextItem = messages.pop()
        nextCursor = nextItem?.id
      }

      return {
        messages,
        nextCursor,
      }
  }),

  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await db.file.findMany({
      where: {
        userId: userId,
      }
    })
  }),

  getFileUploadStatus: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const file = await db.file.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
      })

      if (!file) {
        return { status: 'PENDING' as const }
      }
      
      return { status: file.uploadStatus }
    }),

  getFile: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx

      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId,
        },
      })

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

      return file
    }),
  deleteFile: privateProcedure.input(z.object({
    id: z.string()
  })
  ).mutation(async({ ctx, input }) => {
    const {userId} = ctx;

    const file = await db.file.findFirst({
      where: {
        id: input.id,
        userId,
      }
    })

    if(!file) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }

    await db.file.delete({
      where: {
        id: input.id,
      }
    })

    return file;
  }),

  createPaystackSession: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;
    
    const billingUrl = absoluteUrl('/dashboard/billing')
    if (!userId)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    })

    if (!dbUser) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    
    // Use paystack sdk to initialize the transaction
    const paystackSession = await paystack.transaction.initialize({
      channels: ['card'],
      amount: '150',
      plan: PLANS[1].price.priceIds?.test || '',
      email: dbUser.email,
      metadata: {
        userId: userId
      },
      callback_url: billingUrl,
    })

    if (paystackSession.status === false) {
      return console.log(
        'Error initializing transaction: ',
        paystackSession.message
      );
    }

    let transaction = paystackSession.data

    
    return { url: transaction?.authorization_url}
  }),

  getUserSubscription: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    })

    if (!dbUser) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    const url = `https://api.paystack.co/subscription/${dbUser.paystackSubscriptionID}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET_KEY}`,
      },
    }).then((res) => res.json());

    return response.data;

  }),

  manageUserSubscription: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    })

    if (!dbUser) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    const url = `https://api.paystack.co/subscription/${dbUser.paystackSubscriptionID}/manage/link`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET_KEY}`,
      },
    }).then((res) => res.json());

    return response.data.link;

  }),


});

export type AppRouter = typeof appRouter;
