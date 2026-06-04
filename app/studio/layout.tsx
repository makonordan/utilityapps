import { StudioHeader } from "@/components/studio/StudioHeader";

/**
 * Layout for /studio/*. The global UtilityApps header is suppressed on
 * these paths (see HideOnEmbed.extraPrefixes in app/layout.tsx) so this
 * adds the Studio-branded sticky header in its place. The global Footer
 * still renders — Studio inherits site-wide legal + social links.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StudioHeader />
      {children}
    </>
  );
}
