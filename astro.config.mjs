import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.skinanalysishi.com',
  output: 'static',
  integrations: [
    preact({ compat: true }),
    sitemap({
      filter: (page) => !page.includes('/shop/cart') && !page.includes('/specials'),
    }),
  ],
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    '/services': '/treatments/',
    '/services/microneedling': '/treatments/skinpen-microneedling/',
    '/services/diamondglowfacial': '/treatments/diamondglow-facial/',
    '/services/dysport': '/treatments/dysport/',
    '/services/chemicalpeels': '/treatments/chemical-peels/',
    '/services/dermaplaning': '/treatments/dermaplaning/',
    '/blog': '/journal/',
    '/skincare': '/shop/',
    '/our-approach': '/#approach',
    '/get-started': '/contact/',
  },
});
