import { Nunito } from 'next/font/google'


import './globals.css'

export const metadata = {
  title: 'LEGAL AI',
  description: 'LEGAL AI',
}

const font = Nunito({ 
  subsets: ['latin'], 
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
