import { useEffect } from 'react';

type AdBannerProps = {
  className?: string;
  label?: string;
  slot?: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const adsenseClient = import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined;
const defaultSlot = import.meta.env.VITE_ADSENSE_SLOT_ID as string | undefined;
const showTestAds = import.meta.env.VITE_SHOW_TEST_ADS !== 'false';

const AdBanner = ({ className = '', label = 'Advertisement', slot = defaultSlot }: AdBannerProps) => {
  const hasRealAdConfig = Boolean(adsenseClient && slot);

  useEffect(() => {
    if (!hasRealAdConfig || !adsenseClient) {
      return;
    }

    const scriptId = 'google-adsense-script';
    const existingScript = document.getElementById(scriptId);

    const requestAd = () => {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch {
        // Ad blockers or delayed third-party scripts can fail silently.
      }
    };

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`;
      script.onload = requestAd;
      document.head.appendChild(script);
      return;
    }

    requestAd();
  }, [hasRealAdConfig, slot]);

  if (!hasRealAdConfig || showTestAds) {
    return (
      <section className={`mx-auto max-w-6xl px-5 sm:px-8 ${className}`} aria-label={label}>
        <div className="flex min-h-28 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white/80 p-5 text-center shadow-sm">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-400">{label}</p>
            <p className="mt-2 text-sm font-bold text-slate-600">Test ad placement</p>
            <p className="mt-1 text-xs font-medium text-slate-400">Replace with AdSense IDs when your site is approved.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`mx-auto max-w-6xl px-5 sm:px-8 ${className}`} aria-label={label}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseClient}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </section>
  );
};

export default AdBanner;
