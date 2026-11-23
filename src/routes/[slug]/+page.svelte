<script>
  export let data;

  const redirectDelay = 5;

  $: redirectUrl = data?.redirectUrl || '';
  $: hasInvalidUrl = Boolean(data?.hasInvalidUrl);
  $: absoluteImageSrc = data?.absoluteImageSrc || '';
  $: customTitle = data?.customTitle || 'Check out this link';
  $: customDescription = data?.customDescription || '';
  $: pageUrl = data?.pageUrl || '';
  $: isCrawler = Boolean(data?.isCrawler);
  $: isMobile = Boolean(data?.isMobile);
  $: fbAppId = data?.fbAppId || '';
  $: safeMetaRefreshUrl = redirectUrl.replace(/"/g, '&quot;');
</script>

<svelte:head>
  <title>{customTitle}</title>
  {#if customDescription}
    <meta name="description" content={customDescription} />
  {/if}

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:title" content={customTitle} />
  {#if customDescription}
    <meta property="og:description" content={customDescription} />
  {/if}
  {#if absoluteImageSrc}
    <meta property="og:image" content={absoluteImageSrc} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content={customTitle} />
  {/if}

  {#if fbAppId}
    <meta property="fb:app_id" content={fbAppId} />
  {/if}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={customTitle} />
  {#if customDescription}
    <meta name="twitter:description" content={customDescription} />
  {/if}
  {#if absoluteImageSrc}
    <meta name="twitter:image" content={absoluteImageSrc} />
  {/if}

  <!-- Redirect non-crawler desktop users after a delay -->
  {#if !isCrawler && !isMobile && redirectUrl}
    <meta http-equiv="refresh" content={`${redirectDelay};url=${safeMetaRefreshUrl}`} />
  {/if}
</svelte:head>

<main>
  {#if isCrawler}
    <h1>{customTitle}</h1>
    {#if customDescription}
      <p>{customDescription}</p>
    {/if}
    {#if absoluteImageSrc}
      <img src={absoluteImageSrc} alt={customTitle} style="max-width: 100%; height: auto;" />
    {/if}
    {#if redirectUrl}
      <p>Continue to: <a href={redirectUrl}>{redirectUrl}</a></p>
    {/if}
  {:else if isMobile}
    <p>Redirecting to the content...</p>
  {:else}
    <div class="redirect-container">
      <h1>{customTitle}</h1>
      {#if absoluteImageSrc}
        <img src={absoluteImageSrc} alt={customTitle} class="preview-image" />
      {/if}

      {#if redirectUrl}
        <p>You are being redirected to: <a href={redirectUrl}>{redirectUrl}</a></p>
        <p>If you are not redirected automatically, <a href={redirectUrl}>click here</a>.</p>
      {:else if hasInvalidUrl}
        <p class="error-text">Invalid or unsafe redirect URL provided.</p>
      {:else}
        <p class="error-text">No redirect URL was provided.</p>
      {/if}
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
    word-break: break-all;
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

  .error-text {
    color: #dc2626;
    font-weight: 600;
  }
</style>
