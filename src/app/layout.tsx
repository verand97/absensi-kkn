import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastContainer } from "@/components/toast";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Absensi KKN Sumanding 2026",
  description: "Aplikasi Absensi KKN Sumanding 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 antialiased min-h-screen relative overflow-x-hidden`}>
        {/* Global Neon Background Blobs */}
        <div className="fixed top-[-10%] left-[-10%] w-75 h-75 md:w-150 md:h-150 bg-blue-500/10 rounded-full blur-[80px] md:blur-[150px] pointer-events-none z-[-1]" />
        <div className="fixed bottom-[-10%] right-[-10%] w-75 h-75 md:w-150 md:h-150 bg-green-400/5 rounded-full blur-[80px] md:blur-[150px] pointer-events-none z-[-1]" />
        
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
