<script>
  export let data;

  const { redirectUrl, imageSrc, absoluteImageSrc, pageUrl, isCrawler, customTitle } = data;

  const redirectDelaySeconds = 5; // Delay in seconds
</script>

<svelte:head>
  <title>{customTitle}</title>
  {#if redirectUrl}
    <meta name="description" content="Redirecting you shortly..." />
    <!-- Open Graph Tags -->
    <meta property="og:title" content={customTitle} />
    <meta property="og:description" content="" />
    {#if absoluteImageSrc}
      <meta property="og:image" content={absoluteImageSrc} />
    {/if}
    <meta property="og:url" content={pageUrl} />
    <meta property="og:type" content="website" />

    <!-- Twitter Card Tags (optional but recommended) -->
    <meta name="twitter:card" content="summary_large_image" />
    {#if absoluteImageSrc}
      <meta name="twitter:image" content={absoluteImageSrc} />
    {/if}
    <meta name="twitter:title" content={customTitle} />
    <meta name="twitter:description" content="View the content at {redirectUrl}" />

    <!-- Meta Refresh for redirection - ONLY FOR NON-CRAWLERS -->
    {#if !isCrawler}
      <meta http-equiv="refresh" content="{redirectDelaySeconds};url={redirectUrl}" />
    {/if}
  {/if}
</svelte:head>

<h1>Please wait...</h1>

{#if imageSrc}
  <p>
    {#if isCrawler}
      Sharing preview for {redirectUrl}.
    {:else}
      You will be redirected to {redirectUrl} in {redirectDelaySeconds} seconds.
    {/if}
  </p>
  <img src={imageSrc} alt="Preview Image" style="max-width: 100%; height: auto;" />
{:else if redirectUrl}
  <p>
    {#if isCrawler}
      Sharing preview for {redirectUrl}.
    {:else}
      Redirecting you to {redirectUrl} shortly...
    {/if}
  </p>
{:else}
  <p>Invalid link parameters provided.</p>
{/if}

<style>
  img {
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
