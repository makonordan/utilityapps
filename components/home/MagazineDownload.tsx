import { Download, Newspaper } from "lucide-react";

const MAGAZINE_URL = "/magazine/UtilityApps-Quarterly-Issue-01.pdf";

export function MagazineDownload() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div
        className="relative overflow-hidden rounded-3xl border border-surface-800 bg-gradient-to-br from-surface-950 via-surface-900 to-surface-950 p-8 text-center text-white sm:p-12"
        style={{ backgroundColor: "#020617" }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(0,102,255,0.4),rgba(124,58,237,0.4))] opacity-30 blur-3xl"
        />
        <div className="relative">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-glow">
            <Newspaper className="h-5 w-5" />
          </span>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary-300">
            Issue No. 01 · July 2026
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            The UtilityApps Quarterly is here
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-surface-300">
            Every update since our May launch, real traffic numbers, the honest story behind our
            AdSense review, and a first look at the Chrome extension and API. Free, 12 pages, no
            signup required.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={MAGAZINE_URL}
              download
              className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:from-primary-600 hover:to-accent-600"
            >
              <Download className="h-4 w-4" />
              Download the PDF
            </a>
          </div>
          <p className="mx-auto mt-4 max-w-md text-[11px] text-surface-500">
            Free PDF · ~1.9 MB · No email required
          </p>
        </div>
      </div>
    </section>
  );
}
