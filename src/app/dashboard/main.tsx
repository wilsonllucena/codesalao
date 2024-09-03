import React from "react";
import Link from "next/link";
import { Package2 } from "lucide-react";
import { Navbar } from "./_components/nav";
import { Content } from "./_components/Content";
import { Header } from "./_components/Header";

export default function MainPage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Package2 className="h-6 w-6" />
                <span className="">GlamUp</span>
              </Link>
            </div>
            <Navbar />
          </div>
        </div>
        <div className="flex flex-col">
          <Header />
          <Content>{children}</Content>,
        </div>
      </div>
    </>
  );
}
