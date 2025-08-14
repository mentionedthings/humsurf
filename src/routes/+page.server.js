import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private'; // Import environment variables

// Define the expected password from environment variables
const CORRECT_PASSWORD = env.LINK_GEN_PASSWORD;

/** @type {import('./$types').Actions} */
/**
 * A simple function to convert a title into a URL-friendly slug.
 * @param {string} title
 * @returns {string}
 */
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with a single one
}

export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		const password = data.get('password');

		if (!CORRECT_PASSWORD) {
			console.error('LINK_GEN_PASSWORD environment variable is not set.');
			// Optionally, fail gracefully or allow access in dev mode?
			// For now, fail if the password isn't set server-side.
			return fail(500, { error: 'Server configuration error.' });
		}

		if (password === CORRECT_PASSWORD) {
			// Password is correct, return success
			// This will make `form.success` true on the page
			return { success: true };
		} else {
			// Password is incorrect, return failure
			// This will make `form.incorrect` true on the page
			return fail(401, { incorrect: true });
		}
	},

	create: async ({ request, platform }) => {
		const data = await request.formData();
		const url = data.get('url');
		const image = data.get('image');
		const title = data.get('title') || 'Redirect'; // Default title

		if (!url || !image) {
			return fail(400, { error: 'Target URL and Image are required.' });
		}

		// Generate a slug from the title
		let slug = createSlug(title);

		// Ensure the slug is unique. If it exists, append a short random string.
		const existing = await platform.env.LINKS.get(slug);
		if (existing) {
			slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
		}

		const linkData = {
			url,
			image,
			title
		};

		// Save the data to Cloudflare KV
		await platform.env.LINKS.put(slug, JSON.stringify(linkData));

		// Return the successful result with the new short URL
		return { success: true, created: true, slug: slug };
	}
};
