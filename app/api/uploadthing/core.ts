import { db } from "@/app/db";
import { currentUser } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";

import { OpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";

import { Index } from "@upstash/vector"
import { UpstashVectorStore } from "@langchain/community/vectorstores/upstash";
import { getUserSubscriptionPlan } from "@/lib/paystack";
import { PLANS } from "@/config/paystack";
 
const f = createUploadthing();

const middleware = async () => {
  const user = await currentUser();

      if(!user || !user.id) {
        throw new UploadThingError("Unauthorized");
      }

      const subscriptionPlan = await getUserSubscriptionPlan();
 
      return { subscriptionPlan, userId: user.id };
}

const onUploadComplete = async ({ 
  metadata, file 
}: {
  metadata: Awaited<ReturnType<typeof middleware>>
  file: {
    key: string
    name: string
    url: string
  }
}) => {
  const isFileExist = await db.file.findFirst({
    where: {
      key: file.key,
    },
  })

  if (isFileExist) return

  const createdFile = await db.file.create({
    data: {
      key: file.key,
      name: file.name,
      userId: metadata.userId,
      url: `https://utfs.io/f/${file.key}`,
      uploadStatus: "PROCESSING",

    }
  })

  try {

    // Vectorise entire pdf document (Upstash)
    const index = new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN,
    });
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const upstashVector = new UpstashVectorStore(embeddings, {
      index,
    });

    // 1. We are going to load pdf info and extract its contents
    const response = await fetch(`https://utfs.io/f/${file.key}`)

    // 2. Get the contents in raw data as blob
    const blob = await response.blob();

    // 3. Load the PDF
    const loader = new PDFLoader(blob);

    // 4. Wait until pdf contents are loaded
    const pageLevelDocs = await loader.load();

    // 5. Get the amount of pages from pdf
    const pagesAmt = pageLevelDocs.length

    const { subscriptionPlan } = metadata;
    const { isSubscribed } = subscriptionPlan;

    const isProExceeded = pagesAmt > PLANS.find((plan) => plan.name === 'Pro')!.pagesPerPdf
    const isFreeExceeded = pagesAmt > PLANS.find((plan) => plan.name === 'Free')!.pagesPerPdf


    if ((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)) {
      await db.file.update({
        data: {
          uploadStatus: 'FAILED',
        },
        where: {
          id: createdFile.id,
        },
      })
    }

    try{
      await upstashVector.addDocuments(pageLevelDocs);
    }
    catch(error){
      console.error("Error generating or indexing embeddings:", error)
    }

    // Waiting vectors to be indexed in the vector store.
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await db.file.update({
      data: {
        uploadStatus: "SUCCESS"
      },
      where: {
        id: createdFile.id
      }
    })

  } catch (error) {
    console.error("Error while processing file", error)
    await db.file.update({
      data: {
        uploadStatus: "FAILED"
      },
      where: {
        id: createdFile.id
      }
    })
  }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
    proPlanUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;