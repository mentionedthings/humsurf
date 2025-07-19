// Simple in-memory store for short links
// { id: { url, image, title } }
export const linkStore = new Map();

export function createLink({ url, image, title }) {
  // Generate a short random ID
  const id = Math.random().toString(36).substring(2, 8);
  linkStore.set(id, { url, image, title });
  return id;
}

export function getLink(id) {
  return linkStore.get(id);
} 