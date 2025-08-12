import { kv } from '@vercel/kv';
import { redirect, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, url, request }) {
	const { slug } = params;

	// Fetch the post data from Vercel KV using the slug
	const postData = await kv.get(slug);

	if (!postData) {
		// If no data is found for the slug, return a 404 error
		throw error(404, 'Post not found');
	}

	const { redirectUrl, imageName, customTitle, customDescription } = postData;

	// --- This part is very similar to the existing /post/+page.server.js ---

	// Get User-Agent for device detection
	const userAgent = request.headers.get('user-agent') || '';

	// Detect if the user agent is a known crawler
	const isCrawler = /bot|crawl|slurp|spider|facebookexternalhit|WhatsApp|Twitterbot|Pinterest/i.test(userAgent);

	// Detect if it's a mobile device (and not a crawler)
	const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);

	// If it's a mobile user and not a crawler, redirect them immediately
	if (isMobile && !isCrawler && redirectUrl) {
		throw redirect(302, redirectUrl);
	}

	// --- Construct image URLs and other data to pass to the page ---
	const imageSrc = imageName ? `/images/${imageName}` : '';
	const absoluteImageSrc = imageName ? `${url.origin}${imageSrc}` : '';
	const pageUrl = url.href;

	// Read environment variables
	const fbAppId = env.FACEBOOK_APP_ID;
	const siteName = env.SITE_NAME || 'Humsurf';

	// Return all the data needed by the page component
	return {
		redirectUrl,
		imageName,
		customTitle,
		customDescription,
		imageSrc,
		absoluteImageSrc,
		pageUrl,
		fbAppId,
		siteName,
		isCrawler,
		isMobile
	};
}
