<script>
  export let data;
  
  // Extract data from the server-side load function
  const { 
    redirectUrl, 
    imageSrc, 
    absoluteImageSrc, 
    customTitle, 
    metaTitle = customTitle,
    customDescription, 
    pageUrl,
    canonicalUrl = pageUrl,
    isCrawler, 
    isFacebook = false,
    isMobile,
    fbAppId,
    siteName = 'Humsurf',
    locale = 'en_US',
    twitterHandle = '@humsurf',
    imageWidth = 1200,
    imageHeight = 630,
    imageType = 'image/jpeg',
    publishedTime = new Date().toISOString(),
    section = 'Comics',
    tags = ['comics', 'funny', 'entertainment']
  } = data;
  
  // Redirect delay in seconds (for non-crawler desktop users)
  const redirectDelay = 5;
  
  // Redirect non-crawler desktop users after delay
  if (!isCrawler && !isMobile && redirectUrl) {
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, redirectDelay * 1000);
  }
</script>

<!-- Debug Info (visible only in development) -->
{#if import.meta.env.DEV}
  <div style="background: #f0f0f0; padding: 10px; margin-bottom: 20px; border: 1px solid #ccc;">
    <h3>Debug Information</h3>
    <p><strong>Page URL:</strong> {pageUrl}</p>
    <p><strong>Redirecting to:</strong> {redirectUrl}</p>
    <p><strong>Image URL:</strong> {absoluteImageSrc || 'No image'}</p>
    <p><strong>Is Crawler:</strong> {isCrawler}</p>
    <p><strong>Is Mobile:</strong> {isMobile}</p>
  </div>
{/if}

<svelte:head>
  <!-- Canonical URL -->
  <link rel="canonical" href={canonicalUrl} />
  
  <!-- Basic Meta Tags -->
  <title>{metaTitle || 'Shared Content'}</title>
  <meta name="description" content={customDescription} />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:title" content={metaTitle || 'Shared Content'} />
  <meta property="og:description" content={customDescription} />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:locale" content={locale} />
  
  <!-- Article specific meta -->
  <meta property="article:published_time" content={publishedTime} />
  <meta property="article:section" content={section} />
  {#each tags as tag}
    <meta property="article:tag" content={tag} />
  {/each}
  
  <!-- Image meta -->
  {#if absoluteImageSrc}
    <meta property="og:image" content={absoluteImageSrc} />
    <meta property="og:image:secure_url" content={absoluteImageSrc.replace('http://', 'https://')} />
    <meta property="og:image:width" content={imageWidth} />
    <meta property="og:image:height" content={imageHeight} />
    <meta property="og:image:alt" content={metaTitle || 'Shared Content'} />
    <meta property="og:image:type" content={imageType} />
  {/if}
  
  <!-- Facebook App ID (if provided) -->
  {#if fbAppId}
    <meta property="fb:app_id" content={fbAppId} />
    <meta property="fb:pages" content={fbAppId} />
  {/if}
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={metaTitle || 'Shared Content'} />
  <meta name="twitter:description" content={customDescription} />
  <meta name="twitter:site" content={twitterHandle} />
  {#if absoluteImageSrc}
    <meta name="twitter:image" content={absoluteImageSrc} />
    <meta name="twitter:image:alt" content={metaTitle || 'Shared Content'} />
  {/if}
  
  <!-- Additional recommended meta tags -->
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#2563eb" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  
  <!-- Ensure proper content type and viewport -->
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
  
  <!-- iOS specific -->
  <meta name="apple-mobile-web-app-title" content={siteName} />
  
  <!-- Windows specific -->
  <meta name="msapplication-TileColor" content="#2563eb" />
  <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
  
  <!-- PWA related -->
  <link rel="manifest" href="/manifest.json" />
  
  <!-- Preconnect to external domains for better performance -->
  <link rel="preconnect" href="https://www.facebook.com" />
  <link rel="preconnect" href="https://platform.twitter.com" />
  <link rel="dns-prefetch" href="https://www.facebook.com" />
  <link rel="dns-prefetch" href="https://platform.twitter.com" />
</svelte:head>

<main>
  {#if isCrawler}
    <!-- Content for crawlers (Facebook, Twitter, etc.) -->
    <div class="crawler-content" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <h1 style="font-size: 2.5em; margin-bottom: 0.5em; color: #1d4ed8;">{metaTitle || 'Shared Content'}</h1>
      
      {#if absoluteImageSrc}
        <div style="margin: 1.5em 0;">
          <img 
            src={absoluteImageSrc} 
            alt={metaTitle || 'Shared Content'} 
            style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
          />
        </div>
      {/if}
      
      {#if customDescription}
        <div style="font-size: 1.2em; line-height: 1.6; color: #333; margin-bottom: 1.5em;">
          {customDescription}
        </div>
      {/if}
      
      <div style="margin-top: 2em; padding: 1em; background-color: #f8fafc; border-radius: 6px; border-left: 4px solid #1d4ed8;">
        <p style="margin: 0; color: #4b5563;">
          Continue reading: <a href={redirectUrl} style="color: #1d4ed8; text-decoration: none; font-weight: 500;">{redirectUrl}</a>
        </p>
      </div>
      
      {#if isFacebook}
        <!-- Additional structured data for Facebook -->
        <div style="display: none;">
          <div class="fb-like" data-href={pageUrl} data-width="" data-layout="button_count" data-action="like" data-size="large" data-share="true"></div>
          <div class="fb-comments" data-href={pageUrl} data-width="100%" data-numposts="5"></div>
        </div>
      {/if}
    </div>
  {:else if isMobile}
    <!-- Content for mobile users (should be redirected immediately) -->
    <div class="redirect-container">
      <p>Redirecting to the content...</p>
    </div>
  {:else}
    <!-- Content for desktop users (will be redirected after delay) -->
    <div class="redirect-container">
      <h1>{customTitle || 'Shared Content'}</h1>
      {#if absoluteImageSrc}
        <img src={absoluteImageSrc} alt={customTitle || 'Shared Content'} class="preview-image" />
      {/if}
      <p>You are being redirected to: <a href={redirectUrl}>{redirectUrl}</a></p>
      <p>If you are not redirected automatically, <a href={redirectUrl}>click here</a>.</p>
      <div class="countdown">Redirecting in {redirectDelay} seconds...</div>
    </div>
  {/if}
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }
  
  .redirect-container {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 2rem;
    margin-top: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .preview-image {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 1rem 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  a {
    color: #2563eb;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  h1 {
    color: #1f2937;
    margin-bottom: 1rem;
  }
  
  p {
    color: #4b5563;
    line-height: 1.6;
  }
  
  .countdown {
    margin-top: 1rem;
    color: #6b7280;
    font-style: italic;
  }
</style>
