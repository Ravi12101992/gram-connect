import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'GramConnect — Smart Village Development App | మన గ్రామం · మన బాధ్యత',
  description:
    'GramConnect: Flowchart-based Smart Village Development Platform for Citizens, Panchayat Admin, and Field Workers. Report, Review, Assign, Execute, Verify, and Close village grievances.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 min-h-screen flex flex-col font-sans">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
