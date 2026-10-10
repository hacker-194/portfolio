import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

/**
 * Every route the site actually publishes: the front page and one case study
 * per project. Section anchors are deliberately left out, since a fragment is
 * not a page a crawler should index on its own.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...PROJECTS.map((project) => ({
      url: `${SITE_URL}/projects/${project.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
