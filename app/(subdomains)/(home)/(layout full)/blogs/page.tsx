import { Metadata } from "next";

import imageNextJS13OrderedLayout from "@/public/static/images/blogsnextjs13flexandordericon.jpeg"

import Image from "next/image"
import mainWebsiteStyles from "@/libs/styles/maincontent.module.css"
import win9xStyles from "@/libs/styles/win9x.module.css";
import { ViewsWidget } from "@/components/views/widget";
import { fontEagleSpCGA_Alt2x2, fontHP100LX6x8, fontPixelPirate, fontTerminal, fontToshibaTxL1, fontVerite9x14 } from "@/libs/fonts";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { getBlogListing } from "@/libs/database/blogs";
import { formatDateToMMMMDDYYYY } from "@/libs/date";

export const metadata: Metadata = {
  title: 'M4cgyvers Bountifull Blog Posts. ',
  description: 'Here are a list of all of the thoughts or comments I have about anything happening on the Internet (or internet).',

  creator: 'M4cgyver',
  publisher: 'M4cgyver',

  openGraph: {
    title: 'M4cgyvers Bountifull Blog Posts. ',
    description: 'Here are a list of all of the thoughts or comments I have about anything happening on the Internet (or internet).',
    url: 'https://m4cgyver.com/blogs',
    locale: 'en-US',
    type: 'website',
  }
};

const getCachedBlogListing = unstable_cache(async () => getBlogListing(), ['blog-listing']);

export default async function BlogsPage() {
  const posts = await getCachedBlogListing();
  const postLatest = posts[0];

  return (<>
    <div id="title" className={`${mainWebsiteStyles.title} ${win9xStyles.window}`}>
      <div className={win9xStyles.title} >Introduction</div>
      <h1>{metadata.title?.toString()}</h1>
      <h2>{metadata.description?.toString()}</h2>
    </div>

    <ViewsWidget path="/blogs" />

    <div id="content" className={`${mainWebsiteStyles.content}`} style={{marginTop: 22 }}>
      <span className={fontEagleSpCGA_Alt2x2.className} style={{ position: 'absolute', fontSize: 16, marginTop: -22, mixBlendMode:'exclusion' }}> Latest blost post (posted on {formatDateToMMMMDDYYYY(new Date(postLatest.published))}): </span>
      <div style={{ position: "relative", width: "100%", aspectRatio: "1920/1080", borderRadius: 10, overflow: "hidden" }}>
        <Link href={postLatest.location}>
        <Image src={imageNextJS13OrderedLayout} alt="" placeholder="blur" layout="fill" objectFit="cover" style={{ zIndex: -1 }} />
        <span style={{ display: 'block', width: "100%", height: "100%", backgroundColor: postLatest.iconBackground, padding: 4 }}>
          <span className={fontToshibaTxL1.className} style={{ position: 'absolute', bottom: 0, left: 0, padding: 4, color: 'black' }}>
            <h1 style={{ fontSize: "min(4vw, 4vh)" }}> {postLatest.title}</h1>
            <h3 className={fontToshibaTxL1.className} style={{ fontSize: "min(1.8vw, 1.8vh)", marginTop: -14, lineHeight: 1, fontWeight: 'normal' }}>{postLatest.descLong}</h3>
          </span>
        </span>
        </Link>
      </div>

      <div style={{height: "3vh"}} />

      <span className={fontEagleSpCGA_Alt2x2.className} style={{ position: 'absolute', fontSize: 16, mixBlendMode:'exclusion' }}> Older Blog postings... </span>
    </div>
  </>
  );
}
