import type { NextConfig } from "next";
import { MYTHES } from "./src/content/mythes";

const nextConfig: NextConfig = {
  async redirects() {
    // Anciennes URL (avant la refonte « On veut vivre ») → nouvelles pages.
    const mythes = MYTHES.filter((m) => m.ancienSlug).map((m) => ({
      source: `/debunk/${m.ancienSlug}`,
      destination: `/mythes/${m.slug}`,
      permanent: true,
    }));
    const retirees = ["/dashboard", "/timeline", "/map", "/calculator", "/articles/:path*", "/articles"].map(
      (source) => ({ source, destination: "/", permanent: true }),
    );
    return [
      ...mythes,
      { source: "/debunk", destination: "/mythes", permanent: true },
      { source: "/debunk/:path*", destination: "/mythes", permanent: true },
      ...retirees,
    ];
  },
};

export default nextConfig;
