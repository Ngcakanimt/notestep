import { trpc } from '@/app/_trpc/client'
import BillingForm from '@/app/components/billing/BillingForm'
import { getUserSubscriptionPlan, paystack } from '@/lib/paystack'

import React from 'react'

const page = async () => {
    
    

    const subscriptionPlan = await getUserSubscriptionPlan();
    

    return (
        <BillingForm subscriptionPlan={subscriptionPlan}/>
    )
}

export default page