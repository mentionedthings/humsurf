import { redirect, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = join(__dirname, '../../../../static');

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

// Cache for image existence
const imageCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Rate limiting
const rateLimit = new Map();
const RATE_LIMIT = {
    WINDOW: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100
};

// Check if image exists and is accessible
async function validateImage(imageName) {
    if (!imageName) return { exists: false };
    
    const now = Date.now();
    const cacheKey = `${imageName}`;
    
    // Check cache first
    if (imageCache.has(cacheKey)) {
        const cached = imageCache.get(cacheKey);
        if (now - cached.timestamp < CACHE_TTL) {
            return { exists: cached.exists };
        }
    }
    
    try {
        const imagePath = join(staticDir, 'images', imageName);
        await readFile(imagePath);
        imageCache.set(cacheKey, { exists: true, timestamp: now });
        return { exists: true };
    } catch (err) {
        imageCache.set(cacheKey, { exists: false, timestamp: now });
        return { exists: false, error: 'Image not found' };
    }
}

// Rate limiting middleware
function checkRateLimit(ip) {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT.WINDOW;
    
    // Clean up old entries
    for (const [key, timestamp] of rateLimit.entries()) {
        if (timestamp < windowStart) {
            rateLimit.delete(key);
        }
    }
    
    // Count requests in current window
    const requestCount = Array.from(rateLimit.values())
        .filter(timestamp => timestamp >= windowStart)
        .length;
    
    if (requestCount >= RATE_LIMIT.MAX_REQUESTS) {
        return { allowed: false, remaining: 0, reset: RATE_LIMIT.WINDOW };
    }
    
    rateLimit.set(ip, now);
    return { 
        allowed: true, 
        remaining: RATE_LIMIT.MAX_REQUESTS - requestCount - 1,
        reset: RATE_LIMIT.WINDOW
    };
}

// Validate URL
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

export async function load({ url, request, getClientAddress }) {
    // Rate limiting
    const clientIp = getClientAddress();
    const rateLimitCheck = checkRateLimit(clientIp);
    
    if (!rateLimitCheck.allowed) {
        throw error(429, {
            message: 'Too many requests',
            headers: {
                'Retry-After': Math.ceil(rateLimitCheck.reset / 1000).toString(),
                'X-RateLimit-Limit': RATE_LIMIT.MAX_REQUESTS.toString(),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': (Date.now() + rateLimitCheck.reset).toString()
            }
        });
    }

    // Get URL parameters
    const redirectUrl = url.searchParams.get('url');
    const imageName = url.searchParams.get('image');
    const customTitle = url.searchParams.get('title')?.trim() || 'Check out this link';
    const customDescription = url.searchParams.get('description')?.trim() || '';
    const expiresAt = url.searchParams.get('expires');
    
    // Validate required parameters
    if (!redirectUrl) {
        throw error(400, 'Missing required parameter: url');
    }
    
    // Validate URL format
    if (!isValidUrl(redirectUrl)) {
        throw error(400, 'Invalid URL format');
    }
    
    // Check if link has expired
    if (expiresAt) {
        const expirationDate = new Date(expiresAt);
        if (!isNaN(expirationDate.getTime()) && expirationDate < new Date()) {
            throw error(410, 'This link has expired');
        }
    }
    
    // Get user agent
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    
    // Check if the request is from a known crawler
    const isCrawler = CRAWLER_AGENTS.some(agent => 
        userAgent.toLowerCase().includes(agent.toLowerCase())
    );
    
    // Enhanced mobile detection
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|Windows Phone|IEMobile|BlackBerry|Opera Mini/i.test(userAgent);
    
    // Prepare the image URL
    const baseUrl = url.origin;
    let imageSrc = '';
    let absoluteImageSrc = '';
    let imageInfo = { width: 1200, height: 630 };
    
    if (imageName) {
        // Validate image exists and get dimensions if possible
        const imageValidation = await validateImage(imageName);
        if (!imageValidation.exists) {
            console.warn(`Image not found: ${imageName}`);
        } else {
            imageSrc = `/images/${imageName}`;
            absoluteImageSrc = `${baseUrl}${imageSrc}`;
            
            // In a real app, you might want to get actual image dimensions
            // For now, we'll use default values
        }
    }
    
    // Get the current page URL for Open Graph tags
    const pageUrl = url.href;
    
    // Get Facebook App ID from environment variables if available
    const fbAppId = env.FACEBOOK_APP_ID || '';
    
    // If it's a mobile user and not a crawler, redirect immediately
    if (isMobile && !isCrawler && redirectUrl) {
        // Log the redirect for analytics
        console.log(`Redirecting mobile user to: ${redirectUrl}`, {
            timestamp: new Date().toISOString(),
            userAgent,
            referer,
            ip: clientIp
        });
        
        throw redirect(302, redirectUrl);
    }
    
    // If it's a crawler or desktop user, return the data for the page
    return {
        redirectUrl,
        imageSrc,
        absoluteImageSrc,
        imageInfo,
        customTitle,
        customDescription,
        pageUrl,
        isCrawler,
        isMobile,
        fbAppId,
        expiresAt,
        headers: {
            'Cache-Control': 'public, max-age=300', // 5 minutes
            'X-RateLimit-Limit': RATE_LIMIT.MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': rateLimitCheck.remaining.toString(),
            'X-RateLimit-Reset': (Date.now() + rateLimitCheck.reset).toString()
        }
    };
}
