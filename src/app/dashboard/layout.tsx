import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";
import MainPage from "./main";
import Provider from "~/provider";
import { Toaster } from "~/components/ui/toaster";
export const metadata = {
  title: "Dashboard",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <Provider>
            <MainPage>{children}</MainPage>
          </Provider>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
