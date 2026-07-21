import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";
import { TopNav } from "@/components/top-nav";
import { ToasterProvider } from "@/components/toaster-provider";

export const metadata = {
  title: "Learnboard — Your learning workspace",
  description:
    "Store YouTube learning resources, capture cute notes, and search everything in one delightful daily workspace.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>
          <Providers>
            <TopNav />
            <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
              {children}
            </main>
            <ToasterProvider />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
