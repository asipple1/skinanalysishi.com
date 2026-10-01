import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const concernSlugs = z.enum([
  'acne-congestion',
  'fine-lines-wrinkles',
  'texture-scarring',
  'pigmentation-melasma',
  'dull-or-dehydrated-skin',
  'unwanted-hair',
  'preventative-skin-health',
]);

const treatments = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/treatments' }),
  schema: z.object({
    title: z.string(),
    shortName: z.string(),
    seoTitle: z.string(),
    metaDescription: z.string().max(160),
    category: z.enum(['Facials + Resurfacing', 'Collagen Induction', 'Injectables', 'Hair Removal', 'Consultation', 'Professional Skincare']),
    benefit: z.string(),
    summary: z.string(),
    time: z.string(),
    downtime: z.string(),
    resultsAppear: z.string(),
    typicalPlan: z.string(),
    priceFrom: z.string(),
    pricing: z.array(z.object({ label: z.string(), value: z.string() })),
    concerns: z.array(z.string()),
    whoFor: z.string(),
    howItWorks: z.string(),
    expect: z.array(z.object({ step: z.string(), text: z.string() })).length(3),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })),
    beforeAfter: z.array(z.object({ image: z.string(), caption: z.string() })).default([]),
    related: z.array(z.string()).max(3),
    providerNote: z.object({ provider: z.string(), quote: z.string() }),
    heroImage: z.string().optional(),
    secondaryImage: z.string().optional(),
    featured: z.boolean().default(true),
    order: z.number().optional(),
  }),
});

const concerns = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/concerns' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    seoTitle: z.string(),
    metaDescription: z.string().max(160),
    intro: z.string(),
    treatments: z.array(z.string()),
    image: z.string().optional(),
  }),
});

const journal = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    category: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string(),
    readingTime: z.string(),
    heroImage: z.string(),
    relatedTreatments: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const providers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/providers' }),
  schema: z.object({
    name: z.string(),
    credentials: z.string(),
    role: z.string(),
    summary: z.string(),
    photo: z.string(),
    order: z.number(),
  }),
});

const locations = defineCollection({
  loader: file('src/data/locations.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    tag: z.string(),
    streetAddress: z.string(),
    locality: z.string(),
    region: z.string(),
    country: z.string(),
    phone: z.string(),
    tel: z.string(),
    mapUrl: z.string(),
    appointments: z.string(),
    main: z.boolean(),
  }),
});

const testimonials = defineCollection({
  loader: file('src/data/testimonials.json'),
  schema: z.object({
    text: z.string(),
    name: z.string(),
    detail: z.string(),
    placeholder: z.boolean().optional(),
  }),
});

export const collections = { treatments, concerns, journal, providers, locations, testimonials };
