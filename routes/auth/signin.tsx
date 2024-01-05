import { Handlers } from "$fresh/server.ts";
import { assert } from "$std/assert/assert.ts";
import { createSupabaseClient } from "../../plugins/auth.ts";
import { redirect } from "../../utils.ts";
import { Container } from "../../components/Container.tsx";
import { Button } from "../../components/Button.tsx";

export const handler: Handlers = {
  async POST(req) {
    const resp = redirect("/dashboard");
    const supabase = createSupabaseClient(req, resp);
    const form = await req.formData();
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();

    assert(email, "email is required");
    assert(password, "password is required");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/auth/signin?message=Error signing up");
    }

    return resp;
  },
};

export default function Page(req: Request) {
  const message = new URL(req.url).searchParams.get("message");

  return (
    <Container>
      <div class="max-w-lg mx-auto flex flex-col gap-4 justify-start">
        <h1 class="text-xl">Sign in</h1>
        <form method="post" class="flex-col flex gap-4">
          <div class="flex flex-col gap-2">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              class="border p-2 rounded"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              class="border p-2 rounded"
            />
          </div>
          <Button type="submit">Sign in</Button>
        </form>
        {message && <p class="text-red-500 font-semibold">{message}</p>}
      </div>
    </Container>
  );
}
