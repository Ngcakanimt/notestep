"use client";

import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { getUserSubscriptionPlan } from "@/lib/paystack";
import React from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { db } from "@/app/db";


interface BillingFormProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

const BillingForm = ({ subscriptionPlan }: BillingFormProps) => {

  const { toast } = useToast();

  
  const { mutate: manageUserSubscriptionLink, isPending } =
    trpc.manageUserSubscription.useMutation({
      onSuccess: ({ url }) => {
        if (url) {
          window.location.href = url;
        }
        if (!url) {
          toast({
            title: "A problem occurred...",
            description: "Please try again shortly",
            variant: "destructive",
          });
        }
      },
    });

  return (
    <MaxWidthWrapper className="max-w-5xl">
      <form
        className="mt-12"
        onSubmit={(e) => {
          e.preventDefault();
        // manageUserSubscriptionLink();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on the{" "}
              {/* <strong>{userSubscriptionPlan.plan.name}</strong> plan. */}
            </CardDescription>
          </CardHeader>

          <CardFooter
            className="
                flex 
                flex-col 
                items-start 
                space-y-2 
                md:flex-row 
                md:justify-between 
                md:space-x-0
            "
          >
            <Button type="submit">
              {isPending ? (
                <Loader2 className="mr-4 h-4 w-4 animate-spin" />
              ) : null}
              {subscriptionPlan.isSubscribed
                ? "Manage Subscription"
                : "Upgrade to PRO"}
            </Button>

          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
};

export default BillingForm;
