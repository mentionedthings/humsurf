import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

// List of known crawler user agents
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

export function load({ url, request }) {
    // Get URL parameters
    const redirectUrl = url.searchParams.get('url');
    const imageName = url.searchParams.get('image');
    const customTitle = url.searchParams.get('title') || 'Check out this link';
    const customDescription = url.searchParams.get('description') || '';
    
    // Get user agent
    const userAgent = request.headers.get('user-agent') || '';
    
    // Check if the request is from a known crawler
    const isCrawler = CRAWLER_AGENTS.some(agent => 
        userAgent.toLowerCase().includes(agent.toLowerCase())
    );
    
    // Check if the request is from a mobile device
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
    
    // Prepare the image URL
    const baseUrl = url.origin;
    const imageSrc = imageName ? `/images/${imageName}` : '';
    const absoluteImageSrc = imageName ? `${baseUrl}/images/${imageName}` : '';
    
    // Get the current page URL for Open Graph tags
    const pageUrl = url.href;
    
    // Get Facebook App ID from environment variables if available
    const fbAppId = env.FACEBOOK_APP_ID || '';
    
    // If it's a mobile user and not a crawler, redirect immediately
    if (isMobile && !isCrawler && redirectUrl) {
        throw redirect(302, redirectUrl);
    }
    
    // If it's a crawler or desktop user, return the data for the page
    return {
        redirectUrl,
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
