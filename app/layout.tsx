import '@/styles/globals.css'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import localFont from "next/font/local"
import Link from 'next/link'
import { IoLogoGithub } from 'react-icons/io5';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex flex-col min-h-screen">
            <header className="container mx-auto p-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold">h_ngm_n</h1>
              <div className="flex items-center space-x-4">
                <Link href="https://github.com/jlm109-ua/hangman" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
                  <IoLogoGithub size={24} />
                </Link>
                <ThemeToggle />
              </div>
            </header>
            <main className="container mx-auto p-4 flex-grow">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}