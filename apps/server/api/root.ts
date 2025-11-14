// Root endpoint - health check
export default {
  async fetch(request: Request) {
    return new Response(
      JSON.stringify({
        status: "ok",
        message: "Numero BHVR Server",
        version: "1.0.0",
        endpoints: {
          api: "/api",
          auth: "/api/auth/**",
          chats: "/api/chats",
          todos: "/api/todos"
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
};
