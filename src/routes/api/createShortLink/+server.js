import { json } from '@sveltejs/kit';

export async function POST({ request, platform }) {
  const data = await request.formData();
  const url = data.get('url');
  const image = data.get('image');
  const title = data.get('title');
  if (!url || !image || !title) {
    return json({ error: 'Missing required fields.' }, { status: 400 });
  }
  // Generate a short random ID
  const id = Math.random().toString(36).substring(2, 8);
  // Store in Cloudflare KV
  const value = JSON.stringify({ url, image, title });
  await platform.env.LINKS_KV.put(id, value);
  return json({ id });
} 