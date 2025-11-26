import './globals.css';
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="bg-zinc-50 text-zinc-900">{children}</body>
    </html>
  );
}
