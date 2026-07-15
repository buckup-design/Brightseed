import type { Metadata } from "next";

import { BrightseedLogin } from "@/components/auth/BrightseedLogin";

export const metadata: Metadata = { title: "Log in — Restrained" };

export default function RestrainedLoginPage() {
  return (
    <div className="mk-page flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-5xl">
        <BrightseedLogin variant="restrained" />
      </div>
    </div>
  );
}
