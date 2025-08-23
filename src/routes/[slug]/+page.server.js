import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

// Enhanced crawler detection with Facebook's user agents
const CRAWLER_AGENTS = [
    // Facebook's user agents
    'facebookexternalhit/1.1',
    'facebookexternalhit/1.0',
    'facebookcatalog',
    'Facebot',
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
    'ia_archiver',
    'archive.org_bot',
    'Applebot',
    'Pinterest'
];

// Function to detect Facebook's crawler specifically
function isFacebookCrawler(userAgent) {
    return userAgent && (
        userAgent.includes('facebookexternalhit/') ||
        userAgent.includes('Facebot') ||
        userAgent.includes('facebookcatalog')
    );
}

export function load({ params, url, request }) {
    // Get URL parameters
    const targetUrl = url.searchParams.get('url');
    const imageName = url.searchParams.get('image');
    
    // Get title from query parameter or decode it from the URL slug
    let customTitle = url.searchParams.get('title') || 
                     (params.slug 
                        ? params.slug
                            .split('-')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')
                        : 'Check out this link');
    
    // Clean and truncate title for meta tags (max 60 chars for Facebook)
    const metaTitle = customTitle.length > 60 
        ? customTitle.substring(0, 57) + '...' 
        : customTitle;
    
    const customDescription = url.searchParams.get('description') || '';
    
    // Get user agent and other headers
    const userAgent = request.headers.get('user-agent') || '';
    const accept = request.headers.get('accept') || '';
    const isFacebook = isFacebookCrawler(userAgent);
    
    // Check if the request is from a known crawler
    const isCrawler = isFacebook || CRAWLER_AGENTS.some(agent => 
        userAgent.toLowerCase().includes(agent.toLowerCase())
    );
    
    // Enhanced mobile detection
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|Windows Phone|IEMobile|Opera Mini/i.test(userAgent);
    
    // Prepare the image URL - ensure it's an absolute URL with HTTPS
    const baseUrl = url.origin;
    const cleanImageName = imageName ? imageName.replace(/^\/+/, '') : '';
    const imageSrc = cleanImageName ? `/images/${cleanImageName}` : '';
    
    // Ensure HTTPS for Facebook and other platforms
    let absoluteImageSrc = '';
    if (cleanImageName) {
        const base = baseUrl.replace(/\/+$/, '').replace('http://', 'https://');
        absoluteImageSrc = `${base}/images/${cleanImageName}`;
    }
    
    // Create a clean canonical URL
    const canonicalUrl = new URL(url);
    // Ensure canonical URL is clean and consistent
    canonicalUrl.search = new URLSearchParams({
        url: targetUrl,
        image: cleanImageName,
        title: metaTitle,
        description: customDescription
    }).toString();
    
    // Get the current page URL for Open Graph tags
    const pageUrl = url.href;
    
    // Get Facebook App ID from environment variables if available
    const fbAppId = env.FACEBOOK_APP_ID || '';
    
    // If it's a mobile user and not a crawler, redirect immediately
    if (isMobile && !isCrawler && targetUrl) {
        throw redirect(302, targetUrl);
    }
    
    // Prepare description for meta tags (truncate to 200 chars for Facebook)
    const metaDescription = customDescription.length > 200 
        ? customDescription.substring(0, 197) + '...'
        : customDescription;
    
    // If it's a crawler or desktop user, return the data for the page
    return {
        redirectUrl: targetUrl,
        imageSrc,
        absoluteImageSrc,
        customTitle,
        metaTitle,
        customDescription: metaDescription,
        pageUrl,
        canonicalUrl,
        isCrawler,
        isFacebook,
        isMobile,
        fbAppId,
        // Additional metadata for better sharing
        siteName: 'Humsurf',
        locale: 'en_US',
        twitterHandle: '@humsurf',
        // Add image dimensions if available (important for Facebook)
        imageWidth: 1200,
        imageHeight: 630,
        imageType: 'image/jpeg',
        // Add published time for better indexing
        publishedTime: new Date().toISOString(),
        // Add section and tag for better categorization
        section: 'Comics',
        tags: ['comics', 'funny', 'entertainment']
    };
}
