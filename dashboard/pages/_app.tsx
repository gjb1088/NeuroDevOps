// dashboard/pages/_app.tsx
import '../styles/globals.css';
export default function App({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-burn-bg text-burn-neon font-mono">
      <Component {...pageProps} />
    </div>
  );
}
