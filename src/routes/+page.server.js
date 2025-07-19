import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createLink } from '../lib/linkStore.js';

const CORRECT_PASSWORD = env.LINK_GEN_PASSWORD;

/** @type {import('./$types').Actions} */
export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		const password = data.get('password');

		if (!CORRECT_PASSWORD) {
			console.error('LINK_GEN_PASSWORD environment variable is not set.');
			return fail(500, { error: 'Server configuration error.' });
		}

		if (password === CORRECT_PASSWORD) {
			return { success: true };
		} else {
			return fail(401, { incorrect: true });
		}
	},

  createShortLink: async ({ request, url }) => {
    const data = await request.formData();
    const targetUrl = data.get('url');
    const image = data.get('image');
    const title = data.get('title');
    if (!targetUrl || !image || !title) {
      return fail(400, { error: 'Missing required fields.' });
    }
    const id = createLink({ url: targetUrl, image, title });
    return { id };
  }
};
