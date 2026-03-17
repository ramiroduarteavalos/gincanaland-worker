export default {
  async fetch(request: Request, env: { ASSETS: Fetcher }): Promise<Response> {
    // Delegamos al binding de assets para servir index.html, JS y CSS
    return env.ASSETS.fetch(request);
  }
};

