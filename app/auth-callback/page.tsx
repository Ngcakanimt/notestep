'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { trpc } from "../_trpc/client";
import { useEffect, Suspense } from "react";
import { Loader2 } from "lucide-react";
import AuthCallbackClient from "./AuthCallbackClient";


const LoadingFallback = () => (
  <div className="w-full mt-24 flex justify-center">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
      <h3 className="font-semibold text-xl">Finalizing your account...</h3>
      <p>You will be redirected when we are done</p>
    </div>
  </div>
);

const AuthCallbackContent = () => {
        const router = useRouter();

        const searchParams = useSearchParams();
        const origin = searchParams.get("origin");

        const { data, isLoading, error } =
          trpc.authCallback.useQuery(undefined);

        useEffect(() => {
          //error code unauthorized
          if (error?.data?.code === "UNAUTHORIZED") {
            router.push("/sign-in");
          } else if (!isLoading) {
            router.push(
              data !== undefined && data.success && origin
                ? `${origin}`
                : "/dashboard"
            );
          }
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [data, isLoading]);

        return null;

}



const Page = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <AuthCallbackClient />
        </Suspense>
    )

}


export default Page