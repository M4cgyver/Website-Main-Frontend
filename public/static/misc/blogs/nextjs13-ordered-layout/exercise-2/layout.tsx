import "./globals.css"
import styles from "./layout.module.css"
import Link from "next/link"; 

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
            <Link href="/blogs/nextjs13-ordered-layout/exercise-2/">Index</Link>
            <Link href="/blogs/nextjs13-ordered-layout/exercise-2/about">About</Link>
            <Link href="/blogs/nextjs13-ordered-layout/exercise-2/contact">Contact</Link>
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