import { ChatComponent } from "@/components/Chat/Chat";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { authClient } from "../lib/auth-client";

export const Route = createFileRoute("/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.navigate({ to: "/signin" });
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  return <ChatComponent />;
}
