// src/app/layout.tsx

import NavigationLayout from '@/components/NavigationLayout';
import '@/app/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavigationLayout />
        <main className="max-w-4xl mx-auto px-4 py-2"> {/* Reduced width and padding */}
          {children}
        </main>
      </body>
    </html>
  );
}
