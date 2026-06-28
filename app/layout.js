import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'TrackJobs',
  description: 'Track your job applications',
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
