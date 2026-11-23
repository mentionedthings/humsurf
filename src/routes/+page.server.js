import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const COOKIE_NAME = 'humsurf_auth';

async function createAuthToken(password) {
	const encoder = new TextEncoder();
	const keyData = encoder.encode(password);
	const msgData = encoder.encode('humsurf-session-v1');

	const cryptoKey = await crypto.subtle.importKey(
		'raw',
		keyData,
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);

	const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
	return Array.from(new Uint8Array(signature))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

function timingSafeEqual(a, b) {
	if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) {
		return false;
	}
	let diff = 0;
	for (let i = 0; i < a.length; i++) {
		diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return diff === 0;
}

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ cookies, url }) => {
	const correctPassword = env.LINK_GEN_PASSWORD;
	const token = cookies.get(COOKIE_NAME);

	let isAuthenticated = false;
	if (correctPassword && token) {
		const expectedToken = await createAuthToken(correctPassword);
		isAuthenticated = timingSafeEqual(token, expectedToken);
	}

	return {
		isAuthenticated,
		isHttps: url.protocol === 'https:'
	};
};

/** @type {import('./$types').Actions} */
export const actions = {
	login: async ({ request, cookies, url }) => {
		const correctPassword = env.LINK_GEN_PASSWORD;
		const data = await request.formData();
		const password = data.get('password');

		if (!correctPassword) {
			console.error('LINK_GEN_PASSWORD environment variable is not set.');
			return fail(500, { error: 'Server configuration error.' });
		}

		if (typeof password === 'string' && password === correctPassword) {
			const token = await createAuthToken(correctPassword);
			cookies.set(COOKIE_NAME, token, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: url.protocol === 'https:',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});

			return { success: true };
		}

		return fail(401, { incorrect: true });
	},

	logout: async ({ cookies }) => {
		cookies.delete(COOKIE_NAME, { path: '/' });
		return { loggedOut: true };
	}
};
