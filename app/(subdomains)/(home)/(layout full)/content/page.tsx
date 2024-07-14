import { Metadata } from "next";
import Image from "next/image";

import mainWebsiteStyles from "@/libs/styles/maincontent.module.css"
import win9xStyles from "@/libs/styles/win9x.module.css";
import { ViewsWidget } from "@/components/views/widget";

export const metadata: Metadata = {
  title:        'General Good Entertainment',
  description:  'Here are some games or movies Ive made over the years, feel free to check them out!',
  
  creator:        'M4cgyver',
  publisher:      'M4cgyver',

  openGraph: {
    title:        'General Good Entertainment',
    description:  'Here are some games or movies Ive made over the years, feel free to check them out!',
    url:          'https://m4cgyver.com/content',
    locale:       'en-US',
    type:         'website',
  }
};


export default function ContentPage() {
  return (<>
    <div id="title" className={`${mainWebsiteStyles.title} ${win9xStyles.window}`}>
      <div className={win9xStyles.title} >Introduction</div>
      <h1>{metadata.title?.toString()}</h1>
      <h2>{metadata.description?.toString()}</h2>
    </div>

    <ViewsWidget path="/" />

    <div id="content" className={`${mainWebsiteStyles.content} ${win9xStyles.window}`}>
      <div className={`${win9xStyles.title}`}>
        Content
      </div>
    </div>
  </>
  );
}
