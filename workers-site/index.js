export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Serve root as index.html
    if (url.pathname === '/' || url.pathname === '') {
      const res = await fetch(new URL('./index.html', import.meta.url));
      return new Response(await res.text(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Try to serve static asset matching the pathname
    try {
      const assetPath = '.' + url.pathname;
      const res = await fetch(new URL(assetPath, import.meta.url));
      // If the asset exists, return it directly
      if (res.ok) return res;
    } catch (e) {
      // fallthrough to 404
    }

    return new Response('Not found', { status: 404 });
  },
};
