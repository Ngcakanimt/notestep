import React from 'react'
import MaxWidthWrapper from '../MaxWidthWrapper'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { UserButton, auth } from '@clerk/nextjs'
import { ArrowRight, Menu } from 'lucide-react'
import MobileNavbar from './MobileNavbar'
import { getUserSubscriptionPlan } from '@/lib/paystack'


const Navbar = async() => {

  const { userId } = await auth();
  const isAuth = !!userId;

  const userSubscription = await getUserSubscriptionPlan();

  return (
    <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full backdrop-blur-lg transition-all mt-4'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between'>
          <Link
            href='/'
            className='flex z-40 font-semibold'>
            <span className='font-bold text-2xl'>notestep</span>
          </Link>

          <div className='hidden items-center space-x-4 md:flex'>
            {!isAuth ? (
              <>
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
            </>
            ) : (
              <>
              {!userSubscription.isSubscribed && (
                <Link
                href='/pricing'
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'sm',
                })}>
                Pricing
              </Link>
              )}
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

              <div className='pl-3'>
                <UserButton afterSignOutUrl="/" />
              </div>
            </>
            )}
            
          </div>
          <MobileNavbar />
        </div>
      </MaxWidthWrapper>

    </nav>
  )
}

export default Navbar