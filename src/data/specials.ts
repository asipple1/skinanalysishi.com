export interface Special {
  id: string;
  title: string;
  description: string;
  offer: string;
  month: string;
  expires: string; // ISO date YYYY-MM-DD
  category: string;
  treatmentSlugs: string[];
  originalPrice?: string;
  salePrice?: string;
  href: string;
}

export const specials: Special[] = [
  // --- OCTOBER 2026 ---
  {
    id: 'oct-new-patient-diamondglow',
    title: 'New Patient DiamondGlow® Facial Offer',
    description:
      "If you've been thinking about DiamondGlow® but haven't taken the step yet, here's your invitation. New patients save $50 on any DiamondGlow facial service — face, neck, or body. Immediate results, minimal downtime, and we'll choose a serum tailored to exactly what your skin needs that day. Virtually every skin type welcome.",
    offer: '$50 off your first DiamondGlow® Facial',
    month: 'October 2026',
    expires: '2026-11-22',
    category: 'New Patient Offer',
    treatmentSlugs: ['diamondglow-facial', 'diamondglow-body'],
    originalPrice: 'from $275',
    salePrice: 'from $225',
    href: '/treatments/diamondglow-facial/',
  },
  {
    id: 'oct-skincare-restock',
    title: 'Skincare Restock',
    description:
      'Stock up on your ZO® and SkinMedica essentials. Spend $300 or more on skincare products and receive 15% off your entire purchase.',
    offer: '15% off $300+ purchase',
    month: 'October 2026',
    expires: '2026-10-31',
    category: 'Retail',
    treatmentSlugs: ['professional-skincare'],
    href: '/treatments/professional-skincare/',
  },
  {
    id: 'oct-peel-promo',
    title: 'Peel Promotion',
    description:
      'Purchase two Vitalize Peels plus an SPF and receive one Illuminize Peel completely free — a great way to start or continue a corrective peel series.',
    offer: 'Buy 2 + SPF, Get 1 Illuminize Free',
    month: 'October 2026',
    expires: '2026-10-31',
    category: 'Treatments',
    treatmentSlugs: ['chemical-peels'],
    href: '/treatments/chemical-peels/',
  },

  // --- NOVEMBER 2026 ---
  {
    id: 'nov-dysport-new-patients',
    title: 'Dysport New Patient Event',
    description:
      'One day only — Saturday, November 21. New patients: buy 40 units of Dysport for $600 and receive one additional area free (up to 8 units — a $120 value). That\'s up to 48 units for just $600. Book your next treatment and receive this same exclusive offer again.',
    offer: '48 units for $600 — new patients only',
    month: 'November 2026',
    expires: '2026-11-21',
    category: 'Injectables Event',
    treatmentSlugs: ['dysport'],
    originalPrice: '$720',
    salePrice: '$600',
    href: '/treatments/dysport/',
  },
  {
    id: 'nov-dysport-existing',
    title: 'Dysport Loyalty Special',
    description:
      'Existing patients: buy 50 units of Dysport for $750 and receive 10 additional units free. Enjoy 60 units for the price of 50 — a $150 value.',
    offer: '60 units for $750 — existing patients',
    month: 'November 2026',
    expires: '2026-11-30',
    category: 'Injectables',
    treatmentSlugs: ['dysport'],
    originalPrice: '$900',
    salePrice: '$750',
    href: '/treatments/dysport/',
  },
  {
    id: 'nov-diamondglow-ultimate',
    title: 'DiamondGlow® Ultimate Special',
    description:
      'Purchase a package of two DiamondGlow Ultimate treatments (regularly $700) and receive a Glow & Go Facial absolutely free — a $225 value. Three opportunities to refresh, renew, and reveal your radiant glow.',
    offer: 'Free Glow & Go Facial ($225 value)',
    month: 'November 2026',
    expires: '2026-11-30',
    category: 'Packages',
    treatmentSlugs: ['diamondglow-facial'],
    originalPrice: '$925',
    salePrice: '$700',
    href: '/treatments/diamondglow-facial/',
  },
  {
    id: 'nov-microneedling',
    title: 'Microneedling Package',
    description:
      'Purchase a package of two facial microneedling treatments for $1,000 and receive a third treatment completely free — three treatments for the price of two, a $500 value in savings.',
    offer: 'Buy 2 Get 1 Free — $500 savings',
    month: 'November 2026',
    expires: '2026-11-30',
    category: 'Packages',
    treatmentSlugs: ['skinpen-microneedling'],
    originalPrice: '$1,500',
    salePrice: '$1,000',
    href: '/treatments/skinpen-microneedling/',
  },
  {
    id: 'nov-holiday-skincare-gift',
    title: 'Holiday Skincare Gift',
    description:
      'Purchase $750 in skincare products throughout November and receive our exclusive Holiday Gift Package free — includes a seasonal beach tote, ZO® travel cleanser, exfoliating polish, SPF primer, and a rejuvenating eye mask.',
    offer: 'Free Holiday Gift Package with $750+ in products',
    month: 'November 2026',
    expires: '2026-11-30',
    category: 'Retail',
    treatmentSlugs: ['professional-skincare'],
    href: '/treatments/professional-skincare/',
  },

  // --- DECEMBER 2026 ---
  {
    id: 'dec-gift-voucher',
    title: 'Gift Voucher Bonus',
    description:
      'Give the gift of glowing skin. Purchase a $350 gift voucher and receive a $75 bonus — perfect for the holidays.',
    offer: '$75 bonus with every $350 voucher',
    month: 'December 2026',
    expires: '2026-12-31',
    category: 'Gift Cards',
    treatmentSlugs: [],
    href: '/contact/',
  },
  {
    id: 'dec-holiday-basket',
    title: 'Holiday Gift Basket',
    description:
      'Spend $500 or more and receive a curated Holiday Gift Basket — includes a branded shirt, Plated skincare, bags, and a few surprise items.',
    offer: 'Free gift basket with $500+ purchase',
    month: 'December 2026',
    expires: '2026-12-31',
    category: 'Holiday',
    treatmentSlugs: [],
    href: '/contact/',
  },
  {
    id: 'dec-diamondglow-express',
    title: 'DiamondGlow® Holiday Package',
    description:
      'Purchase two Ultimate DiamondGlow treatments and receive a complimentary Express Facial free — three treatments to keep your glow going into the new year.',
    offer: 'Free Express Facial with 2-pack',
    month: 'December 2026',
    expires: '2026-12-31',
    category: 'Packages',
    treatmentSlugs: ['diamondglow-facial'],
    href: '/treatments/diamondglow-facial/',
  },
];
