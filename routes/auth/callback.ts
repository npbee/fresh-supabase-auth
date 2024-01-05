import { Handlers } from "$fresh/server.ts";
import { redirect } from "../../utils.ts";
import { createSupabaseClient } from "../../plugins/auth.ts";

export const handler: Handlers = {
  async GET(req) {
    // The `/auth/callback` route is required for the server-side auth flow implemented
    // by the Auth Helpers package. It exchanges an auth code for the user's session.
    const requestUrl = new URL(req.url);
    const resp = redirect("/dashboard");
    const code = requestUrl.searchParams.get("code");
    const supabase = createSupabaseClient(req, resp);

    if (code) {
      await supabase.auth.exchangeCodeForSession(code);
    }

    return resp;
  },
};
