# SEO Audit — skillio.live

**Date:** 2026-03-12

## Current State

| Item | Status |
|------|--------|
| `robots.txt` | ❌ Missing (404) |
| `sitemap.xml` | ❌ Missing (404) |
| `<html lang="bg">` | ✅ Present |
| Page title | ✅ "Skillio - Детски дейности и курсове" |
| Meta description | ⚠️ Only in layout.tsx, generic |
| Open Graph tags | ❌ Missing |
| Twitter Card tags | ❌ Missing |
| Schema.org markup | ❌ Missing |
| Canonical URLs | ❌ Missing |
| Per-page meta tags | ❌ Missing (only dynamic `document.title` in schools page) |
| H1 tags | ✅ Present on pages |
| Alt text on images | N/A (no images currently) |
| Favicon | ✅ `/favicon.svg` |

## Missing Items by Priority

### 🔴 Critical

1. **robots.txt** — Search engines can't find crawl rules
2. **sitemap.xml** — Search engines can't discover pages
3. **Open Graph tags** — Social sharing looks broken (no image, no description)
4. **Per-page meta descriptions** — Every page shows same generic description

### 🟡 Important

5. **Schema.org LocalBusiness markup** for school pages
6. **Canonical URLs** to avoid duplicate content
7. **Twitter Card meta tags**
8. **Individual school pages** (`/schools/[id]`) for deep-linkable SEO

### 🟢 Nice to Have

9. **Structured breadcrumbs** (Schema.org BreadcrumbList)
10. **FAQ schema** on About page
11. **Hreflang** tags (if multilingual planned)

## Specific Code Changes

### 1. Add `robots.txt` — `frontend/public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /setup-admin/
Disallow: /test/

Sitemap: https://skillio.live/sitemap.xml
```

### 2. Add `sitemap.xml` — `frontend/app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://skillio.live', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://skillio.live/schools', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://skillio.live/activities', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://skillio.live/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://skillio.live/register', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: 'https://skillio.live/terms', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: 'https://skillio.live/privacy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ];
}
```

### 3. Update `frontend/app/layout.tsx` — Add OG tags

```typescript
export const metadata: Metadata = {
  title: 'Skillio - Детски дейности и курсове в България',
  description: 'Намерете най-добрите извънкласни дейности, спортни школи, езикови курсове и творчески занимания за деца в цяла България.',
  metadataBase: new URL('https://skillio.live'),
  openGraph: {
    title: 'Skillio - Детски дейности и курсове',
    description: 'Свързваме семейства с качествени извънкласни дейности за деца в България.',
    url: 'https://skillio.live',
    siteName: 'Skillio',
    locale: 'bg_BG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skillio - Детски дейности и курсове',
    description: 'Свързваме семейства с качествени извънкласни дейности за деца.',
  },
  alternates: {
    canonical: 'https://skillio.live',
  },
};
```

### 4. Per-page metadata — `frontend/app/schools/page.tsx`

Convert to use Next.js `generateMetadata` or add static export:

```typescript
export const metadata = {
  title: 'Организации за деца | Skillio',
  description: 'Проверени образователни организации, спортни школи и курсове за деца в цяла България. Намерете най-доброто за вашето дете.',
};
```

> ⚠️ Note: Since schools/page.tsx uses `'use client'`, metadata must be in a separate layout or the page needs restructuring. Quick fix: add `frontend/app/schools/layout.tsx` with the metadata export.

### 5. Schema.org LocalBusiness markup

Add to each school card or create a dedicated school detail page (`/schools/[id]`):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "School Name",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "София",
    "streetAddress": "ул. Примерна 1"
  },
  "telephone": "+359888123456",
  "email": "info@school.bg",
  "url": "https://skillio.live/schools/UUID"
}
</script>
```

### 6. Add schools layout for metadata — `frontend/app/schools/layout.tsx`

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Организации за деца в България | Skillio',
  description: 'Проверени организации, спортни школи и курсове за деца. Намерете дейности близо до вас в цяла България.',
  openGraph: {
    title: 'Организации за деца | Skillio',
    description: 'Проверени организации и курсове за деца в цяла България.',
  },
};

export default function SchoolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

## Target Keywords per Page

| Page | Primary Keywords | Secondary Keywords |
|------|------------------|--------------------|
| Homepage `/` | извънкласни дейности за деца, детски курсове България | след училище, занимания за деца |
| Schools `/schools` | организации за деца, спортни школи, езикови курсове деца | учители за деца, детски занимания |
| Activities `/activities` | дейности за деца, курсове за деца, спорт за деца | творчески занимания, образователни курсове |
| About `/about` | Skillio платформа, детски дейности платформа | родители, извънкласни занимания |
| School detail `/schools/[id]` | [school name] [city], [category] за деца [city] | отзиви, записване |

## Next Steps

1. Create `robots.txt` and `sitemap.ts` (immediate, 15 min)
2. Update layout.tsx with OG/Twitter meta (immediate, 10 min)
3. Add per-page layouts with metadata (30 min)
4. Create individual school pages `/schools/[id]` for deep-linking (1-2 hours)
5. Add Schema.org markup (30 min)
6. Submit sitemap to Google Search Console
