import React from 'react';

import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { db } from '../db';
import Dashboard from '../components/Dashboard';
import { getUserSubscriptionPlan } from '@/lib/paystack';

const Page = async () => {
    const user = await currentUser();

    if(!user || !user.id) {
        redirect('/auth-callback?origin=dashboard ');
    }

    const dbUser = await db.user.findFirst({
        where: {
            id: user.id,
        }
    });

    if(!dbUser) {
        redirect('/auth-callback?origin=dashboard');
    }

    const subscriptionPlan = await getUserSubscriptionPlan();

    return (
        <div>
            <Dashboard subscriptionPlan={subscriptionPlan} />
        </div>
    );
};

export default Page;
