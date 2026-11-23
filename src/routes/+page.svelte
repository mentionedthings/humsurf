<script>
  import { base } from '$app/paths';
  export let data;
  export let form;

  let targetUrl = '';
  let imageFilename = '';
  let customTitle = '';
  let customDescription = '';
  let generatedUrl = '';
  let copied = false;
  let password = '';

  $: isAuthenticated = form?.success === true ? true : form?.loggedOut === true ? false : Boolean(data?.isAuthenticated);

  function createSlug(text) {
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);

    return slug || 'post';
  }

  function sanitizeImageName(filename) {
    const cleaned = filename.trim().split('/').pop()?.split('\\').pop() || '';
    return cleaned.replace(/[^a-zA-Z0-9._-]/g, '');
  }

  function isValidHttpUrl(rawUrl) {
    try {
      const parsed = new URL(rawUrl.trim());
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    copied = false;

    if (!isValidHttpUrl(targetUrl)) {
      generatedUrl = '';
      alert('Please enter a valid http:// or https:// URL.');
      return;
    }

    const origin = window.location.origin;
    const slug = createSlug(customTitle);
    const safeImage = sanitizeImageName(imageFilename);

    const params = new URLSearchParams();
    params.set('url', targetUrl.trim());
    if (safeImage) params.set('image', safeImage);
    if (customTitle.trim()) params.set('title', customTitle.trim());
    if (customDescription.trim()) params.set('description', customDescription.trim());

    generatedUrl = `${origin}${base}/${slug}?${params.toString()}`;
  }

  async function copyLink() {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2000);
  }
</script>

<h1>Create Redirect Link</h1>

{#if isAuthenticated}
  <div class="top-bar">
    <span>Authenticated</span>
    <form method="POST" action="?/logout" class="inline-form">
      <button type="submit" class="secondary-btn">Logout</button>
    </form>
  </div>

  <form on:submit={handleSubmit}>
    <div>
      <label for="urlInput">Target Website URL:</label>
      <input
        id="urlInput"
        type="url"
        bind:value={targetUrl}
        required
        placeholder="https://example.com/your-post"
      />
    </div>
    <div>
      <label for="imageInput">Image Filename (must be in `static/images`):</label>
      <input
        id="imageInput"
        type="text"
        bind:value={imageFilename}
        required
        placeholder="your-image.png"
      />
    </div>
    <div>
      <label for="titleInput">Custom Title (for link preview):</label>
      <input
        id="titleInput"
        type="text"
        bind:value={customTitle}
        placeholder="Optional: Custom Title Here"
      />
    </div>
    <div>
      <label for="descriptionInput">Custom Description (for link preview):</label>
      <textarea
        id="descriptionInput"
        bind:value={customDescription}
        placeholder="A catchy description of the content."
      ></textarea>
    </div>
    <button type="submit">Generate Link</button>
  </form>

  {#if generatedUrl}
    <div class="generated-link">
      <input type="text" readonly value={generatedUrl} />
      <button type="button" on:click={copyLink}>{copied ? 'Copied' : 'Copy'}</button>
    </div>
  {/if}
{:else}
  <form method="POST" action="?/login">
    <p>Please enter the password to access the generator:</p>
    <div>
      <label for="password">Password:</label>
      <input id="password" name="password" type="password" bind:value={password} required />
    </div>
    {#if form?.incorrect}
      <p class="error">Incorrect password. Please try again.</p>
    {/if}
    {#if form?.error}
      <p class="error">{form.error}</p>
    {/if}
    <button type="submit">Login</button>
  </form>
{/if}

<style>
  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 500px;
    margin-bottom: 1rem;
    padding: 0.5rem 0.75rem;
    background-color: #f8f9fa;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .inline-form {
    margin: 0;
  }

  .secondary-btn {
    padding: 0.35rem 0.75rem;
    background-color: #4b5563;
    font-size: 0.85rem;
  }

  .secondary-btn:hover {
    background-color: #374151;
  }

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
  input[type="password"],
  textarea {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: inherit;
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
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    max-width: 500px;
  }

  .generated-link input {
    flex-grow: 1;
  }

  .error {
    color: red;
    font-weight: bold;
  }
</style>
