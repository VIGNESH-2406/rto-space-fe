import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
});

export const metadata = {
  title: "RTO space"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={cn(
          "h-screen bg-background",
          poppins.className
        )}
      >
        {children}
      </body>
    </html>
  );
}
