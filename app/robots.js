export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/dashboard' },
    sitemap: 'https://job-tracker-gamma-eight.vercel.app/sitemap.xml',
  };
}
