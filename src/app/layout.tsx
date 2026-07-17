import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
      <body className={`${outfit.className} bg-slate-900 text-slate-100 antialiased min-h-screen relative overflow-x-hidden`}>
        {/* Global Neon Background Blobs */}
        <div className="fixed top-[-10%] left-[-10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-blue-500/10 rounded-full blur-[80px] md:blur-[150px] pointer-events-none z-[-1]" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-green-400/5 rounded-full blur-[80px] md:blur-[150px] pointer-events-none z-[-1]" />
        
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
