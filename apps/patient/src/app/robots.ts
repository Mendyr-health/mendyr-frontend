import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mendyr.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/patient/',
          '/nurse/',
          '/admin/',
          '/super-admin/',
          '/login',
          '/register/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
