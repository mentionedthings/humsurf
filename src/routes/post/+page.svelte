<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let countdown = 5;
  let redirectUrl = '';
  let imageSrc = '';

  onMount(() => {
    const params = new URLSearchParams($page.url.search);
    redirectUrl = params.get('url');
    imageSrc = `/images/${params.get('image')}`;

    const timer = setInterval(() => {
      countdown -= 1;
      if (countdown <= 0) {
        window.location.href = redirectUrl;
        clearInterval(timer);
      }
    }, 1000);
  });
</script>

{#if redirectUrl}
  <div class="redirect-container">
    <img src={imageSrc} alt="Post preview" />
    <div class="countdown">
      Redirecting to {redirectUrl} in {countdown} seconds...
    </div>
  </div>
{/if}

<style>
  .redirect-container {
    text-align: center;
    padding: 2rem;
  }

  img {
    max-width: 600px;
    margin: 2rem 0;
    border-radius: 8px;
  }

  .countdown {
    font-size: 1.2rem;
    color: #666;
  }
</style>
