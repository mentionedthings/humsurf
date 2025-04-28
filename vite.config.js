import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	// Add this section to prevent replacing process.env in SSR builds
	define: {
		// Ensure 'process.env' is not replaced during SSR build
		'process.env': 'process.env'
	},
	// If you have specific ssr options, keep them, otherwise this define block is top-level
	// Example if you had ssr options already:
	// ssr: {
	//   // your existing ssr options...
	//   define: {
	//     'process.env': 'process.env'
	//   }
	// }
});
