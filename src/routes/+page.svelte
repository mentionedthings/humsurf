<script>
  import { enhance } from '$app/forms';
  import { base } from '$app/paths';

  // Receive the 'isAuthenticated' status and form data from the server load function
  export let data;
  export let form;

  let targetUrl = '';
  let imageFilename = '';
  let title = '';
  let generatedUrl = '';

  function handleSubmit(e) {
    e.preventDefault();
    // Construct the full URL using the current origin
    const origin = window.location.origin;
    generatedUrl = `${origin}${base}/post?url=${encodeURIComponent(targetUrl)}&image=${encodeURIComponent(imageFilename)}&title=${encodeURIComponent(title)}`;
  }

  // Reactive statement to clear generated URL if login fails
  $: if (form?.message && !form?.success) {
    generatedUrl = '';
  }
</script>

<svelte:head>
  <title>Create Redirect Link</title>
</svelte:head>

{#if data.isAuthenticated}
  <!-- === Authenticated Content === -->
  <h1>Create Redirect Link</h1>

  <form method="POST" action="?/logout" use:enhance>
    <button type="submit" class="logout-button">Log Out</button>
  </form>

  <form on:submit={handleSubmit} class="link-form">
    <div>
      <label for="urlInput">Target Website URL:</label>
      <input id="urlInput" type="url" bind:value={targetUrl} required placeholder="https://example.com/your-post" />
    </div>
    <div>
      <label for="imageInput">Image Filename (must be in `static/images`):</label>
      <input id="imageInput" type="text" bind:value={imageFilename} required placeholder="your-image.png" />
    </div>
    <div>
      <label for="titleInput">Custom Title (for social preview):</label>
      <input id="titleInput" type="text" bind:value={title} placeholder="Optional: My Awesome Link Title" />
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

{:else}
  <!-- === Login Form === -->
  <h1>Enter Password</h1>
  <form method="POST" action="?/login" use:enhance class="login-form">
    <div>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required />
    </div>
    {#if form?.message}
      <p class="error">{form.message}</p>
    {/if}
    <button type="submit">Login</button>
  </form>
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
  .login-form, .link-form {
    max-width: 500px;
    margin: 2em auto;
    padding: 1.5em;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  .login-form div, .link-form div {
    margin-bottom: 1em;
  }
  label {
    display: block;
    margin-bottom: 0.3em;
    font-weight: bold;
  }
  input[type="url"],
  input[type="text"],
  input[type="password"] {
    width: 100%;
    padding: 0.7em;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
  button {
    padding: 0.8em 1.8em;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.2s ease;
  }
  button:hover {
    background-color: #0056b3;
  }
  .generated-link {
    margin-top: 2em;
    padding: 1em;
    border: 1px dashed #007bff;
    background-color: #f0f8ff;
    word-wrap: break-word;
  }
  .generated-link h2 {
    margin-top: 0;
  }
  .error {
    color: #d9534f; /* Bootstrap danger color */
    margin-top: 0.5em;
    font-weight: bold;
  }
  .logout-button {
    background-color: #f0ad4e; /* Bootstrap warning color */
    float: right; /* Position logout button */
    padding: 0.5em 1em;
    font-size: 0.9em;
    margin-bottom: 1em; /* Add some space below */
  }
  .logout-button:hover {
    background-color: #ec971f;
  }
  /* Clear float for the form below logout */
  .link-form {
    clear: both;
  }
</style>
