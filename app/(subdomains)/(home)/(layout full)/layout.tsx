import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Image from "next/image";

import websiteIcon from "@/public/favicon.ico"
import backgroundImage from "@/public/static/images/asdf2.jpg";
import mainWebsiteStyles from "@/libs/styles/maincontent.module.css"
import win9xStyles from "@/libs/styles/win9x.module.css";
import { fontMario, fontToshibaTxL1 } from "@/libs/fonts";
import Link from "next/link";
import LinksFriends from "@/components/friends";
import SlideshowWidget from "@/components/widgets/SlideshowWidget";
import { ViewsForPage, ViewsForSite } from "@/components/views";
import { NavigationRHS } from "@/components/navigation/main";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://m4cgyver.net'),

  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },

  openGraph: {
    images: websiteIcon.src,
    locale: 'en-US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div id="container" className={mainWebsiteStyles.container}>

      <div id="slideshow-newcontent" className={mainWebsiteStyles.slideshow}>
        <SlideshowWidget />
      </div>

      <NavigationRHS />

      <div id="frends-and-interests" className={`${mainWebsiteStyles.friendsAndInterests} ${win9xStyles.window}`} >
        <span className={win9xStyles.title}>Frends and Links</span>
        <div id="friends-container" className={mainWebsiteStyles.friendsContainer}>
          <LinksFriends />
        </div>
      </div>


      {children}

      <div id="footer" className={`${win9xStyles.window} ${mainWebsiteStyles.footer}`}>
        <span className={mainWebsiteStyles.disclaimer}>Not really Copyright 2023 M4cgyver © Creative Commons CC0, Just credit I really fucking hate the copyright system.</span>
      </div>
    </div>
  );
}