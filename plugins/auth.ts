import type { FreshContext, Plugin } from "$fresh/server.ts";
import { assert } from "$std/assert/assert.ts";
import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { Session } from "@supabase/supabase-js";
import { redirect } from "../utils.ts";

export type SignedInState = {
  session: Session;
};

export type SignedOutState = {
  session?: null;
};

export type AuthState = SignedInState | SignedOutState;

export const authPlugin: Plugin = {
  name: "auth",
  middlewares: [
    // For every route, we ensure the session state is updated
    {
      path: "/",
      middleware: {
        handler: setSessionState,
      },
    },

    // For the dashboard route, we ensure the user is signed in
    {
      path: "/dashboard",
      middleware: {
        handler: ensureSignedIn,
      },
    },
  ],
};

async function setSessionState(req: Request, ctx: FreshContext) {
  if (ctx.destination !== "route") return await ctx.next();

  // Sanity check - start without a session
  ctx.state.session = null;

  // Create an empty response object here. We want to make sure we do this
  // session refresh before going further down the middleware chain
  const resp = new Response();
  const supabase = createSupabaseClient(req, resp);

  // Refresh session if expired
  const { data } = await supabase.auth.getSession();

  ctx.state.session = data.session;

  // Continue down the middleware chain
  const nextResp = await ctx.next();

  // Copy over any headers that were added by Supabase
  // Note how we're spreading the headers before iterating. This ensures we're
  // capturing potentially duplicated headers that Supabase might add, like
  // chunked cookies.
  for (const [key, value] of [...resp.headers]) {
    nextResp.headers.append(key, value);
  }

  return nextResp;
}

function ensureSignedIn(_req: Request, ctx: FreshContext) {
  if (!ctx.state.session) {
    return redirect(
      "/auth/signin?message=You must be signed in to access this page",
    );
  }

  return ctx.next();
}

export function createSupabaseClient(req: Request, resp: Response) {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

  assert(SUPABASE_URL, "SUPABASE_URL is not set");
  assert(ANON_KEY, "SUPABASE_ANON_KEY is not set");

  const supabase = createServerClient(SUPABASE_URL, ANON_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(req.headers.get("Cookie") || "");
      },

      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          const cookie = serializeCookieHeader(key, value, options);
          // If the cookie is updated, update the cookies for the response
          resp.headers.append("Set-Cookie", cookie);
        });
      },
    },
  });

  return supabase;
}
