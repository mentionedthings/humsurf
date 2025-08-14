<script>
  import { base } from '$app/paths'; // Import base path
  export let form; // Receive form action results

  let targetUrl = '';
  let imageFilename = ''; // User enters only the filename, e.g., 'my-image.jpg'
  let customTitle = ''; // Add state for custom title
  let customDescription = ''; // Add state for custom description
  let password = ''; // State for password input

  // Determine if authenticated based on the form action result
  // Determine if authenticated based on the form action result
  $: isAuthenticated = form?.success === true && !form?.created;

  // When a link is created, construct the full URL to display
  $: generatedUrl = form?.created && form?.slug ? `${window.location.origin}${base}/${form.slug}` : '';


</script>

<h1>Create Redirect Link</h1>

{#if isAuthenticated}
  <!-- Show link generation form only if authenticated -->
  <form method="POST" action="?/create">
    <div>
      <label for="urlInput">Target Website URL:</label>
      <input id="urlInput" name="url" type="url" bind:value={targetUrl} required placeholder="https://example.com/your-post" />
    </div>
    <div>
      <label for="imageInput">Image Filename (must be in `static/images`):</label>
      <input id="imageInput" name="image" type="text" bind:value={imageFilename} required placeholder="your-image.png" />
    </div>
    <div>
      <label for="titleInput">Custom Title (for link preview):</label>
      <input id="titleInput" name="title" type="text" bind:value={customTitle} placeholder="Optional: Custom Title Here" />
    </div>
    <div>
      <label for="descriptionInput">Custom Description (for link preview):</label>
      <textarea id="descriptionInput" name="description" bind:value={customDescription} placeholder="A catchy description of the content."></textarea>
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
