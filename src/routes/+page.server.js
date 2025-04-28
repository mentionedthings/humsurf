// src/routes/+page.server.js
import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';

// --- IMPORTANT ---
// You MUST set this environment variable in your Cloudflare Pages settings.
// For local development, you can create a .env file in the project root:
// PAGE_PASSWORD=your_secret_password
import { PAGE_PASSWORD } from '$env/static/private';

const COOKIE_NAME = 'page_auth';

/** @type {import('./$types').PageServerLoad} */
export function load({ cookies }) {
	// Check if the user already has the auth cookie
	const isAuthenticated = cookies.get(COOKIE_NAME) === 'true';
	console.log(`Load - Is Authenticated: ${isAuthenticated}`); // For debugging
	return {
		isAuthenticated: isAuthenticated,
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const password = data.get('password');

		if (!PAGE_PASSWORD) {
			console.error('ERROR: PAGE_PASSWORD environment variable is not set!');
			return fail(500, { message: 'Server configuration error.' });
		}

		if (password === PAGE_PASSWORD) {
			console.log('Login successful, setting cookie.'); // For debugging
			// Set a secure, HTTP-only cookie to remember the login
			cookies.set(COOKIE_NAME, 'true', {
				path: '/',
				maxAge: 60 * 60 * 24 * 7, // Cookie valid for 1 week
				httpOnly: true, // Not accessible via JavaScript
				secure: !dev, // Use 'secure' only in production (HTTPS)
				sameSite: 'strict', // Helps prevent CSRF
			});
			// No need to redirect, the page will reload via enhance and show content
			return { success: true };
		} else {
			console.log('Login failed: incorrect password.'); // For debugging
			return fail(401, { message: 'Incorrect password.' });
		}
	},

	logout: async ({ cookies }) => {
		console.log('Logout requested, deleting cookie.'); // For debugging
		cookies.delete(COOKIE_NAME, { path: '/' });
		// Redirect to the same page to clear the state
		throw redirect(303, '/');
	},
};
