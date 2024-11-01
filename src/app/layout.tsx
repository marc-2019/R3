// src/app/layout.tsx

import NavigationLayout from '@/components/NavigationLayout'
import '@/app/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NavigationLayout />
        <main className="max-w-7xl mx-auto px-4">{children}</main>
      </body>
    </html>
  )
}