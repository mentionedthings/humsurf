import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const CRAWLER_AGENTS = [
	'facebookexternalhit',
	'Twitterbot',
	'LinkedInBot',
	'WhatsApp',
	'Slackbot',
	'Discordbot',
	'TelegramBot',
	'Googlebot',
	'Bingbot',
	'Slurp',
	'DuckDuckBot',
	'Baiduspider',
	'YandexBot',
	'facebot',
	'ia_archiver',
	'archive.org_bot',
	'Applebot',
	'Pinterest'
];

function getSafeRedirectUrl(rawUrl) {
	if (!rawUrl) return null;
	try {
		const parsed = new URL(rawUrl.trim());
		if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
			return parsed.toString();
		}
		return null;
	} catch {
		return null;
	}
}

function getSafeImageFilename(rawName) {
	if (!rawName) return '';
	const baseName = rawName.trim().split('/').pop()?.split('\\').pop() || '';
	const sanitized = baseName.replace(/[^a-zA-Z0-9._-]/g, '');
	if (!sanitized || sanitized === '.' || sanitized === '..') {
		return '';
	}
	return sanitized;
}

export function load({ url, request }) {
	const rawRedirectUrl = url.searchParams.get('url');
	const redirectUrl = getSafeRedirectUrl(rawRedirectUrl);

	const imageName = getSafeImageFilename(url.searchParams.get('image'));
	const customTitle = url.searchParams.get('title')?.trim() || 'Check out this link';
	const customDescription = url.searchParams.get('description')?.trim() || '';

	const userAgent = request.headers.get('user-agent') || '';
	const lowerUa = userAgent.toLowerCase();

	const isCrawler = CRAWLER_AGENTS.some((agent) => lowerUa.includes(agent.toLowerCase()));
	const isMobile = /mobi|android|iphone|ipad|ipod/i.test(userAgent);

	const baseUrl = url.origin;
	const imageSrc = imageName ? `/images/${imageName}` : '';
	const absoluteImageSrc = imageName ? `${baseUrl}/images/${imageName}` : '';
	const pageUrl = url.href;
	const fbAppId = env.FACEBOOK_APP_ID || '';

	if (isMobile && !isCrawler && redirectUrl) {
		throw redirect(302, redirectUrl);
	}

	return {
		redirectUrl,
		hasInvalidUrl: Boolean(rawRedirectUrl && !redirectUrl),
		imageSrc,
		absoluteImageSrc,
		customTitle,
		customDescription,
		pageUrl,
		isCrawler,
		isMobile,
		fbAppId
	};
}
