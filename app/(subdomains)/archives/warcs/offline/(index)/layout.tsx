import { Metadata } from "next";
import { hashDJB2, hashSHA3 } from "@/libs/algorithm";

export const metadata: Metadata = {
  title: 'M4cgyvers Offline .WARC viewer ',
  description: 'THiss is an offline .warc viewer I made in NextJs. Its completly client sided so you dont upload anything to me improving in speed, privacy, and security!',

  creator: 'M4cgyver',
  publisher: 'M4cgyver',

  referrer: 'origin-when-cross-origin',

  openGraph: {
    title: 'M4cgyvers Offline .WARC viewer ',
    description: 'THiss is an offline .warc viewer I made in NextJs. Its completly client sided so you dont upload anything to me improving in speed, privacy, and security!',
    url: 'https://archives.m4cgyver.com/warcs/offline',
    locale: 'en-US',
    type: 'website',

  }
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