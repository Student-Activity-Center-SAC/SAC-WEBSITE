import type { MetadataRoute } from 'next';
import { DOMAIN_SLUGS } from '@/lib/content/domains';
import { CLUB_SLUGS } from '@/lib/content/clubs';
import { NEWS_SLUGS, STORY_SLUGS } from '@/lib/content/site-content';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://sacactivities.kluniversity.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                            lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/about`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/domains`,               lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/clubs`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/stories`,               lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/news`,                  lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/achievements`,          lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/publications`,          lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/leadership`,            lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/collaborate`,           lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`,               lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
  ];

  const domainRoutes: MetadataRoute.Sitemap = DOMAIN_SLUGS.map(slug => ({
    url: `${BASE_URL}/domains/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const clubRoutes: MetadataRoute.Sitemap = CLUB_SLUGS.map(slug => ({
    url: `${BASE_URL}/clubs/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const newsRoutes: MetadataRoute.Sitemap = NEWS_SLUGS.map(slug => ({
    url: `${BASE_URL}/news/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const storyRoutes: MetadataRoute.Sitemap = STORY_SLUGS.map(slug => ({
    url: `${BASE_URL}/stories/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...domainRoutes, ...clubRoutes, ...newsRoutes, ...storyRoutes];
}
