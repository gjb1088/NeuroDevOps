// dashboard/pages/_app.tsx
import '../styles/globals.css';
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import branding from '../config/branding';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', branding.primary);
    root.style.setProperty('--brand-accent',  branding.accent);
    root.style.setProperty('--brand-font',    branding.fontFamily);
    root.style.fontFamily = branding.fontFamily;
  }, []);

  return (
    <div className="min-h-screen bg-black text-brand selection:bg-brand selection:text-black">
      <Component {...pageProps} />
    </div>
  );
}
