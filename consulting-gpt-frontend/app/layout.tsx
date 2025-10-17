import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Metadata } from 'next';

import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Consulting GPT',
  description: 'AI-powered technology medical assessment and commercialization platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-gray-50`}
        suppressHydrationWarning={true}
      >
        <Providers>
          {children}
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              classNames: {
                toast: 'border text-foreground shadow-lg', // Base styles for all toasts
                title: 'text-sm font-semibold',
                description: 'text-xs',
                actionButton: 'bg-primary text-primary-foreground hover:bg-primary/90',
                cancelButton: 'bg-muted text-muted-foreground hover:bg-muted/90',
                loader: 'border-primary', // Color for the default loader spinner

                // Custom styles for specific toast types
                loading: 'bg-slate-700 text-white border-slate-600 ',
                success: 'bg-green-600 text-white border-green-700',
                error: 'bg-red-600 text-white border-red-700',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
