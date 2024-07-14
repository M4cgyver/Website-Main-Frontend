import { Metadata } from "next";
import Image from "next/image";

import mainWebsiteStyles from "@/libs/styles/maincontent.module.css"
import win9xStyles from "@/libs/styles/win9x.module.css";
import { ViewsWidget } from "@/components/views/widget";

export const metadata: Metadata = {
  title: 'Projects and Workloads.',
  description: 'Here are some projects I have been working on, fell free to check them out. Javascript required for some projects!',

  keywords: ["m4cgyver", "projects"],

  creator: 'M4cgyver',
  publisher: 'M4cgyver',

  openGraph: {
    title: 'Projects and Workloads.',
    description: 'Here are some projects I have been working on, fell free to check them out. Javascript required for some projects!',
    url: 'https://m4cgyver.com/projects',
    locale: 'en-US',
    type: 'website',
  }
};

export default function ProjectsPage() {
  return (<>
  asdasdasdasdasd
    <div id="title" className={`${mainWebsiteStyles.title} ${win9xStyles.window}`}>
      <div className={win9xStyles.title} >Introduction</div>
      <h1>{metadata.title?.toString()}</h1>
      <h2>{metadata.description?.toString()}</h2>
    </div>

    <ViewsWidget path="/projects" />

    <div id="content" className={`${mainWebsiteStyles.content} ${win9xStyles.window}`}>
      <div className={`${win9xStyles.title}`}>
        Projects
      </div>
    </div>
  </>
  );
}
