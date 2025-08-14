<script>
  export let data;

  const { redirectUrl, imageSrc, absoluteImageSrc, pageUrl, isCrawler, customTitle, fbAppId, siteName, isMobile } = data;

  const redirectDelaySeconds = 2;
</script>

<svelte:head>
  <title>{customTitle}</title>
  {#if redirectUrl}
    <meta name="description" content="..." />
    <!-- Open Graph Tags -->
    <meta property="og:title" content={customTitle} />
    <meta property="og:description" content="Click to view content." />
    <meta property="og:image" content={absoluteImageSrc} />
    <meta property="og:url" content={pageUrl} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={siteName} />
    {#if fbAppId}
      <meta property="fb:app_id" content={fbAppId} />
    {/if}

    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={absoluteImageSrc} />
    <meta name="twitter:title" content={customTitle} />
    <meta name="twitter:description" content="View the content at {redirectUrl}" />

    <!-- Meta Refresh for redirection - ONLY FOR MOBILE NON-CRAWLERS -->
    {#if isMobile && !isCrawler}
      <meta http-equiv="refresh" content="{redirectDelaySeconds};url={redirectUrl}" />
    {/if}
  {/if}
</svelte:head>

<main>
  {#if redirectUrl}
    {#if isMobile && !isCrawler}
      <h1>Redirecting you shortly...</h1>
      <p>You will be redirected to {redirectUrl} in {redirectDelaySeconds} seconds.</p>
      <p>If you are not redirected automatically, <a href={redirectUrl}>click here</a>.</p>
    {:else if !isMobile && !isCrawler}
      <h1>Link Information</h1>
      <p>The target URL is: <a href={redirectUrl} target="_blank" rel="noopener noreferrer">{redirectUrl}</a></p>
    {:else if isCrawler}
      <h1>Content Preview</h1>
      <p>This page provides metadata for link previews. The content is at {redirectUrl}</p>
    {/if}
  {:else}
    <p>Invalid link.</p>
  {/if}

  {#if imageSrc && (!isMobile || isCrawler)}
    <img src={imageSrc} alt="Preview for {customTitle || 'redirect link'}" class="preview-image" />
  {/if}
</main>

<style>
  .preview-image {
    display: block;
    margin: 2em auto;
    max-width: 80%;
    border: 1px solid #eee;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
  }
  h1, p {
    text-align: center;
  }
</style>
