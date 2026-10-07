"use client";

import dynamic from "next/dynamic";
import {
  useCoarsePointer,
  useDocumentVisible,
  useFinePointer,
  useStillMotion,
} from "@/lib/hooks";
import { radialGlow } from "@/lib/palette";

/**
 * WebGL is loaded on the client only, so the field never runs during SSR and
 * never blocks first paint — the page renders on its flat background first.
 */
const EmberField = dynamic(
  () => import("@/components/EmberField").then((mod) => mod.EmberField),
  { ssr: false },
);

/**
 * The site's background layer: a 3D ember field over a static wash, closed off
 * by a scrim.
 *
 * Three deliberate pieces:
 * - the wash gives the page a warm corner even before WebGL starts, so there is
 *   no flash of flat black;
 * - the field is the animated, cursor-reactive part;
 * - the scrim sits *above* the field and dims the top and bottom bands, which is
 *   what keeps headline contrast predictable no matter where a mote drifts.
 *
 * Sits at `z-0` with `pointer-events-none`, below the `z-10` content layer.
 */
export function SiteBackground() {
  const still = useStillMotion();
  const coarse = useCoarsePointer();
  const fine = useFinePointer();
  const visible = useDocumentVisible();

  return (
    <div
      aria-hidden
      data-site-background=""
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background: radialGlow("ember", 0.07, {
            geometry: "75% 65% at 72% 22%",
            stop: 62,
          }),
        }}
      />

      {/*
        Mounted once and only parked when the tab is hidden — unmounting would
        tear down the WebGL context and rebuild it on every tab switch.
      */}
      <EmberField
        className="absolute inset-0"
        still={still}
        simplified={coarse}
        interactive={fine && !still}
        running={visible}
      />

      {/* Contrast guard. Kept subtle: the field is atmosphere, not wallpaper. */}
      <div className="absolute inset-0 bg-gradient-to-b from-void/45 via-void/10 to-void/58" />
    </div>
  );
}
