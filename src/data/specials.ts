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
    title: 'Dysport® New Patient Event',
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
    id: 'nov-dysport',
    title: 'Dysport® Offer',
    description:
      'Dysport helps reduce fine lines and wrinkles, smooth expression lines, and create a refreshed, natural-looking appearance. Results typically last 3–4 months. Purchase 50 units of Dysport for $750 and receive 10 additional units free — a $150 value.',
    offer: '60 units for $750 — $150 value',
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
    title: 'DiamondGlow® Facial Exclusive Offer',
    description:
      'DiamondGlow improves skin texture, unclogs pores, boosts hydration, brightens dull skin, and leaves your complexion smoother and more radiant. Purchase a package of two DiamondGlow Ultimate treatments (regularly $700) and receive a Glow & Go Facial free — a $225 value.',
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
    title: 'Microneedling SkinPen® Offer',
    description:
      'Microneedling improves skin texture, softens fine lines and wrinkles, minimizes the appearance of acne scars and pores, and promotes firmer, smoother-looking skin. Buy 2 microneedling treatments, get the 3rd free — invest $1,000 in your skin and enjoy 3 full face treatments for the price of 2. That\'s a $500 treatment, on us.',
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
    id: 'nov-holiday-glow-collection',
    title: 'The Holiday Glow Collection',
    description:
      'Spend $1,000 or more during any visit in November and receive our exclusive Holiday Gift Package free. Includes a seasonal beach tote, ZO® Hydrating Travel Cleanser, ZO® Travel Exfoliating Polish, ZO® Travel SPF Primer, and a Rejuvenating Eye Mask.',
    offer: 'Free Holiday Gift Package with $1,000+ visit',
    month: 'November 2026',
    expires: '2026-11-30',
    category: 'Holiday',
    treatmentSlugs: [],
    href: '/contact/',
  },
  {
    id: 'nov-gift-voucher',
    title: 'Gift Voucher',
    description:
      'The perfect way to treat a friend or family member to some well-deserved self-care, allowing them to choose their favorite treatments, relax and enjoy a personalized experience. Purchase a $350 gift voucher and receive an additional $50 credit toward your next treatment.',
    offer: '$50 bonus with every $350 voucher',
    month: 'November 2026',
    expires: '2026-11-30',
    category: 'Gift Cards',
    treatmentSlugs: [],
    href: '/contact/',
  },
];
