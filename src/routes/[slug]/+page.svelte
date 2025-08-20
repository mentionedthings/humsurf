<script>
  import { onMount } from 'svelte';
  
  export let data;
  
  // Initialize state with server-side values or defaults
  let redirectUrl = data.redirectUrl || '';
  let imageSrc = data.imageName ? `/images/${data.imageName}` : '';
  let absoluteImageSrc = data.absoluteImageSrc || '';
  let customTitle = data.customTitle || '';
  let customDescription = data.customDescription || '';
  let pageUrl = '';
  let isCrawler = data.isCrawler || false;
  let isMobile = data.isMobile || false;
  let fbAppId = data.fbAppId || '';
  let isLoading = !isCrawler; // Only show loading for non-crawler requests
  
  // Handle client-side data loading
  onMount(async () => {
    const slug = window.location.pathname.split('/').pop();
    
    // Try to get data from localStorage first
    try {
      const storedData = localStorage.getItem(`link_${slug}`);
      if (storedData) {
        const linkData = JSON.parse(storedData);
        
        // Check if data is older than 24 hours
        if (Date.now() - linkData.timestamp <= 24 * 60 * 60 * 1000) {
          updateState(linkData);
          return;
        } else {
          localStorage.removeItem(`link_${slug}`);
        }
      }
    } catch (e) {
      console.error('Error reading from localStorage:', e);
    }
    
    // If no valid data in localStorage, use server data
    updateState({
      url: data.redirectUrl || '',
      image: data.imageName || '',
      title: data.customTitle || '',
      description: data.customDescription || ''
    });
  });
  
  function updateState(linkData) {
    const { url, image, title, description } = linkData;
    
    redirectUrl = url;
    customTitle = title;
    customDescription = description;
    
    // Prepare image URLs
    const baseUrl = window.location.origin;
    const cleanImageName = image ? image.replace(/^\/+/, '') : '';
    imageSrc = cleanImageName ? `/images/${cleanImageName}` : '';
    absoluteImageSrc = cleanImageName ? `${baseUrl.replace(/\/+$/, '')}/images/${cleanImageName}` : '';
    
    // Set page URL
    pageUrl = window.location.href;
    
    // Check if mobile
    isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // Check if crawler (server-side only)
    isCrawler = data.isCrawler || false;
    
    // Get Facebook App ID from environment
    fbAppId = data.fbAppId || '';
    
    // Set loading to false
    isLoading = false;
    
    // Redirect mobile users immediately if not a crawler
    if (redirectUrl && isMobile && !isCrawler) {
      window.location.href = redirectUrl;
    }
  }
  
  // Redirect delay in seconds (for non-crawler desktop users)
  const redirectDelay = 5;
  
  // Redirect non-crawler desktop users after delay
  if (!isCrawler && !isMobile && redirectUrl) {
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, redirectDelay * 1000);
  }
</script>

<!-- Open Graph / Facebook -->
<svelte:head>
  {#if isCrawler}
    <title>{customTitle}</title>
    <meta name="description" content={customDescription} />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={pageUrl} />
    <meta property="og:title" content={customTitle} />
    <meta property="og:description" content={customDescription} />
    <meta property="og:site_name" content={siteName} />
    
    {#if absoluteImageSrc}
      <meta property="og:image" content={absoluteImageSrc} />
      <meta property="og:image:width" content={imageWidth} />
      <meta property="og:image:height" content={imageHeight} />
      <meta property="og:image:alt" content={customTitle} />
    {/if}
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={pageUrl} />
    <meta property="twitter:title" content={customTitle} />
    <meta property="twitter:description" content={customDescription} />
    {#if absoluteImageSrc}
      <meta property="twitter:image" content={absoluteImageSrc} />
    {/if}
    
    <!-- App Links -->
    <meta property="al:web:url" content={pageUrl} />
    
    <!-- Facebook App ID -->
    {#if fbAppId}
      <meta property="fb:app_id" content={fbAppId} />
    {/if}
  {/if}
</svelte:head>

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
  <!-- Basic Meta Tags -->
  <title>{customTitle || 'Shared Content'}</title>
  <meta name="description" content={customDescription || ''} />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:title" content={customTitle || 'Shared Content'} />
  <meta property="og:description" content={customDescription || ''} />
  {#if absoluteImageSrc}
    <meta property="og:image" content={absoluteImageSrc} />
    <meta property="og:image:secure_url" content={absoluteImageSrc.replace('http://', 'https://')} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content={customTitle || 'Shared Content'} />
    <meta property="og:image:type" content="image/jpeg" />
  {/if}
  <meta property="og:site_name" content="Humsurf" />
  <meta property="og:locale" content="en_US" />
  
  <!-- Facebook App ID (if provided) -->
  {#if fbAppId}
    <meta property="fb:app_id" content={fbAppId} />
  {/if}
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={customTitle || 'Shared Content'} />
  <meta name="twitter:description" content={customDescription || ''} />
  <meta name="twitter:site" content="@humsurf" />
  {#if absoluteImageSrc}
    <meta name="twitter:image" content={absoluteImageSrc} />
    <meta name="twitter:image:alt" content={customTitle || 'Shared Content'} />
  {/if}
  
  <!-- Additional recommended meta tags -->
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#2563eb" />
  
  <!-- Ensure proper content type -->
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main>
  {#if isCrawler}
    <!-- Content for crawlers (Facebook, Twitter, etc.) -->
    <h1>{customTitle || 'Shared Content'}</h1>
    {#if customDescription}
      <p>{customDescription}</p>
    {/if}
    {#if absoluteImageSrc}
      <img src={absoluteImageSrc} alt={customTitle || 'Shared Content'} style="max-width: 100%; height: auto;" />
    {/if}
    <p>Continue to: <a href={redirectUrl}>{redirectUrl}</a></p>
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
