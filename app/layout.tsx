import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";


const Nunito = Nunito_Sans({
  variable: "--Nunito_Sans",
  subsets: ["latin"],
});




export const metadata: Metadata = {
  title: "AideGini",
  description: "Developed by hircs team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"  className={`${Nunito.variable}  antialiased`}>
      <body
        className={`${Nunito.variable}  antialiased overflow-x-hidden `}
      >
        <main>{children}</main>
        <Toaster richColors position="top-right"/>
        
      </body>
    </html>
  );
}
