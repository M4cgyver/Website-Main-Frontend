import type { Metadata } from "next";
import "@/app/globals.css";

import websiteIcon from "@/public/favicon.ico"
import mainWebsiteStylesSlim from "@/libs/styles/maincontent.slim.module.css"
import win9xStyles from "@/libs/styles/win9x.module.css";
import Link from "next/link";
import SlideshowWidget from "@/components/widgets/SlideshowWidget";

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
    <div id="container" className={mainWebsiteStylesSlim.container} >

      <div id="slideshow-newcontent" className={mainWebsiteStylesSlim.slideshow}>
        <SlideshowWidget />
      </div>

      <div id="navigation-top" className={mainWebsiteStylesSlim.navigationTop}>
        <ul>
          <li><Link href="/" prefetch={false}>Homepage</Link></li>
          <li><Link href="/contacts" prefetch={false}>Contact / Socials</Link></li>
          <li><Link href="/content" prefetch={false}>Games / MoviesClips</Link></li>
          <li><Link href="/blogs" prefetch={false}>Blog Postings</Link><ul>
            <li>April 1st Big Bear Trip</li>
            <li>Next Gridbox Ordered Layout</li>
            <li>Next Flexbox Ordered Layout</li>
            <li>....</li>
          </ul></li>
          <li><Link href="/projects" prefetch={false}>Projects</Link><ul>
            <li style={{ marginBottom: 8 }} >Public Archives</li>
            <li style={{ marginBottom: 8 }} >Nintendo DSi Gallary</li>
            <li style={{ marginBottom: 8 }} >Friends Custom Pages</li>
          </ul></li>
        </ul>
      </div>

      {children}

      <div id="footer" className={`${win9xStyles.window} ${mainWebsiteStylesSlim.footer}`}>
        <span className={mainWebsiteStylesSlim.disclaimer}>Not really Copyright 2023 M4cgyver © Creative Commons CC0, Just credit I really fucking hate the copyright system.</span>
      </div>
    </div>
  );
}