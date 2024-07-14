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
        <html lang="en">
            <body className={`${inter.className} ${fontToshibaTxL1.variable} ${fontMario.variable}`}>
                <div id="background" className="fixed top-0 left-0 w-screen h-screen z-[-1] bg-gray-900">
                    <Image src={backgroundImage} alt='Background image' placeholder="blur" layout="fill" objectFit="cover" />
                </div>
                {children}
            </body>
        </html>
    );
}