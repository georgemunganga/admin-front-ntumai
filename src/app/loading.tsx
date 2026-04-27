"use client";

import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f1e8] px-6">
      <Image
        src="/brand/ntumai-logo-dark.png"
        alt="Ntumai"
        width={240}
        height={70}
        className="h-16 w-auto"
        priority
      />
      <span
        aria-label="Loading"
        className="mt-5 inline-block h-7 w-7 animate-spin rounded-full border-2 border-primary/25 border-t-primary"
      />
    </div>
  );
}
