"use client";
import i18n from "../i18n";
import { I18nextProvider } from "react-i18next";
import { I18NProvider } from "next/dist/server/lib/i18n-provider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/component/nav/TopNav";
import Navbar from "@/component/nav/Navbar";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "./store";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

import { ToastContainer } from "react-toastify";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAsminDashboard = pathname === "/dashboard/admin";

  return (
    <html lang="vi">
      <SessionProvider>
        <Provider store={store}>
          <body className={`${geistSans.variable} ${geistMono.variable}`}>
            <I18nextProvider i18n={i18n}>
              <ToastContainer />

              {!isAsminDashboard && (
                <>
                  <TopNav />
                  <Navbar />
                </>
              )}
              {children}
            </I18nextProvider>
          </body>
        </Provider>
      </SessionProvider>
    </html>
  );
}
