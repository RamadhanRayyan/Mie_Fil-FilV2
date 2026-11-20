import type { H3Event } from "h3";
import {
  serverSupabaseUser,
  serverSupabaseServiceRole,

} from "#supabase/server";

export async function requireAdmin(event: H3Event) {
  const claims = await serverSupabaseUser(event);

  const adminId = claims?.sub;
  if (!adminId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const admin = serverSupabaseServiceRole<any>(event);
  const { data, error } = await admin
    .from("users")
    .select("role")
    .eq("id", adminId)
    .single();

  if (error || data?.role !== "admin") {
    throw createError({ statusCode: 404, statusMessage: "Not Found" });
  }

  return { adminId, admin };
}