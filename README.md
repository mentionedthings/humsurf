# SvelteKit Starter Template

This is a starter template for a SvelteKit application, featuring a modern and responsive design, optimized for Cloudflare Pages deployment.

## Features

- 🚀 Built with SvelteKit
- 📱 Responsive design
- 🎨 Modern UI with SvelteKit branding
- ⚡ Fast and optimized
- 📦 TypeScript support
- 🎯 SEO-friendly
- ☁️ Cloudflare Pages ready

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Cloudflare account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser to see the result.

## Project Structure

```
├── src/
│   ├── lib/
│   │   └── assets/
│   │       └── sveltekit.svg
│   ├── routes/
│   │   ├── +page.svelte
│   │   └── +layout.svelte
│   └── app.css
├── static/
│   └── favicon.ico
├── package.json
├── svelte.config.js
└── tsconfig.json
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production version
- `npm run preview` - Preview the production build
- `npm run check` - Run TypeScript checks
- `npm run check:watch` - Run TypeScript checks in watch mode

## Deployment to Cloudflare Pages

### Prerequisites
- A Cloudflare account
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

### Deployment Steps

1. Log in to your Cloudflare dashboard
2. Go to Pages
3. Click "Create a project"
4. Connect your Git provider
5. Select your repository
6. Configure your build settings:
   - Build command: `npm run build`
   - Build output directory: `.svelte-kit/cloudflare`
   - Node version: 16 or higher
7. Click "Save and Deploy"

### Environment Variables

If your project requires environment variables:

1. Go to your project in Cloudflare Pages
2. Navigate to Settings > Environment variables
3. Add your environment variables
4. Redeploy your project

## Customization

### Changing Colors

The main color scheme can be modified in the `+page.svelte` file by updating the color values in the CSS:

```css
.title a {
  color: #FF3E00; /* SvelteKit orange */
}

.card:hover,
.card:focus,
.card:active {
  color: #FF3E00;
  border-color: #FF3E00;
}
```

### Adding New Pages

To add a new page, create a new `.svelte` file in the `src/routes` directory. The file name will determine the route:

- `src/routes/about.svelte` → `/about`
- `src/routes/blog/[slug].svelte` → `/blog/hello-world`

## Learn More

To learn more about SvelteKit and Cloudflare Pages, take a look at the following resources:

- [SvelteKit Documentation](https://kit.svelte.dev/docs) - learn about SvelteKit features and API.
- [Learn SvelteKit](https://learn.svelte.dev) - an interactive tutorial for SvelteKit.
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/) - learn about deploying to Cloudflare Pages.
- [SvelteKit Cloudflare Adapter](https://github.com/sveltejs/kit/tree/master/packages/adapter-cloudflare) - learn about the Cloudflare adapter.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 