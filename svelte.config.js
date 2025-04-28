import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			// default options are fine for static export
			pages: 'build',
			assets: 'build',
			fallback: undefined, // No fallback needed for basic static site
			precompress: false,
			strict: true
		}),
		// Ensure paths are relative for static export
		paths: {
			relative: true
		}
	}
};

export default config;
