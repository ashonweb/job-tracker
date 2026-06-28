import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'TrackJobs — Free Job Application Tracker',
  description: 'Track every job you apply to with a clean Kanban board. Move applications from Applied → Interview → Offer. Free forever.',
  keywords: 'job application tracker, job search tracker, job hunt organizer, track job applications, kanban job tracker',
  openGraph: {
    title: 'TrackJobs — Free Job Application Tracker',
    description: 'Stop losing track of your job applications. Clean Kanban board, free forever.',
    url: 'https://job-tracker-gamma-eight.vercel.app',
    siteName: 'TrackJobs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrackJobs — Free Job Application Tracker',
    description: 'Stop losing track of your job applications. Clean Kanban board, free forever.',
  },
  metadataBase: new URL('https://job-tracker-gamma-eight.vercel.app'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0f] text-white antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
