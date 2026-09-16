/**
 * Sourced photography used on the marketing pages, pending real client
 * and site photography. Pulled from Unsplash's free tier (no attribution
 * legally required, but credited here as good practice) and served at a
 * fixed, sane size via Unsplash's own image CDN params — no extra image
 * pipeline needed. Swap these for real farm/site photos as they come in;
 * keep the same shape (`url`, `alt`, `credit`) and everything downstream
 * keeps working.
 */
export const HERO_IMAGE = {
  url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1800&auto=format&fit=crop',
  alt: 'Rows of crops catching golden late-afternoon light across a working field',
  credit: 'Photo: Dan Meyers / Unsplash',
}
