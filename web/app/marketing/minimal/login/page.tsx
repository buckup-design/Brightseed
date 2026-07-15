import type { Metadata } from "next";

import { BrightseedLogin } from "@/components/auth/BrightseedLogin";

export const metadata: Metadata = { title: "Log in — Minimal" };

export default function MinimalLoginPage() {
  return (
    <div className="mk-page flex min-h-svh flex-col items-center justify-center bg-white p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-5xl">
        <BrightseedLogin variant="minimal" />
      </div>
    </div>
  );
}
