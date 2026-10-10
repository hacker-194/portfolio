/**
 * Shared layout rhythm for the full-width sections.
 *
 * Every utility is written out in full rather than assembled from fragments:
 * Tailwind reads class names as plain text when it scans the source, so a name
 * it never sees as a literal would be dropped from the stylesheet.
 */
export const SECTION_CONTAINER =
  "relative mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12";
