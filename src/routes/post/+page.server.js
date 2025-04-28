// src/routes/post/+page.server.js
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export function load({ url }) {
  const redirectUrl = url.searchParams.get('url');
  const imageName = url.searchParams.get('image');

  // Basic validation
  if (!redirectUrl || !imageName) {
    // Let the page handle missing params for now, but you might want to throw an error
    console.warn("Missing URL or image parameter for OG tags generation.");
  }

  // Construct the absolute image URL for the og:image tag
  // url.origin provides the base domain (e.g., https://your-site.com)
  const absoluteImageSrc = imageName ? `${url.origin}/images/${imageName}` : null;
  // Construct the relative image source for display on the page
  const imageSrc = imageName ? `/images/${imageName}` : null;


  return {
    redirectUrl: redirectUrl,
    imageName: imageName,
    imageSrc: imageSrc, // Relative path for <img> tag
    absoluteImageSrc: absoluteImageSrc, // Absolute path for <meta> tag
    pageUrl: url.href // Full URL of this specific post page
  };
}
