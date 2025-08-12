import { fail } from '@sveltejs/kit';
import { kv } from '@vercel/kv';
import { env } from '$env/dynamic/private'; // Import environment variables

// Define the expected password from environment variables
const CORRECT_PASSWORD = env.LINK_GEN_PASSWORD;

/**
 * A simple function to generate a URL-friendly slug from a title.
 * e.g., "My Awesome Post!" -> "my-awesome-post"
 * @param {string} title
 */
function createSlug(title) {
	if (!title) {
		// If there's no title, create a random 6-character string
		return Math.random().toString(36).substring(2, 8);
	}
	return title
		.toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with - 
		.replace(/[^\w\-]+/g, '') // Remove all non-word chars
		.replace(/\-\-+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
}

/** @type {import('./$types').Actions} */
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

	createLink: async ({ request }) => {
		const data = await request.formData();
		const targetUrl = data.get('targetUrl');
		const imageName = data.get('imageName');
		const customTitle = data.get('customTitle');
		const customDescription = data.get('customDescription');

		// Generate a slug from the title
		const slug = createSlug(customTitle);

		// Prepare the data to be stored in the database
		const postData = {
			redirectUrl,
			imageName,
			customTitle,
			customDescription
		};

		try {
			// Save the data to Vercel KV with the slug as the key
			await kv.set(slug, postData);

			// Return the generated slug on success
			return { success: true, slug: slug };
		} catch (error) {
			console.error('Error saving to KV:', error);
			return fail(500, { error: 'Could not create link.' });
		}
	}
};
