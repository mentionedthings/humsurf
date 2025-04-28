<script>
  import { base } from '$app/paths'; // Import base path

  let targetUrl = '';
  let imageFilename = ''; // User enters only the filename, e.g., 'my-image.jpg'
  let customTitle = ''; // Add state for custom title
  let generatedUrl = ''; // Variable to store the generated URL

  function handleSubmit(e) {
    e.preventDefault();
    // Construct the full URL using the current origin
    const origin = window.location.origin;
    // Encode all parameters and include the title
    generatedUrl = `${origin}${base}/post?url=${encodeURIComponent(targetUrl)}&image=${encodeURIComponent(imageFilename)}&title=${encodeURIComponent(customTitle)}`;
  }
</script>

<h1>Create Redirect Link</h1>

<form on:submit={handleSubmit}>
  <div>
    <label for="urlInput">Target Website URL:</label>
    <input id="urlInput" type="url" bind:value={targetUrl} required placeholder="https://example.com/your-post" />
  </div>
  <div>
    <label for="imageInput">Image Filename (must be in `static/images`):</label>
    <input id="imageInput" type="text" bind:value={imageFilename} required placeholder="your-image.png" />
  </div>
  <div>
    <label for="titleInput">Custom Title (for link preview):</label>
    <input id="titleInput" type="text" bind:value={customTitle} placeholder="Optional: Custom Title Here" />
  </div>
  <button type="submit">Generate Link</button>
</form>

{#if generatedUrl}
  <div class="generated-link">
    <h2>Your Shareable Link:</h2>
    <p>
      <a href={generatedUrl} target="_blank">{generatedUrl}</a>
    </p>
    <p><em>Click the link to test it or copy it to share.</em></p>
  </div>
{/if}

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
  .generated-link {
    margin-top: 2em;
    padding: 1em;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    word-wrap: break-word; /* Ensure long URLs wrap */
  }
</style>
