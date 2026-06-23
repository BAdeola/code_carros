import type { Metadata } from "next";
import { Lexend_Exa, Lexend_Zetta } from 'next/font/google';
import "./globals.css";

const lexendExa = Lexend_Exa({
  variable: "--font-lexend-exa",
  subsets: ["latin"],
  weight: ['400', '700', '900'],
});

const lexendZetta = Lexend_Zetta({
  variable: "--font-lexend-zetta",
  subsets: ["latin"],
  weight: ['400', '700', '900'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Code Carros',
    default: 'Code Carros | Plataforma de Negócios Automotivos', 
  },
  description: 'Gestão inteligente, catálogo exclusivo de veículos seminovos e conexão direta com as melhores concessionárias.',
  openGraph: {
    title: 'Code Carros | Plataforma de Negócios Automotivos',
    description: 'Os melhores veículos seminovos do mercado em um só lugar.',
    url: 'https://code-carros.vercel.app',
    siteName: 'Code Carros',
    images: [
      {
        url: 'https://code-carros.vercel.app/logo_c.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      className={`${lexendExa.variable} ${lexendZetta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
