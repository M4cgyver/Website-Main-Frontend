import { Metadata } from "next";
import { hashDJB2, hashSHA3 } from "@/libs/algorithm";
 
export const metadata: Metadata = {
  title: 'M4cgyver\'s Offline WARC Viewer',
  description: 'A powerful, client-side WARC (Web ARChive) viewer built with Next.js. Browse and analyze web archives securely and privately without server uploads. Perfect for researchers, archivists, and web enthusiasts.',
  
  creator: 'M4cgyver',
  publisher: 'M4cgyver',
  
  referrer: 'origin-when-cross-origin',
  
  keywords: ['WARC', 'WARC Viewer', '.warc viewer', 'application', 'Web Archive', 'Offline Viewer', 'client side'],
  
  authors: [{ name: 'M4cgyver' }],
  
  viewport: 'width=device-width, initial-scale=1',
  
  openGraph: {
    title: 'M4cgyver\'s Offline WARC Viewer',
    description: 'Explore web archives securely with this powerful, client-side WARC viewer. No uploads, enhanced privacy, and lightning-fast performance.',
    url: 'https://archives.m4cgyver.com/warcs/offline',
    siteName: 'M4cgyver\'s Web Archive Tools',
    locale: 'en-US',
    type: 'website', 
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'M4cgyver\'s Offline WARC Viewer',
    description: 'Securely browse web archives with this powerful, client-side WARC viewer. No uploads, enhanced privacy, fast performance.',
    creator: '@M4cgyver', 
  },
};

const path = "/archives/warcs/offline";
const documentId = hashDJB2(hashSHA3(path));

export default async function ArchivesOfflineLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>
    {children}
  </>
}