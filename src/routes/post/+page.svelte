<script>
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
    fbAppId 
  } = data;
  
  // Redirect delay in seconds (for non-crawler desktop users)
  const redirectDelay = 5;
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
  {#if absoluteImageSrc}
    <meta property="og:image" content={absoluteImageSrc} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content={customTitle} />
  {/if}
  
  <!-- Facebook App ID (if provided) -->
  {#if fbAppId}
    <meta property="fb:app_id" content={fbAppId} />
  {/if}
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={customTitle} />
  <meta name="twitter:description" content={customDescription} />
  {#if absoluteImageSrc}
    <meta name="twitter:image" content={absoluteImageSrc} />
  {/if}
  
  <!-- Redirect non-crawler desktop users after a delay -->
  {#if !isCrawler && !isMobile && redirectUrl}
    <meta http-equiv="refresh" content={`${redirectDelay};url=${redirectUrl}`} />
  {/if}
</svelte:head>

<main>
  {#if isCrawler}
    <!-- Content for crawlers (Facebook, Twitter, etc.) -->
    <h1>{customTitle}</h1>
    {#if customDescription}
      <p>{customDescription}</p>
    {/if}
    {#if absoluteImageSrc}
      <img src={absoluteImageSrc} alt={customTitle} style="max-width: 100%; height: auto;" />
    {/if}
    <p>Continue to: <a href={redirectUrl}>{redirectUrl}</a></p>
  {:else if isMobile}
    <!-- Content for mobile users (should be redirected immediately) -->
    <p>Redirecting to the content...</p>
  {:else}
    <!-- Content for desktop users (will be redirected after delay) -->
    <div class="redirect-container">
      <h1>{customTitle}</h1>
      {#if absoluteImageSrc}
        <img src={absoluteImageSrc} alt={customTitle} class="preview-image" />
      {/if}
      <p>You are being redirected to: <a href={redirectUrl}>{redirectUrl}</a></p>
      <p>If you are not redirected automatically, <a href={redirectUrl}>click here</a>.</p>
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
</style>
