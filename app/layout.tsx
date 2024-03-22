import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "./libs/utils";
import Navbar from "./components/Navbar";

import { ClerkProvider } from '@clerk/nextjs'
import Providers from "./providers/Providers";
import { Toaster } from "@/components/ui/toaster";

import 'simplebar-react/dist/simplebar.min.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notestep - Know your next step to success",
  description: "Notestep is a AI powered note taking app that helps you analyze your meeting notes to identify your next steps and action items.",
};

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
