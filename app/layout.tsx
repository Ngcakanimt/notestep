import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "./libs/utils";
import Navbar from "./components/navigation/Navbar";

import { ClerkProvider } from '@clerk/nextjs'
import Providers from "./providers/Providers";
import { Toaster } from "@/components/ui/toaster";

import 'simplebar-react/dist/simplebar.min.css'
import { constructMetadata } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
    appearance={{
      signIn: { 
        variables: { colorPrimary: '#FFCB77' }
      },
      signUp: { 
        variables: { colorPrimary: '#FFCB77' }
      }
    }}
    >
      <html lang="en">
        <Providers>
          <body className={cn('min-h-screen font-sans antialiased', inter.className)}>
            <Toaster />
            <Navbar />
            {children}
          </body>
        </Providers>
      </html>
    </ClerkProvider>
  );
}
