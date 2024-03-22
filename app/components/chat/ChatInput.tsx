import { Textarea } from '@/components/ui/textarea'
import { ArrowUp, Send } from 'lucide-react'
import React, { useContext, useRef } from 'react'
import { ChatContext } from './ChatContext'

interface ChatInputProps {
  isDisabled: boolean,
}

const ChatInput = ({ isDisabled = false } : ChatInputProps) => {

  const { addMessage, handleInputChange, isLoading, message} = useContext(ChatContext)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  return (
    <div className='absolute bottom-0 left-0 w-full'>
      <form className='mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl'>
        <div className='relative flex h-full flex-1 items-stretch md:flex-col'>
          <div className='relative flex flex-col w-full flex-grow p-4'>
            <div className='relative'>
              <Textarea
                ref={textareaRef}
                rows={1}
                maxRows={4}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()

                    addMessage()

                    textareaRef.current?.focus()
                  }
                }}
                onChange={handleInputChange}
                value={message}
                placeholder='Ask your document a question...'
                className='
                  resize-none
                  pr-12
                  text-base
                  py-3
                  scrollbar-thumb-yellow
                  scrollbar-thumb-rounded
                  scroll-track-yellow-lighter
                  scrollbar-w-2
                  scrolling-touch
                '
              />
              <div
                className={`
                  absolute 
                  bottom-1.5 
                  right-[8px]
                  bg-[#FFCB77]
                  transition
                  duration-200
                  text-white 
                  rounded-md
                  h-9
                  w-9
                  flex 
                  items-center 
                  justify-center 
                  cursor-pointer
                  ${isLoading ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''}
                `}
                aria-label='send message'
                onClick={() => {
                  addMessage()

                  textareaRef.current?.focus()
                }}
              >
                <ArrowUp className='h-4 w-4' />
              </div>
            </div>
          </div>
        </div>
      </form>

    </div>
  )
}

export default ChatInput