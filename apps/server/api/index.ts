import app from "../index";

// Vercel Bun function handler
export default {
  async fetch(request: Request) {
    return app.fetch(request);
  },
};
