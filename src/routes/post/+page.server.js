// src/routes/post/+page.server.js
import { error } from '@sveltejs/kit';

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

	// Basic validation
	if (!redirectUrl || !imageName) {
		console.warn("Missing URL or image parameter for OG tags generation.");
		// Consider throwing an error for better handling:
		// throw error(400, 'Missing URL or image parameter');
	}

	// Construct URLs
	const absoluteImageSrc = imageName ? `${url.origin}/images/${imageName}` : null;
	const imageSrc = imageName ? `/images/${imageName}` : null;
	const pageUrl = url.href;

	// --- Crawler Detection ---
	const userAgent = request.headers.get('user-agent') || '';
	let isCrawler = false;
	if (userAgent) {
		isCrawler = CRAWLER_USER_AGENTS.some(crawler => userAgent.toLowerCase().includes(crawler));
	}
	// Log detected user agent and crawler status (for debugging)
	console.log(`User-Agent: ${userAgent}`);
	console.log(`Is Crawler: ${isCrawler}`);
	// -----------------------


	return {
		redirectUrl: redirectUrl,
		imageName: imageName,
		imageSrc: imageSrc,
		absoluteImageSrc: absoluteImageSrc,
		pageUrl: pageUrl,
		isCrawler: isCrawler 
	};
}
