import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Footer, Header } from './ui'
import { SettingsProvider } from './providers/settings';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  // metadataBase: new URL(''),
  title: 'Simiverse',
  description: 'blog',
  keywords: ['tech', 'software', 'simulations', 'ai', 'llms', 'simulation theory', 'threejs'],
  applicationName: 'Simiverse',
  openGraph: {
    type: 'website',
    // url: '',
    description: 'blog',
    siteName: 'Simiverse',
    images: ['']
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SettingsProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <main className='relative flex flex-col min-h-screen '>
            <Header/>
            {children}
            <Footer/>
          </main>
        </body>
      </html>
      </SettingsProvider>

  )
}
