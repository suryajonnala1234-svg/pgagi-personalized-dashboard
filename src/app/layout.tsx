import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "../components/StoreProvider";
import { Sidebar, Header } from "../components/layout/Header";
import AuthProvider from "../components/auth/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personalized Content Dashboard",
  description: "Your personalized news and content aggregator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} transition-colors duration-200`}>
        <StoreProvider>
          <AuthProvider>
            {/* Main Layout Wrapper */}
            <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
              
              {/* Left Sidebar */}
              <Sidebar />
              
              {/* Right Content Area */}
              <div className="flex-1 flex flex-col min-w-0">
                
                {/* Top Header (Search & User profile) */}
                <Header />
                
                {/* Dynamic Page Content (Dashboard, Trending, etc.) */}
                <main className="flex-1 p-6 overflow-y-auto">
                  {children}
                </main>

              </div>
            </div>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
