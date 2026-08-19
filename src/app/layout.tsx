import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastContainer } from "@/components/toast";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Absensi KKN Sumanding 2026",
  description: "Aplikasi Absensi KKN Sumanding 2026 - Digital Identity Desa Sumanding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-slate-50 text-slate-900 dark:bg-forest-900 dark:text-mist-200 font-sans antialiased min-h-screen relative overflow-x-hidden">
        {/* Global Forest Background Glows */}
        <div className="fixed top-[-10%] left-[-10%] w-75 h-75 md:w-150 md:h-150 bg-pine-500/15 rounded-full blur-[80px] md:blur-[150px] pointer-events-none z-[-1]" />
        <div className="fixed bottom-[-10%] right-[-10%] w-75 h-75 md:w-150 md:h-150 bg-sprout-400/10 rounded-full blur-[80px] md:blur-[150px] pointer-events-none z-[-1]" />
        
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
