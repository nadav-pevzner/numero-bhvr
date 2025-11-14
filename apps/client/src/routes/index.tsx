import { authClient } from "@/lib/auth-client";
import { createFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  if (!session) {
    router.navigate({ to: "/signin" });
    return null;
  } else {
    router.navigate({ to: "/chat" });
    return null;
  }
}
