The homepage (`/`) provides a form to input a target URL and the filename of a preview image.
-   Submitting the form generates a link to the `/post` route, encoding the target URL and image filename as query parameters (e.g., `/post?url=https://example.com&image=my-preview.png`).
-   The `/post` route detects if the visitor is a crawler (based on User-Agent) or a regular user.
    -   Crawlers are served HTML with appropriate meta tags for previews and are **not** redirected.
    -   Users are shown a temporary page (optionally with the image) and then redirected to the target URL using a meta refresh tag.
