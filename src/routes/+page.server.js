import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private'; // Import environment variables

// Define the expected password from environment variables
const CORRECT_PASSWORD = q7X@/z3r!Z;

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
	}
};
