'use client'

import Link from "next/link";
import styles from "./page.module.css"
import { useSearchParams } from "next/navigation";

export default function WarcViewerPage() {
  const params = useSearchParams();
  const uri = params.get('uri') ?? ''; // Get the 'uri' parameter from searchParams
  const apiViewUri = `${process.env.NEXT_PUBLIC_ARCHIVES_EXTERNAL_API}/view?uri=${uri}&redirect=true`;

  return (
    <main >
      <div className={styles.content}>
        <div className={styles.title} title={`Api URL: ${apiViewUri}`}>Viewing <Link href={uri} target="_blank">{uri}</Link></div>
        <span style={{ backgroundColor: "white", width: "100%", height: "100%" }}>
          <iframe style={{ width: "100%", height:"85vh", resize: 'vertical' }} src={apiViewUri} />
        </span>
      </div>
    </main>
  );
}
