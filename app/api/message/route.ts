import { db } from "@/app/db";
import { openai } from "@/lib/openai";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { currentUser } from "@clerk/nextjs";
import { UpstashVectorStore } from "@langchain/community/vectorstores/upstash";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Index } from "@upstash/vector";
import { NextRequest } from "next/server";

import { OpenAIStream, StreamingTextResponse } from "ai";

// endpoint to ask question to PDF
export const POST = async (req: NextRequest) => {
    // endpoinnt to asking question to PDF
    const body = await req.json();

    const user = await currentUser();

    if (!user?.id) {
        return new Response('Unauthorized', { status: 401 })
    }

    const { fileId, message} = SendMessageValidator.parse(body);

    const file = await db.file.findFirst({
        where: {
            id: fileId,
            userId: user.id,
        }
    })

    if(!file) {
        return new Response('File not found', { status: 404 })
    }

    await db.message.create({
        data: {
            text: message,
            isUserMessage: true,
            userId: user.id,
            fileId,
        }
    })

    // 1. Vectorize the message from user with Openai
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      });

    const index = new Index({
        url: process.env.UPSTASH_VECTOR_REST_URL,
        token: process.env.UPSTASH_VECTOR_REST_TOKEN,
      });
    
      const vectorStore = await UpstashVectorStore.fromExistingIndex(embeddings, {
        index,
      });

      const results = await vectorStore.similaritySearch(message, 4);

      const prevMessages = await db.message.findMany({
        where: {
          fileId,
        },
        orderBy: {
          createdAt: "asc",
        },
        take: 6,
      });

      const formattedPrevMessages = prevMessages.map((msg) => ({
        role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
        content: msg.text,
      }));

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0,
        stream: true,
        messages: [
            {
                role: 'system',
                content:
                'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
            },
            {
                role: 'user',
                content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.

                \n----------------\n

                PREVIOUS CONVERSATION:
                ${formattedPrevMessages.map((message) => {
                    if (message.role === 'user')
                      return `User: ${message.content}\n`
                    return `Assistant: ${message.content}\n`
                })}

                \n----------------\n

                CONTEXT:
                ${results.map((r) => r.pageContent).join('\n\n')}

                USER INPUT: ${message}`,
                
            },
        ]
    })

    const stream = OpenAIStream(response, {
        async onCompletion(completion) {
          await db.message.create({
            data: {
              text: completion,
              isUserMessage: false,
              fileId,
              userId: user.id,
            },
          })
        },
    });

    return new StreamingTextResponse(stream);
}



