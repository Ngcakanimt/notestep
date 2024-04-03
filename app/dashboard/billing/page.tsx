import { trpc } from '@/app/_trpc/client'
import BillingForm from '@/app/components/billing/BillingForm'
import { db } from '@/app/db'
import { getUserSubscriptionPlan, paystack } from '@/lib/paystack'
import { currentUser } from '@clerk/nextjs'

import React from 'react'

const page = async () => {
    
    const subscriptionPlan = await getUserSubscriptionPlan();

    const user = await currentUser();

    if (!user) {
        return new Error('User not found');
    }

    const dbUser = await db.user.findFirst({
        where: {
            id: user.id
        }
    })

    if (!dbUser) {
        return new Error('User not found in database');
    }

    const url = `https://api.paystack.co/subscription/${dbUser.paystackSubscriptionID}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET_KEY}`,
        },
    })
    
    const data = await response.json();

    return (
        <BillingForm subscriptionPlan={subscriptionPlan} userSubscription={data}/>
    )
}

export default page