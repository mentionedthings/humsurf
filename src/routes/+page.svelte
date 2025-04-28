<script>
  export let data;
  import { goto } from '$app/navigation';

  let redirectUrl = '';
  let imageFile = '';

  function handleSubmit(e) {
    e.preventDefault();
    goto(`/post?url=${encodeURIComponent(redirectUrl)}&image=${encodeURIComponent(imageFile)}`);
  }
</script>

<main>
  <h1>Create New Post</h1>
  
  <form on:submit={handleSubmit}>
    <label>
      Redirect URL:
      <input type="url" bind:value={redirectUrl} required />
    </label>
    
    <label>
      Image Filename (from /static/images):
      <input type="text" bind:value={imageFile} required />
    </label>

    <button type="submit">Create Post</button>
  </form>
</main>

<style>
  main {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
