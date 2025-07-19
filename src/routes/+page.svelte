<script>
  import { base } from '$app/paths'; // Import base path
  export let form; // Receive form action results

  let targetUrl = '';
  let imageFilename = ''; // User enters only the filename, e.g., 'my-image.jpg'
  let customTitle = ''; // Add state for custom title
  let generatedUrl = ''; // Variable to store the generated URL
  let password = ''; // State for password input

  // Determine if authenticated based on the form action result
  $: isAuthenticated = form?.success === true;

  function handleSubmit(e) {
    e.preventDefault();
    const origin = window.location.origin;
    // Generate a slug from the customTitle
    const slug = customTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    generatedUrl = `${origin}${base}/post/${slug}?url=${encodeURIComponent(targetUrl)}&image=${encodeURIComponent(imageFilename)}`;
  }
</script>

<h1>Create Redirect Link</h1>

{#if isAuthenticated}
  <!-- Show link generation form only if authenticated -->
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
      <p>Generated Link:</p>
      <input type="text" readonly value={generatedUrl} />
      <button on:click={() => navigator.clipboard.writeText(generatedUrl)}>Copy</button>
    </div>
  {/if}
{:else}
  <!-- Show password form if not authenticated -->
  <form method="POST" action="?/login">
    <p>Please enter the password to access the generator:</p>
    <div>
      <label for="password">Password:</label>
      <input id="password" name="password" type="password" bind:value={password} required />
    </div>
    {#if form?.incorrect}
      <p class="error">Incorrect password. Please try again.</p>
    {/if}
    <button type="submit">Login</button>
  </form>
{/if}

<style>
/* Add some basic styling */
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin-bottom: 1rem;
}
div {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
label {
  font-weight: bold;
}
input[type="text"],
input[type="url"],
input[type="password"] {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
button:hover {
  background-color: #0056b3;
}
.generated-link {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.generated-link input {
  flex-grow: 1;
}
.error {
    color: red;
    font-weight: bold;
}
</style>
