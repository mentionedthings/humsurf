<script>
  import { onMount } from 'svelte';
  
  export let data;
  
  // Extract data from the server-side load function
  const { 
    redirectUrl, 
    imageSrc, 
    absoluteImageSrc, 
    customTitle, 
    customDescription, 
    pageUrl, 
    isCrawler, 
    isMobile,
    fbAppId,
    expiresAt,
    imageInfo = { width: 1200, height: 630 }
  } = $props();
  
  // State
  let countdown = 5; // Default 5 second countdown
  let hasError = false;
  let errorMessage = '';
  
  // Handle redirect with error fallback
  const handleRedirect = () => {
    if (redirectUrl) {
      try {
        window.location.href = redirectUrl;
      } catch (err) {
        hasError = true;
        errorMessage = 'Failed to redirect. Please click the link below.';
        console.error('Redirect error:', err);
      }
    }
  };
  
  // Start countdown for automatic redirect
  onMount(() => {
    if (!isCrawler && !isMobile && redirectUrl) {
      const timer = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
          clearInterval(timer);
          handleRedirect();
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  });
  
  // Format remaining time
  $: formattedTime = `${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`;
</script>

<svelte:head>
  <!-- Basic Meta Tags -->
  <title>{customTitle}</title>
  <meta name="description" content={customDescription} />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:title" content={customTitle} />
  <meta property="og:description" content={customDescription} />
  
  <!-- Image Meta Tags -->
  {#if absoluteImageSrc}
    <meta property="og:image" content={absoluteImageSrc} />
    <meta property="og:image:width" content={imageInfo.width} />
    <meta property="og:image:height" content={imageInfo.height} />
    <meta property="og:image:alt" content={customTitle} />
    <meta name="twitter:image" content={absoluteImageSrc} />
  {/if}
  
  <!-- Facebook App ID (if provided) -->
  {#if fbAppId}
    <meta property="fb:app_id" content={fbAppId} />
  {/if}
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content={absoluteImageSrc ? 'summary_large_image' : 'summary'} />
  <meta name="twitter:title" content={customTitle} />
  <meta name="twitter:description" content={customDescription} />
  <meta name="twitter:site" content="@yourtwitterhandle" />
  
  <!-- Canonical URL -->
  <link rel="canonical" href={pageUrl} />
  
  <!-- Favicon -->
  <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  
  <!-- Viewport for mobile -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
  
  <!-- Theme Color -->
  <meta name="theme-color" content="#2563eb" />
  
  <!-- Additional Meta Tags -->
  <meta name="robots" content="index, follow" />
  <meta name="author" content="Your Site Name" />
</svelte:head>

<main class:is-crawler={isCrawler}>
  {#if hasError}
    <div class="error-container">
      <h2>Something went wrong</h2>
      <p>{errorMessage || 'An unexpected error occurred.'}</p>
      {#if redirectUrl}
        <a href={redirectUrl} class="button primary">Continue to Link</a>
      {/if}
    </div>
  {:else if isCrawler}
    <!-- Content for crawlers (Facebook, Twitter, etc.) -->
    <div class="crawler-content">
      <h1>{customTitle}</h1>
      {#if customDescription}
        <p class="description">{customDescription}</p>
      {/if}
      {#if absoluteImageSrc}
        <div class="image-container">
          <img 
            src={absoluteImageSrc} 
            alt={customTitle} 
            width={imageInfo.width}
            height={imageInfo.height}
            loading="lazy"
          />
        </div>
      {/if}
      <div class="cta-container">
        <a href={redirectUrl} class="button primary">Continue to Content</a>
        <p class="url-display">{new URL(redirectUrl).hostname}</p>
      </div>
    </div>
  {:else if isMobile}
    <!-- Content for mobile users (should be redirected immediately) -->
    <div class="mobile-redirect">
      <div class="spinner"></div>
      <h2>Taking you to the content...</h2>
      <p>If you're not redirected, <a href={redirectUrl}>tap here</a>.</p>
    </div>
  {:else}
    <!-- Content for desktop users (will be redirected after delay) -->
    <div class="redirect-container">
      <div class="header">
        <h1>{customTitle}</h1>
        {#if expiresAt}
          <div class="expiry-notice">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Link expires on {new Date(expiresAt).toLocaleDateString()}</span>
          </div>
        {/if}
      </div>
      
      {#if customDescription}
        <p class="description">{customDescription}</p>
      {/if}
      
      {#if absoluteImageSrc}
        <div class="image-container">
          <img 
            src={absoluteImageSrc} 
            alt={customTitle} 
            loading="lazy"
            class="preview-image"
          />
        </div>
      {/if}
      
      <div class="redirect-info">
        <p>You are being redirected to:</p>
        <div class="url-display">
          <span class="domain">{new URL(redirectUrl).hostname}</span>
          <span class="path">{new URL(redirectUrl).pathname}</span>
        </div>
        
        <div class="countdown">
          <span>Redirecting in {formattedTime}</span>
          <div class="progress-bar">
            <div class="progress" style={`width: ${(countdown / 5) * 100}%`}></div>
          </div>
        </div>
        
        <div class="button-group">
          <a href={redirectUrl} class="button primary">
            Continue Now
          </a>
          <button 
            class="button secondary"
            on:click|preventDefault={() => {
              // Cancel the redirect
              countdown = 0;
              const event = new CustomEvent('cancelRedirect');
              window.dispatchEvent(event);
            }}
          >
            Cancel
          </button>
        </div>
        
        <p class="disclaimer">
          You are being redirected to an external website. Please review the URL before proceeding.
        </p>
      </div>
    </div>
  {/if}
</main>

<style>
  :global(:root) {
    --primary: #2563eb;
    --primary-hover: #1d4ed8;
    --secondary: #e5e7eb;
    --secondary-hover: #d1d5db;
    --text: #1f2937;
    --text-light: #6b7280;
    --bg: #ffffff;
    --card-bg: #f9fafb;
    --border: #e5e7eb;
    --success: #10b981;
    --error: #ef4444;
    --warning: #f59e0b;
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --radius-sm: 0.25rem;
    --radius: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-full: 9999px;
  }
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.5;
    color: var(--text);
    background-color: var(--bg);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  /* Crawler Specific Styles */
  main.is-crawler {
    padding: 1rem;
  }
  
  .crawler-content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }
  
  /* Mobile Redirect */
  .mobile-redirect {
    text-align: center;
    padding: 2rem;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto 1.5rem;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* Redirect Container */
  .redirect-container {
    background: var(--card-bg);
    border-radius: var(--radius-lg);
    padding: 2.5rem;
    margin: 0 auto;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
    max-width: 600px;
  }
  
  .header {
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 0.75rem;
    line-height: 1.2;
  }
  
  .description {
    color: var(--text-light);
    margin-bottom: 1.5rem;
    font-size: 1.125rem;
    line-height: 1.6;
  }
  
  /* Image Container */
  .image-container {
    margin: 1.5rem 0;
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    background: #f3f4f6;
    position: relative;
    padding-top: 52.5%; /* 16:9 aspect ratio */
  }
  
  .image-container img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  
  .preview-image {
    border-radius: var(--radius);
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
  }
  
  /* URL Display */
  .url-display {
    display: inline-flex;
    align-items: center;
    background: var(--secondary);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    margin: 1rem 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .domain {
    font-weight: 600;
    color: var(--text);
  }
  
  .path {
    color: var(--text-light);
    margin-left: 0.25rem;
  }
  
  /* Countdown */
  .countdown {
    margin: 1.5rem 0;
  }
  
  .countdown span {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-light);
  }
  
  .progress-bar {
    height: 6px;
    background: var(--secondary);
    border-radius: var(--radius-full);
    overflow: hidden;
  }
  
  .progress {
    height: 100%;
    background: var(--primary);
    width: 100%;
    transition: width 0.5s ease-out;
  }
  
  /* Buttons */
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius);
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.5;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    border: none;
    white-space: nowrap;
  }
  
  .button.primary {
    background: var(--primary);
    color: white;
  }
  
  .button.primary:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow);
  }
  
  .button.secondary {
    background: var(--secondary);
    color: var(--text);
  }
  
  .button.secondary:hover {
    background: var(--secondary-hover);
    transform: translateY(-1px);
  }
  
  .button-group {
    display: flex;
    gap: 0.75rem;
    margin: 1.5rem 0;
    justify-content: center;
  }
  
  /* Expiry Notice */
  .expiry-notice {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: #fef3c7;
    color: #92400e;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
  
  .expiry-notice svg {
    flex-shrink: 0;
  }
  
  /* Error State */
  .error-container {
    text-align: center;
    padding: 2rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: var(--radius);
    color: #b91c1c;
  }
  
  .error-container h2 {
    color: #b91c1c;
    margin-bottom: 0.5rem;
  }
  
  .error-container p {
    margin-bottom: 1.5rem;
  }
  
  /* Responsive Adjustments */
  @media (max-width: 640px) {
    .redirect-container {
      padding: 1.5rem;
      margin: 0 1rem;
    }
    
    h1 {
      font-size: 1.5rem;
    }
    
    .button-group {
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .button {
      width: 100%;
    }
  }
  
  /* Print Styles */
  @media print {
    .button-group,
    .countdown {
      display: none;
    }
    
    .redirect-container {
      border: none;
      box-shadow: none;
      padding: 0;
    }
  }
</style>
