"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, PinCode } from "rizzui";
import { useMedia } from "@/hooks/use-media";
import { routes } from "@/config/routes";

export default function OtpForm() {
  const router = useRouter();
  const isMedium = useMedia("(max-width: 1200px)", false);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    router.push(routes.auth.signIn);
  };

  return (
    <form className="space-y-10" onSubmit={handleSubmit}>
      <PinCode
        variant="outline"
        size={isMedium ? "md" : "lg"}
        className="lg:justify-start"
        setValue={(value) => setOtp(String(value))}
      />
      <Button
        className="h-11 w-full rounded-2xl !bg-primary !text-white text-base font-semibold"
        type="submit"
        size={isMedium ? "lg" : "xl"}
        isLoading={isSubmitting}
        disabled={otp.length < 6}
      >
        Verify OTP
      </Button>
      <div>
        <Button
          className="-mt-4 h-auto w-full p-0 text-base font-medium text-primary underline lg:inline-flex lg:w-auto"
          type="button"
          variant="text"
        >
          Resend OTP
        </Button>
      </div>
    </form>
  );
}
