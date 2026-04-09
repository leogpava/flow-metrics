import type { Metadata, Viewport } from 'next';
import { Lexend_Deca } from 'next/font/google';

import { MeshBackground } from '@/components/layout/MeshBackground';

import './globals.css';

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-lexend-deca'
});

export const metadata: Metadata = {
  title: 'FlowMetrics - Sua saúde em 3 minutos',
  description: 'Análise rápida de saúde com score personalizado, IMC e relatório por e-mail.'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={lexendDeca.variable}>
      <body className="relative min-h-screen bg-flow-bg text-flow-text antialiased">
        <MeshBackground />
        {children}
      </body>
    </html>
  );
}
