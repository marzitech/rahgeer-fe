"use client";

import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X } from "lucide-react";
import {
  APP_STORE_URL,
  PLAY_STORE_URL,
  QR_TARGET_URL,
} from "@/lib/appStores";

/**
 * "Get the Marzi App" QR modal — ported from marzi-web's
 * components/layout/DownloadAppModal.tsx, but hand-rolled (fixed overlay,
 * Escape/backdrop close) since this project has no Radix dialog primitives.
 * Shown on desktop/iOS; Android goes straight to the Play Store.
 */
export function DownloadAppModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Get the Marzi App"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-[420px] overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#821A52] via-[#E91E63] to-[#821A52]" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 flex size-8 items-center justify-center rounded-full bg-black/5 text-gray-500 transition hover:bg-black/10"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-8 pt-10 pb-4 text-center">
          <h2 className="font-display mb-2 text-3xl font-black leading-tight tracking-tight text-[#821A52]">
            Get the Marzi App
          </h2>
          <p className="text-sm font-medium text-gray-500">
            Scan to join our premium community on the go.
          </p>
        </div>

        <div className="relative flex flex-col items-center justify-center bg-gray-50/50 p-10 pt-4">
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#821A52]/5 blur-[80px]" />

          <div className="group relative">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#821A52] via-[#FF6B6B] to-[#E91E63] opacity-10 blur transition-opacity duration-500 group-hover:opacity-20" />
            <div className="relative flex transform items-center justify-center rounded-[2.5rem] border border-white bg-white p-6 shadow-xl transition-all duration-500 ease-out group-hover:scale-[1.02]">
              <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-[#821A52]/[0.02] to-transparent" />
              <QRCodeSVG
                value={QR_TARGET_URL}
                size={200}
                level="H"
                fgColor="#821A52"
                imageSettings={{
                  src: "/images/brand/marzi-favicon.png",
                  height: 52,
                  width: 52,
                  excavate: true,
                }}
              />
            </div>
          </div>

          <div className="mt-10 flex w-full flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                Available on
              </span>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black px-5 py-3 text-white transition-all hover:-translate-y-1 hover:bg-[#111111] hover:shadow-2xl active:scale-95"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 fill-current text-white transition-colors group-hover:text-emerald-400"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L18.65,14.12C20.62,13.04 20.62,10.95 18.65,9.88L16.81,8.88L14.41,11.27L16.81,15.12M14.41,12.71L16.03,14.33L4.54,20.57C4.69,20.63 4.84,20.66 5,20.66C5.38,20.66 5.75,20.48 6,20.15L14.41,12.71M14.41,11.27L6,3.85C5.75,3.52 5.38,3.34 5,3.34C4.84,3.34 4.69,3.37 4.54,3.43L16.03,9.67L14.41,11.27Z" />
                  </svg>
                  <div className="flex -space-y-1 flex-col items-start justify-center">
                    <span className="text-[10px] font-medium tracking-tight text-white/50 uppercase">
                      Get it on
                    </span>
                    <span className="text-base leading-tight font-bold">
                      Google Play
                    </span>
                  </div>
                </a>
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black px-5 py-3 text-white transition-all hover:-translate-y-1 hover:bg-[#111111] hover:shadow-2xl active:scale-95"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 fill-current text-white transition-colors group-hover:text-sky-400"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                  </svg>
                  <div className="flex -space-y-1 flex-col items-start justify-center">
                    <span className="text-[10px] font-medium tracking-tight text-white/50 uppercase">
                      Download on the
                    </span>
                    <span className="text-base leading-tight font-bold">
                      App Store
                    </span>
                  </div>
                </a>
              </div>
            </div>

            <div className="mt-4 w-full border-t border-gray-100/80 pt-6 text-center">
              <p className="text-[11px] font-medium tracking-wide text-gray-400 italic">
                Experience the joy of community in every swipe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
