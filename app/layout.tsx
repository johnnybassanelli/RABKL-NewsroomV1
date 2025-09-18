import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'RABKL Newsroom',
  description: 'ESPN/Woj-style fantasy news, automated.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-brand-bg text-brand-text">
        <header className="sticky top-0 z-50 bg-brand-navy text-white border-b-2 border-brand-red">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
            <img src="/brand/logo.png" alt="RABKL" className="h-8 w-8" />
            <nav className="ml-auto flex gap-6 text-sm">
              <Link href="/" className="hover:opacity-80">Home</Link>
              <Link href="/power" className="hover:opacity-80">Power Rankings</Link>
              <Link href="/teams" className="hover:opacity-80">Teams</Link>
              <Link href="/about" className="hover:opacity-80">About</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <footer className="mt-16 border-t border-brand-navy/15 bg-brand-bg2">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-brand-navy/80">
            © {new Date().getFullYear()} RABKL Newsroom • Next.js • Manus-powered content
          </div>
        </footer>
      </body>
    </html>
  );
}
