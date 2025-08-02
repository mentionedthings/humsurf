<script>
  export let data;

  const { redirectUrl, imageSrc, absoluteImageSrc, pageUrl, isCrawler, customTitle, fbAppId, isMobile } = data;

  const redirectDelaySeconds = 2; // Delay in seconds
</script>

<svelte:head>
  <title>{customTitle}</title>
  {#if redirectUrl}
    <meta name="description" content="..." />
    <!-- Open Graph Tags -->
    <meta property="og:title" content={customTitle} />
    <meta property="og:description" content="" />
    {#if absoluteImageSrc}
      <meta property="og:image" content={absoluteImageSrc} />
    {/if}
    <meta property="og:url" content={pageUrl} />
    <meta property="og:type" content="website" />
    {#if fbAppId}
      <meta property="fb:app_id" content={fbAppId} />
    {/if}

    <!-- Twitter Card Tags (optional but recommended) -->
    <meta name="twitter:card" content="summary_large_image" />
    {#if absoluteImageSrc}
      <meta name="twitter:image" content={absoluteImageSrc} />
    {/if}
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
      <!-- Content for Mobile Users (who will be redirected) -->
      <h1>Redirecting you shortly...</h1>
      <p>
        {#if isCrawler}
          Sharing preview for {redirectUrl}.
        {:else}
          You will be redirected to {redirectUrl} in {redirectDelaySeconds} seconds.
        {/if}
      </p>
      <p>If you are not redirected automatically, <a href={redirectUrl}>click here</a>.</p>
    {:else if !isMobile && !isCrawler}
      <!-- Content for Desktop Users (who will NOT be redirected) -->
      <h1>{customTitle}</h1>
      <p>You can view the original content by following this link:</p>
      <p><a href={redirectUrl} target="_blank" rel="noopener noreferrer">{redirectUrl}</a></p>
    {:else if isCrawler}
      <!-- Content for Crawlers (who will NOT be redirected) -->
      <h1>Comics</h1>
      <p>This page provides metadata for link previews on social media and other platforms.</p>
      <p>See more go to: {redirectUrl}</p>
    {/if}
  {:else}
    <!-- Fallback content if redirectUrl is missing -->
    <p>Invalid link parameters provided.</p>
  {/if}

  {#if imageSrc && (!isMobile || isCrawler)} <!-- Show image for crawlers or desktop users -->
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
