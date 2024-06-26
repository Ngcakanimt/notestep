import ChatWrapper from '@/app/components/chat/ChatWrapper';
import PdfRenderer from '@/app/components/pdf/PdfRenderer';
import { db } from '@/app/db';
import { currentUser } from '@clerk/nextjs';
import { notFound, redirect } from 'next/navigation';
import React from 'react'

interface pageProps {
    params: {
        fileid: string
    }
    
}

const page: React.FC<pageProps> = async ({ params }) => {
  // Get the file id from the params
    const { fileid } = params;

    const user = await currentUser();

    if(!user || !user.id) {
        redirect(`/auth-callback?origin=dahsboard/${fileid}`)
    }

    // Make a DB Call to retrieve file
    const file = await db.file.findFirst({
        where: {
            id: fileid,
            userId: user.id
        }
    })

    if(!file) {
        notFound();
    }

    return (
        <div className='flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]'>
            <div className='mx-auto w-full max-w-8xl grow lg:flex xl:px-2'>
                {/* Left sidebar & main wrapper */}
                <div className='flex-1 xl:flex'>
                    <div className='px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6'>
                        {/* Main area */}
                        <PdfRenderer url={file.url} />
                    </div>
                </div>
                <div className='shrink-0 flex-[0.80] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0'>
                    <ChatWrapper fileId={file.id} />
                </div>
            </div>
        </div>
    )
}

export default page