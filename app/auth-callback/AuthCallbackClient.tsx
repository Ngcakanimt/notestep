'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { trpc } from '../_trpc/client';
import { Loader2 } from 'lucide-react';

const AuthCallbackClient = () => {

    const router = useRouter()

    const searchParams = useSearchParams();
    const origin = searchParams.get('origin');

    const { data, isLoading, error } = trpc.authCallback.useQuery(undefined, {
        retry: true,
        retryDelay: 500,
    });
    
    useEffect(() => {
        if (error && error.data?.code === 'UNAUTHORIZED') {
            router.push('/sign-in');
        } else if (!isLoading && data) {
            const isAuthenticated = data.success;
            router.push(isAuthenticated && origin ? `/${origin}` : '/dashboard');
        }
    }, [data, isLoading, error, origin, router]);
    
    
    
    return (
        <div className='w-full mt-24 flex justify-center'>
            <div className='flex flex-col items-center gap-2'>
                <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
                <h3 className='font-semibold'>Finalizing a few things...</h3>
                <p>You will be redirected when we&apos;re done</p>
            </div>
        </div>
    )
}

export default AuthCallbackClient
