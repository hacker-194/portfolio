import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Phrasing removed from the site for reading as machine-written.
 *
 * Two sources. The first group is copy retired from earlier drafts, each for a
 * reason worth remembering. The second is the stock vocabulary that gives
 * generated prose away, taken from the same lexicon used to sweep the source for
 * slop words and invisible characters.
 *
 * The browser suite asserts none of it reaches the rendered page. This list
 * repeats the check at the source, because a page-level check only sees the
 * routes it visits: a social card, an `alt` string or an image route can carry a
 * retired phrase on a URL the page sweep never loads.
 */
const RETIRED = [
  /* Retired from a draft. */
  "not a highlight reel",
  "not a scoreboard",
  "described exactly",
  "Nothing here is inflated",
  "the card says so plainly",
  "Language sets the colour",
  "keeps up with the work on its own",
  "a record of what is being studied, not a blog",
  "No percentage bars",
  "exactly where they sit today",
  "listed as direction, not delivered work",
  "Drag-free",
  "Building intelligent systems at the intersection",
  "where data meets delivery",
  "Everything above is verifiable",
  "packaged for public release",
  "kept as an archive",
  "fine-tuning landscape",
  "Built with Next.js",
  "This isn't shipped production work",
  "Decision-ready",
  "Read live from the GitHub API and refreshed",

  /*
   * Stock vocabulary. None of these say anything a plainer word would not, and
   * between them they are the strongest single signal that a paragraph was not
   * written by hand. One exception worth stating: "robust" stays allowed,
   * because robustness is a real property a model either has or does not.
   */
  "delve",
  "leverage",
  "seamless",
  "tapestry",
  "testament to",
  "in today's",
  "ever-evolving",
  "game-changer",
  "cutting-edge",
  "unlock the",
  "dive into",
  "in front of you",
  "it's not just",
  "not only",
  "effortless",
  "empower",
  "elevate",
  "harness",
  "foster",
  "pivotal",
  "meticulous",
  "comprehensive",
  "holistic",
  "streamline",
  "synergy",
  "paradigm",
  "myriad",
  "plethora",
  "curated",
  "showcas",
  "journey",
  "realm",
  "utiliz",
  "moreover",
  "furthermore",
  "crucial",
  "vibrant",
  "stunning",
  "innovative",
  "powerful",
  "deliverable",
  "fast-paced",
  "at the end of the day",
  "raised the bar",
  "needle-moving",
  "state of the art",
];

/** Written as an escape so this file can be read without being a false positive. */
const EM_DASH = "\u2014";

/**
 * Bans the em dash and the retired phrasing from source.
 *
 * The em dash is checked in comments as well, because that is where every one of
 * them lived: it is the single most mechanical tell that a page was not written
 * by hand, and a comment is where it tends to be reintroduced.
 *
 * Retired phrasing is checked only in strings, template literals and JSX text,
 * which are the places a phrase can reach a reader. Checking comments too would
 * make it impossible to write a comment explaining why a phrase was retired.
 */
const copyGuard = {
  rules: {
    guard: {
      meta: {
        type: "problem",
        docs: { description: "no em dashes, no retired copy" },
        messages: {
          dash: "Em dash is banned here. Use a comma, a colon or a full stop.",
          retired:
            'Retired phrasing "{{phrase}}" puts machine-flavoured copy back on the page.',
        },
        schema: [],
      },
      create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode();

        const checkDash = (value, target) => {
          if (value.includes(EM_DASH)) {
            context.report({ ...target, messageId: "dash" });
          }
        };

        const checkRetired = (value, node) => {
          const lower = value.toLowerCase();
          for (const phrase of RETIRED) {
            if (lower.includes(phrase.toLowerCase())) {
              context.report({ node, messageId: "retired", data: { phrase } });
            }
          }
        };

        return {
          Program() {
            for (const comment of sourceCode.getAllComments()) {
              checkDash(comment.value, { loc: comment.loc });
            }
          },
          Literal(node) {
            if (typeof node.value !== "string") return;
            checkDash(node.value, { node });
            checkRetired(node.value, node);
          },
          TemplateElement(node) {
            checkDash(node.value.raw, { node });
            checkRetired(node.value.cooked ?? node.value.raw, node);
          },
          JSXText(node) {
            checkDash(node.value, { node });
            checkRetired(node.value, node);
          },
        };
      },
    },
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Installed agent-skill harnesses ship bundled vendor JS; not our source.
    ".claude/**",
    ".cursor/**",
    "tsconfig.tsbuildinfo",
  ]),
  {
    // Scoped to source on purpose: this file itself holds the banned phrases,
    // and linting the list would make the rule fail on its own definition.
    files: [
      "app/**/*.{ts,tsx}",
      "components/**/*.{ts,tsx}",
      "lib/**/*.{ts,tsx}",
      "next.config.ts",
    ],
    plugins: { copy: copyGuard },
    rules: { "copy/guard": "error" },
  },
]);

export default eslintConfig;
