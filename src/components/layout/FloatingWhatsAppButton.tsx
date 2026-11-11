import React from "react";

export const WHATSAPP_PHONE = "13802064792";
export const WHATSAPP_PREFILLED_MESSAGE =
  "Hello TAB V&S Group! I visited your website and would like to know more about your recruitment services.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
  WHATSAPP_PREFILLED_MESSAGE,
)}`;

/**
 * Global Floating WhatsApp Button
 *
 * Direct WhatsApp click-to-chat integration for TAB V&S Group Recruitment Agency.
 * - Circular 58px × 58px button fixed at the bottom-right corner.
 * - Official WhatsApp green (#25D366) with official white WhatsApp logo.
 * - Directly redirects to official WhatsApp URL (wa.me) in a new browser tab on desktop,
 *   or opens native WhatsApp application on mobile devices.
 * - Strictly avoids on-site chat widgets, chatbots, popups, or messaging forms.
 */
export function FloatingWhatsAppButton() {
  return (
    <aside
      aria-label="WhatsApp Contact"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom,0px))] right-[max(1rem,env(safe-area-inset-right,0px))] sm:bottom-6 sm:right-6 z-50 group"
    >
      {/* Floating Tooltip (Desktop) */}
      <span
        role="tooltip"
        className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 hidden whitespace-nowrap rounded-md bg-[#0B1F3A] px-3 py-1.5 text-xs font-semibold text-white shadow-md opacity-0 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 sm:inline-block"
      >
        Chat with Us on WhatsApp
        <span
          className="absolute left-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-l-[#0B1F3A]"
          aria-hidden="true"
        />
      </span>

      {/* Direct WhatsApp External Link */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Us on WhatsApp"
        title="Chat with Us on WhatsApp"
        className="flex size-[52px] sm:size-[58px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(0,0,0,0.18),0_2px_8px_rgba(37,211,102,0.45)] transition-all duration-200 ease-out hover:scale-110 hover:bg-[#20bd5a] hover:shadow-[0_6px_22px_rgba(0,0,0,0.22),0_4px_12px_rgba(37,211,102,0.55)] active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 cursor-pointer"
      >
        {/* Official WhatsApp Logo SVG */}
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="currentColor"
          aria-hidden="true"
          className="shrink-0 sm:w-8 sm:h-8"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </aside>
  );
}

