import { FreshContext } from "$fresh/server.ts";
import { Container } from "../../components/Container.tsx";
import { SignedInState } from "../../plugins/auth.ts";

// Make this an `async` function so we can get the full context
export default async function DashboardPage(
  _req: Request,
  ctx: FreshContext<SignedInState>,
) {
  const { session } = ctx.state;
  const { user } = session;
  return (
    <Container>
      <h1 class="text-xl">Dashboard</h1>
      <p>Hello, {user.email}</p>
    </Container>
  );
}
