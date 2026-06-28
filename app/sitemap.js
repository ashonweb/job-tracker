export default function sitemap() {
  return [
    { url: 'https://job-tracker-gamma-eight.vercel.app', lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: 'https://job-tracker-gamma-eight.vercel.app/login', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: 'https://job-tracker-gamma-eight.vercel.app/signup', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
  ];
}
