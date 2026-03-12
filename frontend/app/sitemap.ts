import { MetadataRoute } from 'next';

const API = 'https://api.skillio.live';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: 'https://skillio.live', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://skillio.live/schools', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://skillio.live/activities', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://skillio.live/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://skillio.live/register', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: 'https://skillio.live/terms', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: 'https://skillio.live/privacy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ];

  try {
    const res = await fetch(`${API}/api/schools/`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const schools: { id: string; created_at?: string }[] = await res.json();
      const schoolPages: MetadataRoute.Sitemap = schools.map(s => ({
        url: `https://skillio.live/schools/${s.id}`,
        lastModified: s.created_at ? new Date(s.created_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
      return [...staticPages, ...schoolPages];
    }
  } catch {}

  return staticPages;
}
