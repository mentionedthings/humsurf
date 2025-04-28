<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths'; // Import base path

  let targetUrl = '';
  let imageFilename = ''; // User enters only the filename, e.g., 'my-image.jpg'

  function handleSubmit() {
    // Construct the relative path to the post page
    const postPath = `${base}/post?url=${encodeURIComponent(targetUrl)}&image=${encodeURIComponent(imageFilename)}`;
    goto(postPath);
  }
</script>

<h1>Create Redirect Post</h1>

<form on:submit|preventDefault={handleSubmit}>
  <div>
    <label for="urlInput">Target Website URL:</label>
    <input id="urlInput" type="url" bind:value={targetUrl} required placeholder="https://example.com/your-post" />
  </div>
  <div>
    <label for="imageInput">Image Filename (must be in `static/images`):</label>
    <input id="imageInput" type="text" bind:value={imageFilename} required placeholder="your-image.png" />
  </div>
  <button type="submit">Create Redirect Page</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 500px;
    margin-top: 1rem;
  }
  label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.25rem;
  }
  input {
    width: 100%;
    padding: 0.5rem;
    box-sizing: border-box;
  }
  button {
    padding: 0.75rem;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1rem;
  }
  button:hover {
    background-color: #0056b3;
  }
</style>
