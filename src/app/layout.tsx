import type { Metadata } from "next";
import { inter, lexendDeca } from "@/app/fonts";
import cn from "@/utils/class-names";
import NextProgress from "@/components/next-progress";
import { ThemeProvider, JotaiProvider } from "@/app/shared/theme-provider";
import GlobalDrawer from "@/app/shared/drawer-views/container";
import GlobalModal from "@/app/shared/modal-views/container";
import AuthShell from "@/components/auth/auth-shell";
import { AuthProvider } from "@/components/auth/auth-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Ntumai Admin",
  description:
    "Operational control center for Ntumai commerce, dispatch, support, and platform administration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      // 💡 Prevent next-themes hydration warning
      suppressHydrationWarning
    >
      <body
        // to prevent any warning that is caused by third party extensions like Grammarly
        suppressHydrationWarning
        className={cn(inter.variable, lexendDeca.variable, "font-inter")}
      >
        <ThemeProvider>
          <NextProgress />
          <JotaiProvider>
            <AuthProvider>
              <AuthShell>{children}</AuthShell>
              <GlobalDrawer />
              <GlobalModal />
            </AuthProvider>
          </JotaiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
