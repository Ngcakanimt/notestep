import BillingForm from '@/app/components/billing/BillingForm'
import { getUserSubscriptionPlan, paystack } from '@/lib/paystack'
import { currentUser } from '@clerk/nextjs'
import { Paystack } from 'paystack-sdk'
import React from 'react'

const page = async () => {
    const user = await currentUser();

    const subscriptionPlan = await getUserSubscriptionPlan();
    

    return (
        <BillingForm subscriptionPlan={subscriptionPlan}/>
    )
}

export default page