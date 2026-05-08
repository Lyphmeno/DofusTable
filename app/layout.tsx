import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lyphus",
  description: "Tracker prive d'achat revente Dofus",
  icons: {
    icon: "/assets/Lyphusfavicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d1117",
  width: "device-width",
  initialScale: 1
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
