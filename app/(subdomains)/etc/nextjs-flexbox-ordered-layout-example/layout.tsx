import "./globals.css"
import styles from "./layout.module.css"
import Link from "next/link"; 

const baseUrl = "http://localhost:3000/etc/nextjs-flexbox-ordered-layout-example";

/*The main root layout*/
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
          
          { /* The navigation element for the layout */ }
          <div className={styles.navigation}>
            <Link href={`${baseUrl}/`}>Index</Link>
            <Link href={`${baseUrl}/about`}>About</Link>
            <Link href={`${baseUrl}/contact`}>Contact</Link>
          </div>

          { /* The footer element for the layout */ }
          <div className={styles.footer}>
            This is a footer! Super secret text down here!
          </div>

          {children}
      </body>
    </html>
  )
}