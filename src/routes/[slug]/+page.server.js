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
    
    // Get the full URL from the request
    const requestUrl = new URL(request.url);
    const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;
    
    // Get data from URL parameters
    const targetUrl = requestUrl.searchParams.get('url');
    const imageName = requestUrl.searchParams.get('image');
    const customTitle = requestUrl.searchParams.get('title') || formatTitle(slug);
    const customDescription = requestUrl.searchParams.get('description') || 'Click to see more';
    
    // Prepare image URL
    const cleanImageName = imageName ? imageName.replace(/^\/+/, '') : '';
    const absoluteImageSrc = cleanImageName 
        ? `${baseUrl}/images/${cleanImageName}`
        : '';
    
    // For crawlers, return all data with proper Open Graph tags
    if (isCrawler) {
        return {
            redirectUrl: targetUrl || '',
            imageName: cleanImageName,
            customTitle,
            customDescription,
            isCrawler: true,
            isMobile,
            fbAppId: process.env.FACEBOOK_APP_ID || '',
            absoluteImageSrc,
            pageUrl: requestUrl.href,
            siteName: 'Humsurf',
            imageWidth: '1200',
            imageHeight: '630'
        };
    }
    
    // For mobile users, redirect immediately
    if (isMobile && targetUrl) {
        throw redirect(302, targetUrl);
    }
    
    // For desktop users, return the data for the page
    return {
        slug,
        isCrawler: false,
        isMobile,
        fbAppId: process.env.FACEBOOK_APP_ID || '',
        redirectUrl: targetUrl || '',
        customTitle,
        customDescription,
        absoluteImageSrc,
        pageUrl: requestUrl.href
    };
        absoluteImageSrc,
        customTitle,
        customDescription,
        pageUrl,
        isCrawler,
        isMobile,
        fbAppId
    };
}
