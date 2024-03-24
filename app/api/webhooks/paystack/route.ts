import { headers } from "next/headers";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/app/db";

const secret = process.env.PAYSTACK_SECRET_KEY || '';

export default async function POST(req: Request) {
    
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    
    if (hash == req.headers.get('x-paystack-signature')) {
        // Get request body
        const webhook = await req.json();
        NextResponse.next({
            status: 200,
            statusText: 'Webhook received',
        });

        const subscription = await webhook.data;
        // Handle webhook
        switch (webhook.event) {
            case 'subscription.create': // Sent when a subscription is created successfully

               await db.user.update({
                   where: {
                       id: subscription.customer.metadata.userId,
                   },
                   data: {
                    paystackCustomerId: subscription.customer.customer_code,
                    paystackSubscriptionID: subscription.subscription_code,
                    paystackPriceId: subscription.plan[0].plan_code,
                    paystackCurrentPeriodEnd: new Date(subscription.next_payment_date * 1000),
                   }
               })

            case 'charge.success': // Sent when a subscription payment is made successfully
            case 'invoice.create': // Sent when an invoice is created to capture an upcoming subscription charge. Should happen 2-3 days before the charge happens
                await db.user.update({
                    where: {
                        paystackSubscriptionID: subscription.subscription_code,
                    },
                    data: {
                        paystackPriceId: subscription.plan[0].plan_code,
                        paystackCurrentPeriodEnd: new Date(subscription.next_payment_date * 1000),
                    }
                });
            case 'invoice.payment_failed': // Sent when a subscription payment fails
            case 'subscription.not_renew': // Sent when a subscription is canceled to indicate that it won't be charged on the next payment date
                await db.user.update({
                    where: {
                        paystackSubscriptionID: subscription.subscription_code,
                    },
                    data: {
                        paystackPriceId: subscription.plan[0].plan_code,
                        paystackCurrentPeriodEnd: null,
                    }
                })
            case 'subscription.disable': // Sent when a canceled subscription reaches the end of the subscription period
            case 'subscription.expiring_cards': // Sent at the beginning of each month with info on what cards are expiring that month
        }
        
    }
}