import { Metadata } from "next";

import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark, docco, nightOwl } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { exampleCode1, exampleCode2, } from './code';

import styles from "./page.module.css"
import mainWebsiteStylesSlim from "@/libs/styles/maincontent.slim.module.css"
import win9xStyles from "@/libs/styles/win9x.module.css";

import iconBlogNextjsFlexbox from "@/public/static/images/blogsnextjs13flexandordericon.jpeg";
import { fontHP100LX6x8, fontToshibaTxL1 } from "@/libs/fonts";
import Link from "next/link";
import { ViewTrackerImage, getCachedViewCount } from "@/components/views";
import { hashDJB2, hashSHA3 } from "@/libs/algorithm";
import { StickyBoard } from "@/components/stickyboard";
import { getCookie, getCookies } from "cookies-next";


export const metadata: Metadata = {
  title: 'NextJS App Ordered Layouts',
  description: 'Explore effective strategies for structuring your NextJS App layouts with precision. Learn how to arrange elements seamlessly within page.tsx and layout.tsx. Use styles, flexbox, and flexbox ordering to decupple the components ordering dependence to enhance user experience. ',
  
  keywords: ["nextjs", "flex", "order", "m4cgyver", "blogs"],

  creator: 'M4cgyver',
  publisher: 'M4cgyver',
  authors: [{ name: "M4cgyver" }],

  openGraph: {
    title: 'NextJS App Ordered Layouts',
    description: 'Explore effective strategies for structuring your NextJS App layouts with precision. Learn how to arrange elements seamlessly within page.tsx and layout.tsx. Use styles, flexbox, and flexbox ordering to decupple the components ordering dependence to enhance user experience. ',
    url: 'https://m4cgyver.com/blogs/nextjsapp-ordered-layout',
    locale: 'en-US',
    type: 'article',

    images: [
      {
        url: iconBlogNextjsFlexbox.src
      }
    ]
  }
};

export default function BlogsNextjsFlexboxOrderedLayout() {
  const path = "/blogs/nextjs-flexbox-ordered-layout";
  const documentId = hashDJB2(hashSHA3(path));
  const totalViews = getCachedViewCount({ documentId: documentId, uniqueViews: true })();

  return (<>
    <div id="title" className={`${mainWebsiteStylesSlim.title} ${win9xStyles.window}`}>
      <div className={win9xStyles.title} >Introduction</div>
      <h1>{metadata.title?.toString()}</h1>
      <h2>{metadata.description?.toString()}</h2>
      
      <div className={fontToshibaTxL1.className} style={{ color: 'grey', fontSize: 14, marginTop: 8, padding: 4, paddingBottom: 0, marginBottom: -6}}>
        <span style={{ float: "left" }}>Author: M4cgyver (Logan Rios)</span>
        <span style={{ float: "right" }}>Total Views: {totalViews}
          <ViewTrackerImage documentId={documentId} path={path} /> </span>
      </div>
    
    </div>

    <div id="content" className={mainWebsiteStylesSlim.content}>

      <div className={win9xStyles.window}>
        <h2 className={`${styles.title} ${fontHP100LX6x8.className}`}>Abstract</h2>

        <div className={styles.flexbox} style={{ padding: 4 }} >
          <span className={`${styles.paragraph} ${fontToshibaTxL1.className}`}>
            When looking into the new NextJS (app) layout format, its important to look at all the different ways to format your website. One effective approach to <em>intertwining elements</em> within  <span className={styles.darkhighlight}>page.tsx</span> and  <span className={styles.darkhighlight}>layout.tsx</span> using css <em>flex</em> and <em>order</em> properties. This method significantly reduces the amount of client-side code required for memorizing and caching props, especially since props in  <span className={styles.darkhighlight}>layout.tsx</span> remain static and do not update upon route changes. <br /><br />
            For example (this website), you want a dynamic <em>Title/Introduction</em> component on your website in <span className={styles.darkhighlight}>page.tsx</span>, then you want to statically declaring the <em>Navigation</em> component in <span className={styles.darkhighlight}>layout.tsx</span>, dynamically assigning the Content component based on <span className={styles.darkhighlight}>page.tsx</span>, and once again statically declaring the <em>Footer</em> component in <span className={styles.darkhighlight}>layout.tsx</span>, you can achieve a streamlined and efficient website structure while minimizing how much page and layout data gets sent to the user-end. <br /><br />
            In this blog post, we will delve into a method that organizes <span className={styles.darkhighlight}>page.tsx</span> and <span className={styles.darkhighlight}>layout.tsx</span> elements and components cohesively, employing CSS <em>flex</em> and <em>order</em> properties to optimize your website&apos;s layout and enhance user experience.<br /><br />
          </span>

          <table className={`${fontHP100LX6x8.className} ${styles.example1}`}>
            <thead>
              <tr>
                <th>Component</th>
                <th>Declaired in</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className={styles.exwindow} style={{ backgroundColor: "rgba(40, 156, 17, 0.452)" }}>Introduction</span></td>
                <td>page.tsx</td>
              </tr>
              <tr>
                <td><span className={styles.exwindow}>Navigation</span></td>
                <td>layout.tsx</td>
              </tr>
              <tr>
                <td><span className={styles.exwindow} style={{ backgroundColor: "rgba(40, 156, 17, 0.452)" }}>Content</span></td>
                <td>page.tsx</td>
              </tr>
              <tr>
                <td><span className={styles.exwindow}>Footer</span></td>
                <td>layout.tsx</td>
              </tr>
            </tbody>
          </table>
        </div>

        <span className={styles.spacer}></span>

        <h2 className={`${styles.title} ${fontHP100LX6x8.className}`}>Vanilla HTML</h2>
        <span className={`${styles.paragraph} ${fontToshibaTxL1.className}`}>
          According to the Mozilla Developer, <span className={styles.highlight1}>&quot;The <em>order</em> CSS property sets the <em>order</em> to lay out an item in a <em>flex</em> or grid container. Items in a container are sorted by ascending <em>order</em> value and then by their source code <em>order</em>.&quot;</span> <br /> <br />
          Lets look at an example in vanila HTML:
        </span>

        <div style={{ overflow: "auto" }}>
          <div className={win9xStyles.window} style={{ margin: 10 }}>
            <span className={win9xStyles.title}>Example Code</span>
            <SyntaxHighlighter language="html" style={nightOwl} customStyle={{ margin: 0, padding: 4, fontSize: 12 }}>
              {exampleCode1}
            </SyntaxHighlighter>
          </div>

          <div className={win9xStyles.window} style={{ margin: 10 }}>
            <span className={win9xStyles.title}>Example Code</span>
            <iframe srcDoc={exampleCode1} style={{ aspectRatio: 1920 / 1080 }} />
          </div>
        </div>

        <span className={`${styles.paragraph} ${fontToshibaTxL1.className}`}>
          <p style={{ marginBottom: 0 }}>There are a couple things to take away from the example;</p>
          <ul className={styles.listArrows} style={{ marginTop: 0, marginBottom: 0 }}>
            <li>First we declare the style of the ordered list to be a <Link href="https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox"><em>flexbox</em></Link> with the <Link href="https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction"><em>flex-direction</em></Link> to be a <em>column</em>.</li>
            <li>Then <span className={styles.highlight1}>(this step is not required)</span>, we declare <Link href="https://developer.mozilla.org/en-US/docs/Web/CSS/Child_combinator"><em>all of the child div elements</em></Link> to have color, font size, and margins to make our example look neater.</li>
            <li>Finally, we <em>set the order</em> of the list in each div inline style. As we can see in the code we declared Bread first and Eggs second, though Eggs show up first in the list since we set the order for the Eggs to be the first (1). </li>
          </ul>
          <em>Exercise: </em> How would someone insert another list item called Apples in between Bread and Potatoes?
        </span>

        <span className={styles.spacer}></span>

        <h2 className={`${styles.title} ${fontHP100LX6x8.className}`}>NextJS Example</h2>
        <span className={`${styles.paragraph} ${fontToshibaTxL1.className}`}>
          In the final example, we have created a NextJS 13 project with all of the code snippets in their propper files. We also have a live published demo, as well as all of the <em>app/</em> files. Click on one of the files in the drop down menu or on the list to view the code.
        </span>

        <style>
          {
            Object.keys(exampleCode2).map((key, index) => {
              const classname = key.replace(/\./g, "d").replace(/\//g, "s");
              return `#${classname} {display: none;}\n#${classname}:target {display:block}\n`;
            }).join('\n')
          }
        </style>

        <div style={{ display: "flex" }}>
          <div className={win9xStyles.window} style={{ margin: 10, position: "relative", backgroundColor: "rgb(1, 22, 39)", flex: "1" }}>
            <span className={win9xStyles.title}>Example NextJS Code</span>

            {/* Overlaying ul */}
            <ul style={{ display: "flex", flexWrap: "wrap", width: "100%", position: "relative", listStyle: "none", padding: 0, justifyContent: "space-around" }}>
              {Object.keys(exampleCode2).map((key, index) => {
                const classname = key.replaceAll(".", "d").replaceAll("/", "s");

                // Onclick toggle the highlight
                return (
                  <li key={index} style={{ marginRight: "10px", marginTop: "-3px", color: "wheat", backgroundColor: "#0f0f0f", borderRadius: "0 0 10px 10px" }}>
                    <a href={`#${classname}`} style={{ textDecoration: "none", color: "wheat", padding: "5px 10px", display: "block" }}>{key}</a>
                  </li>
                );
              })}
            </ul>

            {/* Formatted code */}
            {Object.entries(exampleCode2).map(([key, src], index) => {
              const classname = key.replaceAll(".", "d").replaceAll("/", "s");

              return (
                <div key={index} id={classname} style={{ position: "relative", zIndex: 0 }}>
                  <SyntaxHighlighter
                    language={classname.endsWith('.tsx') ? "typescript" : classname.endsWith(".css") ? "css" : "none"}
                    style={nightOwl}
                    customStyle={{ margin: 0, padding: 4, fontSize: 12 }}
                  >
                    {src}
                  </SyntaxHighlighter>
                </div>
              );
            })}
          </div>

          <div className={win9xStyles.window} style={{ margin: 10, position: "relative", backgroundColor: "rgb(1, 22, 39)", flex: "1" }}>
            <span className={win9xStyles.title}>Example NextJS Code</span>

            <iframe src="/etc/nextjs-flexbox-ordered-layout-example" style={{ height: "100%" }} />
          </div>
        </div>


        <span className={`${styles.paragraph} ${fontToshibaTxL1.className}`} style={{textAlign: "center", marginTop: 16, marginBottom: 16}}>
          Thats about it, you can find the full project at <Link href="https://github.com/M4cgyver/NextJS-13-Flexbox-and-Order/" target="_blank">https://github.com/M4cgyver/NextJS-13-Flexbox-and-Order/</Link>.
        </span>

      </div>

      <br />
      
      <StickyBoard documentId={documentId} path={path}/>

    </div>
  </>
  );
}
