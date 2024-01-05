import { Handlers } from "$fresh/server.ts";
import { createSupabaseClient } from "../../plugins/auth.ts";
import { redirect } from "../../utils.ts";

export const handler: Handlers = {
  async GET(req) {
    const resp = redirect("/auth/signin");
    const supabase = createSupabaseClient(req, resp);

    await supabase.auth.signOut();

    return resp;
  },
};
