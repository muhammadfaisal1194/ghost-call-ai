import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "GhostCall AI — We make the calls you've been avoiding",
  description: "AI voice agent that makes phone calls on your behalf. Enter your mission, provide a number, and let the AI handle the conversation.",
  openGraph: {
    title: "GhostCall AI",
    description: "AI voice agent that makes phone calls on your behalf.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0D0B1E] text-white min-h-screen">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(26, 24, 48, 0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#F8F8FF",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </body>
    </html>
  );
}
