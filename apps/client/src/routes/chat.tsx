import { ChatComponent } from "@/components/Chat/Chat";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { authClient } from "../lib/auth-client";
export const Route = createFileRoute("/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  if (!session) {
    router.navigate({ to: "/signin" });
    return null;
  }

  return <ChatComponent />;
}
