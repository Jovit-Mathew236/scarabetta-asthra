import "server-only";
import "@/styles/globals.css";

import "cal-sans";

import { ThemeProvider } from "@/components/theme-provider";
import TopNav from "@/components/madeups/top-nav";

export const metadata = {
  title: "SCARABETTA 709",
  description:
    "🔐🤩Calling all thrill-seekers and code-crackers to step into our treasure hunt sensation where each puzzle cracked and code mastered unlocks a world of excitement. 🖥Strap in and let the hunt begin!🔥",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TopNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
