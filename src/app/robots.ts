import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mendyr.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/patient/",
          "/nurse/",
          "/admin/",
          "/super-admin/",
          "/login",
          "/register/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
