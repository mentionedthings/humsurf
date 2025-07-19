import { error, redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import { env } from '$env/dynamic/private';
import { getLink } from '../../../lib/linkStore.js';

export function load({ params, request, url }) {
  const id = params.slug;
  const link = getLink(id);
  if (!link) {
    throw error(404, 'Link not found');
  }
  const { url: redirectUrl, image: imageName, title: customTitle } = link;
  const fbAppId = env.FACEBOOK_APP_ID;

  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
  const isCrawler = /bot|crawler|spider|crawling|facebookexternalhit|linkedinbot|twitterbot|whatsapp/i.test(userAgent);

  if (isMobile && !isCrawler && redirectUrl) {
    throw redirect(302, redirectUrl);
  }

  const pageUrl = url.toString();
  const imageSrc = imageName ? `${base}/images/${imageName.split('/').pop()}` : null;
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