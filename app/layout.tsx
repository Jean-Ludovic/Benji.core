import './globals.css';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'Fastoche — Trouvez votre artisan',
  description:
    'Mettez en relation des artisans qualifiés et des particuliers pour des projets de peinture, rénovation, plâtrerie et décoration.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen w-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
