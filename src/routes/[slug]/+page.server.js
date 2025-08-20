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
        .join(' ');
}

export async function load({ params, url, request, fetch }) {
    const slug = params.slug;
    let linkData = null;
    
    // Try to get data from client-side storage first
    if (import.meta.browser) {
        try {
            const storedData = localStorage.getItem(`link_${slug}`);
            if (storedData) {
                linkData = JSON.parse(storedData);
                // Check if data is older than 24 hours
                if (Date.now() - linkData.timestamp > 24 * 60 * 60 * 1000) {
                    localStorage.removeItem(`link_${slug}`);
                    linkData = null;
                }
            }
        } catch (e) {
            console.error('Error reading from localStorage:', e);
        }
    }
    
    // If no client-side data, check server-side (for SSR/crawlers)
    if (!linkData) {
        // In a real app, you would fetch from a database here
        // For now, we'll just use the slug as the title
        linkData = {
            url: '',
            image: '',
            title: formatTitle(slug),
            description: ''
        };
    }
    
    const { url: targetUrl, image: imageName, title: customTitle, description: customDescription } = linkData;
    
    // Get user agent
    const userAgent = request.headers.get('user-agent') || '';
    
    // Check if the request is from a known crawler
    const isCrawler = CRAWLER_AGENTS.some(agent => 
        userAgent.toLowerCase().includes(agent.toLowerCase())
    );
    
    // Check if the request is from a mobile device
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
    
    // Prepare the image URL - ensure it's an absolute URL
    const baseUrl = url.origin;
    const cleanImageName = imageName ? imageName.replace(/^\/+/, '') : '';
    const imageSrc = cleanImageName ? `/images/${cleanImageName}` : '';
    const absoluteImageSrc = cleanImageName ? 
        `${baseUrl.replace(/\/+$/, '')}/images/${cleanImageName}` : '';
    
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
