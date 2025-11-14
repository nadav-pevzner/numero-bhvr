// Lazy environment variable accessor that works in both Node.js and Cloudflare Workers
// Using a Proxy to read process.env at access time, not at module initialization
// @ts-check

/**
 * @typedef {Object} Env
 * @property {string} AUTH_DB_URL
 * @property {string} CHAT_DB_URL
 * @property {"development" | "production" | "test"} NODE_ENV
 * @property {string} CLIENT_URL
 * @property {string} BETTER_AUTH_URL
 * @property {string} BETTER_AUTH_SECRET
 * @property {string} GOOGLE_GENERATIVE_AI_API_KEY
 * @property {string} GOOGLE_CLIENT_ID
 * @property {string} GOOGLE_CLIENT_SECRET
 */

/** @type {Env} */
export const env = new Proxy({}, {
  get(_target, prop) {
    if (typeof process !== "undefined" && process.env) {
      return process.env[prop];
    }
    return undefined;
  },
});
