// lib/actions/auth.actions.ts

"use server";

import { signOut as nextAuthSignOut } from "@/lib/auth";

export async function signOut() {
  await nextAuthSignOut({ redirectTo: "/" });
}
