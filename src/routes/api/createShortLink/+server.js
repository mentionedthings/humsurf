import { json } from '@sveltejs/kit';
import { createLink } from '../../../lib/linkStore.js';

export async function POST({ request }) {
  const data = await request.formData();
  const url = data.get('url');
  const image = data.get('image');
  const title = data.get('title');
  if (!url || !image || !title) {
    return json({ error: 'Missing required fields.' }, { status: 400 });
  }
  const id = createLink({ url, image, title });
  return json({ id });
} 