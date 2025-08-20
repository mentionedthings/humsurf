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

// In-memory store for link data (in production, use a database)
const linkStore = new Map();

// Function to clean and format title
function formatTitle(slug) {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace(/%20/g, ' ') // Replace URL-encoded spaces
        .replace(/\+/g, ' '); // Replace + with spaces
}

export async function load({ params, url, request, fetch }) {
    const slug = params.slug;
    const userAgent = request.headers.get('user-agent') || '';
    const isCrawler = CRAWLER_AGENTS.some(agent => 
        userAgent.toLowerCase().includes(agent.toLowerCase())
    );
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
    
    // For crawlers, we need to ensure we have all data available
    if (isCrawler) {
        // Get the full URL from the request
        const requestUrl = new URL(request.url);
        const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;
        
        // Try to get data from the URL parameters (for backward compatibility)
        const targetUrl = requestUrl.searchParams.get('url');
        const imageName = requestUrl.searchParams.get('image');
        const customTitle = requestUrl.searchParams.get('title') || formatTitle(slug);
        const customDescription = requestUrl.searchParams.get('description') || '';
        
        // Prepare image URL
        const cleanImageName = imageName ? imageName.replace(/^\/+/, '') : '';
        const absoluteImageSrc = cleanImageName 
            ? `${baseUrl}/images/${cleanImageName}`
            : '';
        
        // For crawlers, return all data immediately
        return {
            redirectUrl: targetUrl || '',
            imageName: cleanImageName,
            customTitle,
            customDescription,
            isCrawler: true,
            isMobile,
            fbAppId: process.env.FACEBOOK_APP_ID || '',
            absoluteImageSrc
        };
    }
    
    // For regular users, use the client-side approach
    return {
        slug,
        isCrawler: false,
        isMobile,
        fbAppId: process.env.FACEBOOK_APP_ID || ''
    };
    
    // Get the current page URL for Open Graph tags
    const pageUrl = url.href;
    
    // Get Facebook App ID from environment variables if available
    const fbAppId = env.FACEBOOK_APP_ID || '';
    
    // If it's a mobile user and not a crawler, redirect immediately
    if (isMobile && !isCrawler && targetUrl) {
        throw redirect(302, targetUrl);
    }
    
    // If it's a crawler or desktop user, return the data for the page
    return {
        redirectUrl: targetUrl,
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
