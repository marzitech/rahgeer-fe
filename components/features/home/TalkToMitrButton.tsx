"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Phone } from "lucide-react";
import { createEnquiry } from "@/lib/api/endpoints";
import { ageFromDob, getAppUser } from "@/lib/app-user";
import { getAttribution } from "@/lib/attribution";

/** In-app "Talk to a Travel Mitr" CTA — one tap, no form. The app injects
 *  the logged-in user (see lib/app-user.ts), so the tap submits the lead
 *  directly to the sheet and shows the "Request received!" banner in place.
 *  Old app builds without the injected user fall back to /enquiry. */
export function TalkToMitrButton({
  label = "Talk to a Travel Mitr",
  form,
  className,
}: {
  label?: string;
  /** Sheet "Form" column value — which CTA converted (e.g. "app-hero"). */
  form: string;
  /** Full button styling — variants differ per section. */
  className: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [toastVisible, setToastVisible] = useState(false);

  // Success shows as a bottom toast (per the app design) and fades out on
  // its own; the button stays disabled so a lead can't be sent twice.
  useEffect(() => {
    if (!toastVisible) return;
    const timer = setTimeout(() => setToastVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [toastVisible]);

  async function handleClick() {
    if (state === "submitting" || state === "success") return;

    const user = getAppUser();
    if (!user) {
      router.push("/enquiry?source=app");
      return;
    }

    setState("submitting");
    try {
      const age = user.dob ? ageFromDob(user.dob) : null;
      await createEnquiry({
        full_name: user.fullName,
        phone: user.phone,
        ...(age !== null ? { age } : {}),
        trip_scope: "domestic",
        destination: "",
        message: [
          `Tapped "${label}" in the app.`,
          user.dob ? `DOB: ${user.dob}` : "",
        ]
          .filter(Boolean)
          .join(" "),
        source: "app",
        form,
        attribution: getAttribution(),
      });
      setState("success");
      setToastVisible(true);
    } catch {
      setState("error");
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={state === "submitting" || state === "success"}
        className={className}
      >
        <Phone className="h-4 w-4" fill="currentColor" strokeWidth={0} />
        {state === "submitting" ? "Sending…" : label}
      </button>

      {toastVisible ? (
        <div
          role="status"
          className="fixed inset-x-4 bottom-5 z-[120] flex items-start gap-3 rounded-2xl bg-[#e2f9e2] p-4 text-left shadow-lg"
        >
          <CheckCircle2
            className="h-6 w-6 shrink-0 text-[#147714]"
            fill="#147714"
            stroke="#e2f9e2"
          />
          <div className="text-sm text-[#147714]">
            <p className="font-bold">Request received!</p>
            <p>A Travel Mitr will be in touch soon.</p>
          </div>
        </div>
      ) : null}
      {state === "error" ? (
        <p className="mt-2 rounded-xl bg-white/95 px-4 py-2 text-center text-sm font-medium text-red-600 shadow-sm">
          Something went wrong. Please tap again.
        </p>
      ) : null}
    </div>
  );
}
