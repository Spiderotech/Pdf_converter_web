declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

const isAnalyticsEnabled = () => Boolean(measurementId);

export const initGoogleAnalytics = () => {
  if (!isAnalyticsEnabled() || window.gtag) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false,
  });
};

export const trackPageView = (path: string) => {
  if (!isAnalyticsEnabled() || !window.gtag) return;

  window.gtag('config', measurementId, {
    page_path: path,
  });
};

export const trackEvent = (eventName: string, params: Record<string, unknown> = {}) => {
  if (!isAnalyticsEnabled() || !window.gtag) return;

  window.gtag('event', eventName, params);
};

export const getFileSizeRange = (file: File) => {
  const sizeInMb = file.size / 1024 / 1024;

  if (sizeInMb <= 1) return '0_1_mb';
  if (sizeInMb <= 5) return '1_5_mb';
  if (sizeInMb <= 10) return '5_10_mb';
  if (sizeInMb <= 25) return '10_25_mb';
  return 'over_25_mb';
};
