import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserButton, auth } from "@clerk/nextjs";
import { ArrowRight, Menu } from "lucide-react";
import React from "react";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { getUserSubscriptionPlan } from "@/lib/paystack";

const MobileNavbar = async () => {
  const { userId } = await auth();
  const isAuth = !!userId;

  const userSubscription = await getUserSubscriptionPlan();

    return (
        <div className="md:hidden block cursor-pointer">
            {!isAuth ? (
                <> 
                <div className="flex flex-row items-center">
                    <Sheet>
                        <SheetTrigger asChild >
                        <Menu />
                        </SheetTrigger>
                        <SheetContent className="w-[230px] sm:w-[4500px]">
                        <SheetHeader className="flex flex-row">
                            <SheetTitle>Greetings</SheetTitle>
                            
                        </SheetHeader>
                        <div className="flex flex-col py-4 justify-start">
                            <div className="flex flex-col items-start gap-4">
                            {/* <Link
                                href='/about'
                                className={buttonVariants({
                                variant: 'ghost',
                                size: 'sm',
                                })}>
                                About Us
                            </Link> */}
                            <Link
                                href='/pricing'
                                className={buttonVariants({
                                variant: 'ghost',
                                size: 'sm',
                                })}>
                                Pricing
                            </Link>
                            <Link
                                href='/sign-in'
                                className={buttonVariants({
                                variant: 'ghost',
                                size: 'sm',
                                })}>
                                Sign In
                            </Link>
                            <Link
                                href='/sign-up'
                                className={buttonVariants({
                                size: 'sm',
                                })}>
                                Get Started
                                <ArrowRight className="ml-2" />
                            </Link> 
                            </div>
                        </div>
                        <SheetFooter></SheetFooter>
                        </SheetContent>
                    </Sheet>
                    <div className='pl-5'>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                    
                </div>
                </>
            ) : (
                <>
                <div className="flex flex-row items-center">
                    <Sheet>
                        <SheetTrigger asChild>
                        <Menu />
                        </SheetTrigger>
                        <SheetContent className="w-[350px] sm:w-[540px]">
                        <SheetHeader className="text-start flex flex-row">
                            <SheetTitle>Welcome</SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col py-4 justify-start">
                            <div className="flex flex-col items-start gap-4">
                            {userSubscription.isSubscribed && (
                                <Link
                                href='/dashboard/billing'
                                className={buttonVariants({
                                variant: 'ghost',
                                size: 'sm',
                                })}>
                                Billing
                            </Link>
                            )}
                            <Link
                                href='/dashboard'
                                className={buttonVariants({
                                size: 'sm',
                                })}>
                                Go to Dashboard
                            </Link>
                            </div>
                        </div>
                        <SheetFooter></SheetFooter>
                        </SheetContent>
                    </Sheet>
                    <div className='pl-5'>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
                </>
            )}
        </div>
    )
}

export default MobileNavbar;
