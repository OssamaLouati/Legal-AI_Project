import { SessionProvider } from "next-auth/react"
import "./styles.css"
import "../styles/demo.css"
import type { AppProps } from "next/app"
import type { Session } from "next-auth"
import Head from "next/head"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Legal Ai</title>
        <link rel="icon" href="/favicon.ico" />
        {/* Add other meta tags, stylesheets, etc. as needed */}
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
