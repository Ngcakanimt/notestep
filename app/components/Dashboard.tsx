'use client'

import React, { useState } from 'react'
import UploadCard from './UploadCard'
import { trpc } from '../_trpc/client'
import { Clock, Ghost, Loader2, MessageCircle, MessageSquare, Plus, Trash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from './ui/button';
import WriteCard from './WriteCard';
import { toast } from '@/components/ui/use-toast';
import { getUserSubscriptionPlan } from '@/lib/paystack';

interface DashboardProps {
    subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

const Dashboard = ({subscriptionPlan}: DashboardProps) => {

    // State to check if a file is being deleted
    const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<string | null>(null);

    // Extra functionality to use trpc hooks
    const utils =  trpc.useUtils();

    // Get all user files
    const {data: files, isLoading } = trpc.getUserFiles.useQuery();

    // Delete a file
    const {mutate: deleteFile } = trpc.deleteFile.useMutation({
        // Refresh page after deleting a file
        onSuccess: () => {
            utils.getUserFiles.invalidate();
        },
        // Set the file to be deleted
        onMutate({ id }) {
            setCurrentlyDeletingFile(id);
        },
        // Set the file to be deleted to null after the mutation is settled
        onSettled() {
            setCurrentlyDeletingFile(null);
        }
    });

    return (
        <main className='mx-auto max-w-7xl md:p-10'>
            <>
            {/* Header */}
            <div className='flex flex-col gap-2 pb-5 pl-3 mt-3'>
                <h1 className='mb-3 font-bold text-2xl md:text-5xl text-gray-900'>
                    Dashboard
                </h1>
                <p className='text-neutral-700'>
                    Import your meeting to start getting insights or start writing a new note.
                </p>
            </div>

            {/* Upload Options */}
            <div className='grid md:grid-cols-2 grid-cols-1 gap-4 mt-3 pl-3 px-3'>
                <UploadCard 
                    iconPath='/images/upload.svg'
                    title='Import'
                    description='Import your PDFs'
                    isSubscribed={subscriptionPlan.isSubscribed}
                />
                <WriteCard
                    iconPath='/images/file-edit.svg'
                    title='Write'
                    description='Create a new note'
                    disabled={true}
                />
            </div>

            {/* My Files */}
            <div 
            className='
                mt-8
                pl-3 
                flex 
                flex-col 
                items-start 
                justify-between 
                gap-4 
                border-b 
                border-gray-200 
                pb-5
                sm:flex-row 
                sm:items-center 
                sm:gap-0
            '>  
                <h1 className='mb-3 font-bold md:text-2xl text-lg text-gray-900'>
                    My Files
                </h1>
            </div>
            </>

            {/* Display all user Files */}
            {files && files?.length !== 0 ? (
                <ul 
                className='
                    mt-8 
                    grid 
                    grid-cols-1 
                    gap-6 
                    divide-y 
                    divide-zinc-200 
                    md:grid-cols-2
                    lg:grid-cols-3
                    '>
                        {files.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => 
                            new Date(b.createdAt).getTime() - 
                            new Date(a.createdAt).getTime()
                            ).map((file: { id: React.Key | null | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; createdAt: string | number | Date; }) => (
                                <li 
                                key={file.id}
                                className='
                                    col-span-1
                                    divide-y
                                    divide-gray-200
                                    rounded-lg
                                    bg-white
                                    shadow
                                    transition

                                '>
                                    <Link 
                                        href={`/dashboard/${file.id}`}
                                        className='flex flex-col gap-2' 
                                    >
                                        <div className='pt-6 px-6 flex w-full items-center justify-center space-x-6'>
                                            <div className='h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-[#ffa585] to-[#ffeda0]' />
                                            <div className='flex-1 truncate'>
                                                <div className='flex items-center space-x-3'>
                                                <h3 className='truncate text-lg font-medium text-zinc-900'>
                                                    {file.name}
                                                </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    <div className='px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500'>
                                    <div className='flex items-center gap-2'>
                                        <Clock className='h-4 w-4' />
                                        {format(
                                        new Date(file.createdAt),
                                        'MMM yyyy'
                                        )}
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        <MessageCircle className='h-4 w-4' />
                                        Mocked
                                    </div>

                                    <Button
                                        onClick={() => {
                                            if (typeof file.id === 'string') {
                                                deleteFile({ id: file.id })
                                            }
                                            
                                        }}
                                        size={'sm'} 
                                        className='w-full' 
                                        variant={'destructive'}>
                                        {currentlyDeletingFile === file.id ? (
                                            <Loader2 className='h-4 w-4 animate-spin' />
                                            ) : (
                                            <Trash className='h-4 w-4' />
                                            )}
                                    </Button>
                                    </div>
                                </li>
                            ))}
                    </ul>
            ) : isLoading ? (
                
                <div className='mt-5 space-y-3'>
                   <Skeleton className='h-[100px]'/>
                   <Skeleton className='h-[100px]'/>
                   <Skeleton className='h-[100px]'/>
                </div>
            ) : (
                <div className='mt-16 flex flex-col items-center gap-2'>
                    <Ghost className='w-8 h-8' />
                    <h3 className='font-semibold text-xl'>Seems pretty empty around here</h3>
                    <p>Let&apos;s upload your first note</p>
                </div>
            )}
        </main>
  )
}

export default Dashboard