import { error, redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import { env } from '$env/dynamic/private';

export async function load({ params, request, url, platform }) {
  const id = params.slug;
  // Lookup in Cloudflare KV
  const value = await platform.env.LINKS_KV.get(id);
  if (!value) {
    throw error(404, 'Link not found');
  }
  const { url: redirectUrl, image: imageName, title: customTitle } = JSON.parse(value);
  const fbAppId = env.FACEBOOK_APP_ID;

  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
  const isCrawler = /bot|crawler|spider|crawling|facebookexternalhit|linkedinbot|twitterbot|whatsapp/i.test(userAgent);

  if (isMobile && !isCrawler && redirectUrl) {
    throw redirect(302, redirectUrl);
  }

  const pageUrl = url.toString();
  const imageSrc = imageName ? `${base}/images/${encodeURIComponent(imageName.split('/').pop())}` : null;
  const absoluteImageSrc = imageSrc ? `${url.origin}${imageSrc}` : null;

  return {
    redirectUrl,
    imageName,
    customTitle,
    imageSrc,
    absoluteImageSrc,
    pageUrl,
    fbAppId,
    isCrawler,
    isMobile,
    slug: id
  };
} 