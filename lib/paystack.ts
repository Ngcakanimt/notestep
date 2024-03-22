import { PLANS } from "@/config/paystack"
import { db } from "@/app/db"
import { currentUser } from "@clerk/nextjs"
import {Paystack} from 'paystack-sdk';


export const paystack = new Paystack(process.env.PAYSTACK_TEST_SECRET_KEY as string)

export async function getUserSubscriptionPlan() {
    const user = await currentUser();

    if(!user?.id) {
        return {
            ...PLANS[0],
            isSubscribed: false,
            isCanceled: false,
            paystackCurrentPeriodEnd: null,
        }
    }

    const dbUser = await db.user.findFirst({
        where: {
          id: user.id,
        },
    })

    if (!dbUser) {
        return {
          ...PLANS[0],
          isSubscribed: false,
          isCanceled: false,
          paystackCurrentPeriodEnd: null,
        }
    }

    const isSubscribed = Boolean(
        dbUser.paystackPriceId &&
        dbUser.paystackCurrentPeriodEnd && // 86400000 = 1 day
        dbUser.paystackCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
    )

    const plan = isSubscribed
        ? PLANS.find((plan) => plan.price.priceIds?.test === dbUser.paystackPriceId)
        : null

        let isCanceled = false
        if (isSubscribed && dbUser.paystackSubscriptionID) {
          const paystackPlan = await paystack.plan.fetch(
            dbUser.paystackSubscriptionID
          )
          isCanceled = paystackPlan.status === false
        }
        return {
            ...plan,
            paystackSubscriptionId: dbUser.paystackSubscriptionID,
            paystackCurrentPeriodEnd: dbUser.paystackCurrentPeriodEnd,
            paystackCustomerId: dbUser.paystackCustomerId,
            isSubscribed,
            isCanceled,
          }

}