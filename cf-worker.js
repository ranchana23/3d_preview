// Cloudflare Worker — Google Drive font proxy
// Deploy: https://workers.cloudflare.com → Create Worker → paste this → Deploy
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const fileId = url.searchParams.get('id');

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': '*',
        },
      });
    }

    if (!fileId) {
      return new Response('Missing id', { status: 400 });
    }

    const driveUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download`;
    const resp = await fetch(driveUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    const headers = new Headers(resp.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Cache-Control', 'public, max-age=86400');

    return new Response(resp.body, {
      status: resp.status,
      headers,
    });
  },
};
