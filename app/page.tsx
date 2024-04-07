import Link from "next/link";

import MaxWidthWrapper from "./components/MaxWidthWrapper";

import { ArrowRight } from "lucide-react";

import { auth } from "@clerk/nextjs";

import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  return (
    <>
      {/* Hero Section */}
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-14 flex flex-col items-center justify-center text-center">
        <div
          className="
          mx-auto
          mb-4
          flex
          max-w-fit
          items-center
          justify-center
          space-x-2
          overflow-hidden
          rounded-full
          border
          border-grey-200
          bg-white
          px-7
          py-2
          shadow-md
          backdrop-blur
          transition-all
          hover:border-grey-300
          hover:bg-white/50
        "
        >
          <p className="text-sm font-semibold text-gray-700">
            Not available to the public
          </p>
        </div>
        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
          Read faster.
          <br />
          Understand <span className="text-[#FFCB77]">better.</span>
        </h1>
        <p className="mt-5 max-width-prose text-zinc-700 sm:text-lg">
        Quickly find answers to your questions from your documents, simplify complex content, and usderstand faster with the power of AI. 
        </p>
        <Link href="/dashboard" target="_blank">
          <div
            className="
            flex
            flex-row
            mt-8
            px-8
            py-3
            text-lg
            font-semibold
            text-white
            bg-black
            z-20
            rounded-md
            shadow-md
            backdrop-blur-md
            transition-all
            hover:bg-opacity-85
          "
          >
            Get Started
            <ArrowRight className="ml-2 mt-0.5" />
          </div>
        </Link>
      </MaxWidthWrapper>
      <div>
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="
              pointer-events-none 
              absolute 
              inset-x-0 
              -top-40
              z-10
              transform-gpu
              overflow-hidden
              blur-3xl
              sm:-top-80
              "
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="
                relative
                left-[calc(50% -11rem)] 
                aspect-[1155/678] w-[36.125rem] 
                -translate-x-1.5 rotate-[30deg] 
                bg-gradient-to-tr from-[#ffa585] to-[#ffeda0] 
                opacity-10
                sm:left-[calc(50%-30rem)] 
                sm:w-[72.1875rem]
                "
            />
          </div>

          <div>
            {/* TO DO: Uncomment when Dashboard image is complete*/}

            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <Image
                    src="/images/dashboard-preview.png"
                    alt="product preview"
                    width={2880}
                    height={1546}
                    quality={100}
                    className="rounded-md bg-white p-2 sm:p-8 md:p-10 shadow-2xl ring-1 ring-gray-900/10"
                  />
                </div>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
              <div
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
                className="
                  relative 
                  left-[calc(50%-13rem)] 
                  aspect-[1155/678] 
                  w-[36.125rem] 
                  -translate-x-1/2 
                  rotate-[30deg] 
                  bg-gradient-to-tr from-[#ffa585] to-[#ffeda0]
                  opacity-20 
                  sm:left-[calc(50%-36rem)] 
                  sm:w-[72.1875rem]"
              />
            </div>
          </div>

          {/* Features Section */}
          <div className="mx-auto mb-32 mt-32 max-w-5xl sm:mt-56">
            <div className="mb-12 px-6 lg:px-8">
              <div className="mx-auto max-w-2xl sm:text-center">
                <div className="mt-2 font-bold text-4xl text-gray-900 sm:text-5xl">
                  <h2>
                    It begins with your most reliable sources of information
                  </h2>
                  <p className="mt-4 text-lg text-gray-600">
                    Whether it&apos;s transcripts from meetings, lecture
                    notes from your courses, or even tender requests from
                    private or public sectors, Notestep can help you quickly
                    understand the content quicker.
                  </p>
                </div>

                {/* steps */}
                <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
                  <li className="md:flex-1">
                    <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                      <span className="text-sm font-bold text-[#FFCB77]">
                        Step 1
                      </span>
                      <span className="text-xl font-semibold">Sign up</span>
                      <span className="mt-2 text-zinc-700">
                        Either starting out with a free plan or choose our{" "}
                        <Link
                          href="/pricing"
                          className="text-[#FFCB77] underline underline-offset-2"
                        >
                          pro plan
                        </Link>
                        .
                      </span>
                    </div>
                  </li>
                  <li className="md:flex-1">
                    <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                      <span className="text-sm font-bold text-[#FFCB77]">
                        Step 2
                      </span>
                      <span className="text-xl font-semibold">
                        Upload your documents as a PDF
                      </span>
                      <span className="mt-2 text-zinc-700">
                        We&apos;ll process your file and make it ready for you
                        to chat with and gain insight.
                      </span>
                    </div>
                  </li>
                  <li className="md:flex-1">
                    <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
                      <span className="text-sm font-bold text-[#FFCB77]">
                        Step 3
                      </span>
                      <span className="text-xl font-semibold">
                        Start asking questions
                      </span>
                      <span className="mt-2 text-zinc-700">
                        It&apos;s really that simple. Try out notestep today -
                        it really takes less than reading the entire transcript.
                      </span>
                    </div>
                  </li>
                </ol>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                >
                  <div
                    style={{
                      clipPath:
                        "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                    className="
                      relative 
                      left-[calc(50%-13rem)] 
                      aspect-[1155/678] 
                      w-[36.125rem] 
                      -translate-x-1/2 
                      rotate-[30deg] 
                      bg-gradient-to-tr from-[#ffa585] to-[#ffeda0]
                      opacity-10 
                      sm:left-[calc(50%-36rem)] 
                      sm:w-[72.1875rem]"
                  />
                </div>

                <MaxWidthWrapper className="mb-12 mt-28 sm:mt-14 flex flex-col items-center justify-center text-center">
                  <h1 className="max-w-4xl text-2xl font-semibold md:text-3xl lg:text-5xl">
                    Use Cases for Notestep
                  </h1>
                </MaxWidthWrapper>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div className="flex flex-col items-center justify-center text-center">
                    <h2 className="text-xl font-semibold">For Students</h2>
                    <p className="mt-2 text-zinc-700">
                      Quickly understand your lecture notes, and identify key
                      points to focus on for your tests and exams.
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center">
                    <h2 className="text-xl font-semibold">For Professionals</h2>
                    <p className="mt-2 text-zinc-700">
                      Analyse meeting notes, and identify key action items for
                      higher chances to close deals faster.
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center">
                    <h2 className="text-xl font-semibold">For Researchers</h2>
                    <p className="mt-2 text-zinc-700">
                      Understand research papers, and identify key findings to
                      build on for your next publication.
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center">
                    <h2 className="text-xl font-semibold">For Businesses</h2>
                    <p className="mt-2 text-zinc-700">
                      Quickly understand tender requests, and identify key
                      requirements to write quality proposals.
                    </p>
                  </div>
                </div>

                <MaxWidthWrapper className="mb-12 mt-28 sm:mt-14 flex flex-col items-center justify-center text-center">
                  <h1 className="max-w-4xl text-2xl font-semibold md:text-3xl lg:text-5xl">
                    Frequently Asked Questions
                  </h1>
                </MaxWidthWrapper>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      Are the answers by Notestep accurate?
                    </AccordionTrigger>
                    <AccordionContent className="text-start">
                      Yes. We have designed our system to return the most
                      accurate answers from your files. We also made sure the
                      system only answers questions that are relevant to the
                      content of your file. So if your files are accurate, you
                      can trust Notestep&apos;s answers.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      What do I do if I stumble upon an issue?
                    </AccordionTrigger>
                    <AccordionContent className="text-start">
                      For now, you can reach out directly to me at
                      mthangcakani2@gmail.com to report the issue.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      I want to contribute to Notestep. What do I do?
                    </AccordionTrigger>
                    <AccordionContent className="text-start">
                      Reach out to mthangcakani2@gmail.com as to how you can
                      contribute. We would like to hear from you.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>
                      When will Notestep be available to the public?
                    </AccordionTrigger>
                    <AccordionContent className="text-start">
                      We are currently in the beta stage and are looking to
                      release Notestep to the public soon. Stay tuned for more
                      updates. If you would like early access, please reach out to mthangcakani2@gmail.com.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <MaxWidthWrapper className="mb-12 mt-36 sm:mt-14 flex flex-col items-center justify-center text-center">
                  <h1 className="max-w-4xl text-2xl font-semibold md:text-3xl lg:text-5xl">
                    Try us out for free
                  </h1>
                  <p className="mt-5 max-width-prose text-zinc-700 sm:text-lg">
                    Ctrl + F is overrated. Try Notestep today and see how you can save time and understand your documents faster.
                  </p>
                  <Link href="/dashboard" target="_blank">
                    <div
                      className="
                      flex
                      flex-row
                      mt-8
                      px-3
                      py-2
                      md:px-4
                      md:py-3
                      text-sm
                      md:text-lg
                      font-semibold
                      text-white
                      bg-black
                      z-20
                      rounded-md
                      shadow-md
                      backdrop-blur-md
                      transition-all
                      hover:bg-opacity-85
                    "
                    >
                      Try notestep for free
                    </div>
                  </Link>
                </MaxWidthWrapper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
