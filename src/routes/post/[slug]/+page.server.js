import { error, redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import { env } from '$env/dynamic/private';

// List of common crawler user agent substrings
const CRAWLER_USER_AGENTS = [
	'facebookexternalhit',
	'linkedinbot',
	'twitterbot',
	'pinterest',
	'googlebot',
	'bingbot',
	'slackbot',
	'discordbot',
	'whatsapp',
];

/** @type {import('./$types').PageServerLoad} */
export function load({ url, request, params }) {
	const redirectUrl = url.searchParams.get('url');
	const imageName = url.searchParams.get('image');
	const slug = params.slug; // Use slug as the title

	const fbAppId = env.FACEBOOK_APP_ID;

	if (!redirectUrl || !imageName) {
		console.warn("Missing URL or image parameter for OG tags generation.");
	}

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
		slug,
		imageSrc,
		absoluteImageSrc,
		pageUrl,
		fbAppId,
		isCrawler,
		isMobile
	};
} 