# Social Media Redirector (SvelteKit)

This SvelteKit application generates special links that serve two purposes:

1.  **For Social Media Crawlers (Facebook, Twitter, LinkedIn, etc.):** It provides Open Graph and Twitter Card meta tags so that when the link is shared, a rich preview (title, description, image) is displayed.
2.  **For Regular Users:** It redirects them to the actual target website after a short delay, optionally showing a preview image.

## How it Works

-   The homepage (`/`) provides a form to input a target URL and the filename of a preview image.
-   Submitting the form generates a link to the `/post` route, encoding the target URL and image filename as query parameters (e.g., `/post?url=https://example.com&image=my-preview.png`).
-   The `/post` route detects if the visitor is a crawler (based on User-Agent) or a regular user.
    -   Crawlers are served HTML with appropriate meta tags for previews and are **not** redirected.
    -   Users are shown a temporary page (optionally with the image) and then redirected to the target URL using a meta refresh tag.

## Setup and Usage

### Prerequisites

-   Node.js and npm installed.

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repo-url>
    cd <repo-directory>
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

```bash
npm run dev -- --open
```

This will start the development server, typically at `http://localhost:5173`.

### Using the Application

1.  Navigate to the application's homepage in your browser.
2.  Enter the full **Target Website URL** you want users to ultimately be redirected to.
3.  Enter the **Image Filename** for the preview image. 
    **Important:** This image file **must** exist inside the `static/images/` directory of the project *before* you generate the link (e.g., if you enter `my-image.jpg`, make sure `static/images/my-image.jpg` exists).
4.  Click "Generate Link".
5.  Copy the generated link. You can now share this link on social media or elsewhere.

## Image Handling

-   Preview images **must** be placed in the `static/images/` directory.
-   The application constructs the image URL based on the filename you provide (e.g., `your-image.png` becomes `/images/your-image.png`).

## Deployment

This application is configured using `adapter-auto`, which attempts to detect the deployment environment. For specific platforms like Cloudflare Pages, you might consider explicitly using the corresponding adapter (e.g., `@sveltejs/adapter-cloudflare`) by installing it (`npm i -D @sveltejs/adapter-cloudflare`) and updating `svelte.config.js`:

```javascript
// svelte.config.js
// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-cloudflare';

// ... rest of the config

export default config;
```

Refer to the SvelteKit documentation for adapters specific to your deployment target.
