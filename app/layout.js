import { Cormorant_Garamond, Great_Vibes } from 'next/font/google'
import './globals.css'

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '600'], style: ['normal', 'italic'], variable: '--font-serif' })
const script = Great_Vibes({ subsets: ['latin'], weight: '400', variable: '--font-script' })

export const metadata = { title: 'A letter for Dana', description: 'A letter made with Linky' }
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' }

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${script.variable}`}>
      <body className="lock">{children}</body>
    </html>
  )
}
