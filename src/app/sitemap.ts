import type { MetadataRoute } from "next";
import { MYTHES } from "@/content/mythes";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eco-warrior-site.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/mythes`, changeFrequency: "monthly", priority: 0.9 },
    ...MYTHES.map((m) => ({
      url: `${BASE_URL}/mythes/${m.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
