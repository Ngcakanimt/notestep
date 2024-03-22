'use client'

import React, { useEffect, useState } from 'react'
import Messages from './Messages'
import ChatInput from './ChatInput'
import { trpc } from '@/app/_trpc/client'
import { ChevronLeft, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { ChatContextProvider } from './ChatContext'

interface ChatWrapperProps {
  fileId: string,
}

const ChatWrapper = ({
  fileId,
} : ChatWrapperProps) => {
  const [refetchInterval, setRefetchInterval] = useState<number | false>(500);
  const {data, isLoading} = trpc.getFileUploadStatus.useQuery({
    fileId,
  }, {
    refetchInterval,
  })

  // Alternative code to what was proposed because TS was not picking up on status parameter
  useEffect(() => {
    if (data?.status === 'SUCCESS' || data?.status === 'FAILED') {
      setRefetchInterval(false);
    }
  }, [data]);

  if(isLoading) {
    return (
      <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-2'>
            <Loader2 className='h-8 w-8 text-[#FFCB77] animate-spin' />
            <h3 className='font-semibold text-xl'>
              Loading...
            </h3>
            <p className='text-zinc-500 text-sm'>
              We&apos;re preparing your PDF.
            </p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    )
  }

  if(data?.status === "PROCESSING") {
    return (
      <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-2'>
            <Loader2 className='h-8 w-8 text-[#FFCB77] animate-spin' />
            <h3 className='font-semibold text-xl'>
              Processing...
            </h3>
            <p className='text-zinc-500 text-sm'>
              This shouldn&apos;t take long.
            </p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    )
  }

  if(data?.status === "FAILED") {
    return (
      <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-2'>
            <XCircle className='h-8 w-8 text-red-500' />
            <h3 className='font-semibold text-xl'>
              Your pdf has too many pages
            </h3>
            <p className='text-zinc-500 text-sm'>
              Your <span className='font-medium '>Free</span>{ ' ' } 
              account only supports up to 5 pages.
            </p>
            <Link
              href='/dashboard'
              className={buttonVariants({
                variant: 'secondary',
                className: 'mt-4',
              })}>
              <ChevronLeft className='h-3 w-3 mr-1.5' />
              Head back
            </Link>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    )
  }

  return (
    <ChatContextProvider fileId={fileId}>
    <div 
      className='
        relative 
        min-h-full  
        flex 
        flex-col 
        divide-y  
        justify-between 
        gap-2
    '>
      <div 
        className='
          flex-1
          justify-between
          flex
          flex-col
          mb-28
      '>
        <Messages fileId={fileId} />
      </div>
      <ChatInput isDisabled={true} />
    </div>
    </ChatContextProvider>
  )
}

export default ChatWrapper
