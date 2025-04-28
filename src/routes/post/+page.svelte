<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { base } from '$app/paths'; // Import base path

  let redirectUrl = '';
  let imageSrc = '';
  let countdown = 5; // Seconds to wait
  let countdownMessage = '';

  onMount(() => {
    const params = $page.url.searchParams;
    redirectUrl = params.get('url') || '#'; // Fallback URL
    const imageFilename = params.get('image');

    if (imageFilename) {
      // Construct the relative image path using the base path
      imageSrc = `${base}/images/${imageFilename}`;
    } else {
      imageSrc = ''; // Handle case where image is missing
    }

    if (redirectUrl && redirectUrl !== '#') {
       countdownMessage = `Redirecting in ${countdown} seconds...`;
       const timer = setInterval(() => {
          countdown -= 1;
          if (countdown > 0) {
             countdownMessage = `Redirecting in ${countdown} seconds...`;
          } else {
             countdownMessage = 'Redirecting now...';
             clearInterval(timer);
             window.location.href = redirectUrl;
          }
       }, 1000);

       // Cleanup timer if component is destroyed before redirect
       return () => clearInterval(timer);
    } else {
        countdownMessage = 'No valid redirect URL provided.';
    }
  });
</script>

{#if imageSrc}
  <img src={imageSrc} alt="Post image" />
{:else}
  <p>Image not found.</p>
{/if}

<p>{countdownMessage}</p>

<style>
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1rem auto; /* Center image */
    max-height: 80vh; /* Limit image height */
  }
  p {
    text-align: center;
    font-size: 1.2rem;
    margin-top: 1rem;
  }
</style>
