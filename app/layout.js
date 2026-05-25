// import { Geist, Geist_Mono } from "next/font/google";
import "@/assets/styles/globals.css";
import AuthProvider from "@/components/AuthProvider.jsx";
import { ToastContainer } from "react-toastify";
import { GlobalProvider } from "@/context/GlobalContext.js";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleTagManager } from '@next/third-parties/google'
import TopNavBar from "@/components/TopNavBar";
import Footer from "@/components/Footer";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: {
    // %s will be replaced by the specific page's title
    template: '%s | Receipt Scan',
    // This is the fallback if a page doesn't define its own title
    default: 'Receipt Scan - Expense Tracker for Freelancers',
  },
  description: "Automated expense tracking for freelancers and small businesses",
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon/android-chrome-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicon/android-chrome-512x512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', type: 'image/png' },
    ],
  },
  // Add Google Site Verification code here if provided by Search Console
  verification: {
    google: '', 
  },
  // You can also add global open graph images here for social media sharing
  openGraph: {
    title: 'Receipt Scan',
    description: 'Automated expense tracking for freelancers and small businesses',
    url: 'https://www.receiptscan.org',
    siteName: 'Receipt Scan',
    images: [
      {
        url: 'https://www.receiptscan.org/assets/images/Receipt_Scan_logo_01.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <GlobalProvider>
      <AuthProvider>
        <html lang="en">
          <GoogleTagManager gtmId="GTM-MRCK7JQN" />
          {/* <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body> */}
          <body>
            <TopNavBar />
            <main id="main-children-container">{children}</main>
            <Footer />
            <ToastContainer />
            <SpeedInsights />
          </body>
        </html>
      </AuthProvider>
    </GlobalProvider>
  );
}
