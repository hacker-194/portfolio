import { PROFILE } from "@/lib/site";

/**
 * Live public repositories, read from the GitHub API.
 *
 * The site is statically prerendered, so this runs once at build time and then
 * on the server's revalidation cycle, so the section keeps itself current when a
 * new repository appears, with no redeploy.
 *
 * Next 16 made request caching opt-in, so `cache: "force-cache"` is not
 * decoration: without it the revalidate window means nothing. See
 * `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/fetch.md`.
 *
 * Failure is expected, not exceptional: the API rate-limits anonymous callers
 * and the build machine may be offline. Every failure path returns an empty list
 * rather than throwing, so a bad minute at GitHub can never break the build or
 * blank the page. The section renders its own empty state instead.
 */

export type Repo = {
  name: string;
  description: string;
  href: string;
  /** Falls back to a label so a repo without a detected language still groups. */
  language: string;
  updatedAt: string;
  stars: number;
};

/** How long a fetched page of repos is served before it is refreshed. */
export const REPO_REVALIDATE_SECONDS = 3600;

/**
 * One day of public activity, UTC-dated, for the contribution strip.
 * `count` is the number of public events GitHub reported for that day.
 */
export type ActivityDay = {
  date: string;
  count: number;
};

/** The strip shows the last thirteen weeks, which is a clean 13 by 7 grid. */
export const ACTIVITY_DAYS = 91;

const DAY_MS = 86_400_000;

/** Repos GitHub cannot classify still need somewhere to live in the graph. */
export const UNKNOWN_LANGUAGE = "Unclassified";

type GithubRepo = {
  name?: unknown;
  description?: unknown;
  html_url?: unknown;
  language?: unknown;
  updated_at?: unknown;
  stargazers_count?: unknown;
};

const asString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

/** Keeps the shape the UI depends on while trusting nothing about the payload. */
function toRepo(raw: GithubRepo): Repo | null {
  const name = asString(raw.name);
  const href = asString(raw.html_url);
  if (!name || !href) return null;

  return {
    name,
    description: asString(raw.description),
    href,
    language: asString(raw.language) || UNKNOWN_LANGUAGE,
    updatedAt: asString(raw.updated_at),
    stars: typeof raw.stargazers_count === "number" ? raw.stargazers_count : 0,
  };
}

export async function getRepos(): Promise<Repo[]> {
  const url = `https://api.github.com/users/${PROFILE.githubHandle}/repos?per_page=100&sort=updated`;
  const token = process.env.GITHUB_TOKEN;

  try {
    const response = await fetch(url, {
      cache: "force-cache",
      next: { revalidate: REPO_REVALIDATE_SECONDS, tags: ["github-repos"] },
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": PROFILE.githubHandle,
        // Optional: raises the anonymous rate limit. The site works without it.
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) return [];

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) return [];

    return payload
      .map((entry) => toRepo(entry as GithubRepo))
      .filter((repo): repo is Repo => repo !== null)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    return [];
  }
}

type GithubEvent = { type?: unknown; created_at?: unknown };

/**
 * The public events feed, bucketed into one count per day for the strip.
 *
 * The events endpoint needs no auth, so the strip works without `GITHUB_TOKEN`.
 * It only sees public events, which is exactly what it is labelled as: a
 * thirteen-week window of public GitHub activity, not a private contribution
 * graph.
 *
 * `null` means the API did not answer, and the section then renders no strip at
 * all rather than a grid that reads as "no activity".
 */
export async function getActivity(): Promise<ActivityDay[] | null> {
  const url = `https://api.github.com/users/${PROFILE.githubHandle}/events/public?per_page=100`;
  const token = process.env.GITHUB_TOKEN;

  let events: unknown;
  try {
    const response = await fetch(url, {
      cache: "force-cache",
      next: {
        revalidate: REPO_REVALIDATE_SECONDS,
        tags: ["github-activity"],
      },
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": PROFILE.githubHandle,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) return null;
    events = await response.json();
  } catch {
    return null;
  }

  if (!Array.isArray(events)) return null;

  const counts = new Map<string, number>();
  for (const entry of events) {
    const raw = (entry as GithubEvent).created_at;
    // `2026-03-04T11:22:33Z` is already UTC, so slicing keeps the date stable
    // whatever timezone the build machine happens to sit in.
    const day = typeof raw === "string" ? raw.slice(0, 10) : "";
    if (day.length !== 10) continue;
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }

  const today = Date.now();
  const days: ActivityDay[] = [];
  for (let offset = ACTIVITY_DAYS - 1; offset >= 0; offset -= 1) {
    const date = new Date(today - offset * DAY_MS).toISOString().slice(0, 10);
    days.push({ date, count: counts.get(date) ?? 0 });
  }

  return days;
}
