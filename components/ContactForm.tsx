import { TALLY_FORM_ID } from "@/lib/site";

/** The frame Tally is given. Its own script would resize; this does not load it. */
const EMBED_HEIGHT = 680;

/**
 * Contact form, served by Tally.
 *
 * The form lives on their domain and is embedded as a plain iframe, so the site
 * keeps no backend, ships no API key and gains no form-handling code. The frame
 * around it is ours: the panel, the rule and the labels are this site's own
 * typography, so the widget sits inside a designed block rather than floating on
 * the page, and its transparent background lets the parchment show through.
 *
 * Renders nothing at all until a form ID is configured, so an unconfigured
 * build can never show a broken embed; the section simply keeps the email
 * buttons it already has.
 */
export function ContactForm() {
  if (!TALLY_FORM_ID) return null;

  return (
    <div className="mx-auto mt-14 w-full max-w-2xl text-left">
      <div className="glass-card hairline relative overflow-hidden rounded-[3px] border p-6 sm:p-8">
        <span
          className="accent-rule pointer-events-none absolute inset-x-0 top-0 h-px"
          aria-hidden
        />

        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <span className="label-mono text-volt">Send a message</span>
          <span className="label-mono text-muted">Straight to my inbox</span>
        </div>

        <iframe
          src={`https://tally.so/embed/${TALLY_FORM_ID}?alignLeft=1&hideTitle=1&transparentBackground=1`}
          title="Contact form"
          loading="lazy"
          style={{ height: EMBED_HEIGHT }}
          className="mt-6 w-full rounded-[2px] border border-bright/10 bg-transparent"
        />
      </div>
    </div>
  );
}

export default ContactForm;
