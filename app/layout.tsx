import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import NavBar from '@/components/NavBar'
import { I18nProvider } from '@/components/I18nProvider'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Tolfa Booking',
  description: 'Roombooking for Tolfa',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" className={poppins.variable}>
      <body className="antialiased bg-gray-50 min-h-screen">
        <I18nProvider>
          <NavBar />
          <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </I18nProvider>
      </body>
    </html>
  )
}
