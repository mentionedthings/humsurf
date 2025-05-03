// src/routes/post/+page.server.js
import { error, redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

// List of common crawler user agent substrings
const CRAWLER_USER_AGENTS = [
	'facebookexternalhit',
	'linkedinbot',
	'twitterbot',
	'pinterest',
	'googlebot', // Might want Google to index the final page, but include for testing
	'bingbot',
	'slackbot',
	'discordbot',
	'whatsapp',
];

/** @type {import('./$types').PageServerLoad} */
export function load({ url, request }) { 
	const redirectUrl = url.searchParams.get('url');
	const imageName = url.searchParams.get('image');
	const customTitle = url.searchParams.get('title'); // Read the title parameter

	// Basic validation for redirectUrl and imageName (title is optional)
	if (!redirectUrl || !imageName) {
		console.warn("Missing URL or image parameter for OG tags generation.");
		// Maybe return an error page or redirect to home?
		// For now, let it proceed but data might be incomplete.
		// Consider throwing an error: throw error(400, 'Missing required URL or image parameters');
	}

	// --- Mobile & Crawler Detection ---
	const userAgent = request.headers.get('user-agent') || ''; // Get User-Agent
	const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
	// Refined crawler check - common patterns
	const isCrawler = /bot|crawler|spider|crawling|facebookexternalhit|linkedinbot|twitterbot|whatsapp/i.test(userAgent);

	// If it's a mobile device AND NOT a crawler, redirect immediately
	if (isMobile && !isCrawler && redirectUrl) {
		throw redirect(302, redirectUrl); // 302 for temporary redirect
	}

	// --- Data Preparation for Page (Crawlers or Desktop users) ---
	const pageUrl = url.toString(); // Use the current request URL for og:url

	// Construct the image path relative to the static directory
	// Ensure imageName is treated as just the filename
	const imageSrc = imageName ? `${base}/images/${imageName.split('/').pop()}` : null;
	const absoluteImageSrc = imageSrc ? `${url.origin}${imageSrc}` : null;

	// Return data needed by the page
	return {
		redirectUrl: redirectUrl,
		imageName: imageName,
		customTitle: customTitle || 'Redirecting...', // Provide a default title if none is given
		imageSrc: imageSrc,
		absoluteImageSrc: absoluteImageSrc,
		pageUrl: pageUrl,
		// Let the page know if it's a crawler (for the meta refresh logic)
		isCrawler: isCrawler 
	};
}
