"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

// Pre-filled "click to chat" link. The number is in international format
// without the leading + or zeros, as wa.me requires.
const WHATSAPP_URL =
  "https://wa.me/2348164315819?text=Hi%20Daniel!%20I'm%20using%20UtilityApps%20and%20I'd%20like%20help%20with...";

const TOOLTIP_DISMISSED_KEY = "ua-whatsapp-tooltip-dismissed";

/** Official WhatsApp glyph, rendered white. */
function WhatsAppGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-7 w-7 sm:h-8 sm:w-8"
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.142 1.595 5.945L0 24l6.305-1.654a11.962 11.962 0 0 0 5.71 1.453h.005c6.582 0 11.946-5.335 11.949-11.893a11.821 11.821 0 0 0-3.495-8.411z" />
    </svg>
  );
}

export function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  // Show the "Need help?" tooltip shortly after load, then auto-dismiss it —
  // unless the visitor has permanently dismissed it before.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(TOOLTIP_DISMISSED_KEY) === "1") return;
    } catch {
      /* localStorage blocked — just show the tooltip normally */
    }
    const showTimer = window.setTimeout(() => setShowTooltip(true), 1500);
    // Visible for 5 seconds after it appears.
    const hideTimer = window.setTimeout(() => setShowTooltip(false), 6500);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  const dismissForever = () => {
    setShowTooltip(false);
    try {
      localStorage.setItem(TOOLTIP_DISMISSED_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 sm:bottom-6 sm:right-6">
      {showTooltip && (
        <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-surface-800 shadow-lg ring-1 ring-surface-200 dark:bg-surface-800 dark:text-surface-100 dark:ring-surface-700">
          <span>Need help? Chat with us</span>
          <button
            type="button"
            onClick={dismissForever}
            aria-label="Dismiss this message"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-surface-400 transition hover:bg-surface-100 hover:text-surface-700 dark:hover:bg-surface-700 dark:hover:text-surface-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="flex h-[52px] w-[52px] items-center justify-center rounded-full text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 hover:scale-110 hover:shadow-[0_6px_18px_rgba(0,0,0,0.22)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 sm:h-[60px] sm:w-[60px]"
        style={{ backgroundColor: "#25D366" }}
      >
        <WhatsAppGlyph />
      </a>
    </div>
  );
}
