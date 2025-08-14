import { error, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, platform, request }) {
	const { slug } = params;

	if (!platform?.env.LINKS) {
		throw error(500, 'KV Namespace not found');
	}

	// Look up the slug in the KV store
	const linkDataString = await platform.env.LINKS.get(slug);

	if (!linkDataString) {
		throw error(404, 'Link not found');
	}

	const { url: redirectUrl, image: imageName, title: customTitle } = JSON.parse(linkDataString);

	// --- This logic is copied from the old /post route ---
	const userAgent = request.headers.get('user-agent') || '';
	const isCrawler = /bot|facebook|embed|got|firefox\/92|firefox\/38|curl|wget|go-http-client|yahoo|search|twitter|pinterest|slack|discord/i.test(userAgent);
	const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);

	// Immediately redirect mobile users who are not crawlers
	if (isMobile && !isCrawler) {
		throw redirect(302, redirectUrl);
	}

	// Prepare data for the page component (for crawlers and desktop users)
	const imageSrc = `/images/${imageName}`;
	const pageUrl = request.url;
	const absoluteImageSrc = `${new URL(request.url).origin}${imageSrc}`;
	const fbAppId = env.FACEBOOK_APP_ID;
	const siteName = env.SITE_NAME || 'Humsurf';

	return {
		redirectUrl,
		imageName,
		customTitle,
		imageSrc,
		absoluteImageSrc,
		pageUrl,
		fbAppId,
		siteName,
		isCrawler,
		isMobile
	};
}
