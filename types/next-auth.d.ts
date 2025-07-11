// types/next-auth.d.ts

// We removed 'User as DefaultUser' from this import line.
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in 'Session' type to add our custom properties.
   * This is the type for the object returned by `useSession`, `auth`, etc.
   */
  interface Session {
    user: {
      /** The user's unique ID from the database. */
      id: string;
      /** Our custom username field. */
      username?: string | null;
      // ...and add the default properties (name, email, image)
    } & DefaultSession["user"];
  }

  /**
   * Extends the built-in 'User' type.
   * This is the type for the 'user' object in callbacks and for direct imports.
   */
  interface User {
    // This adds 'username' to the original User type without needing to reference it directly.
    username?: string | null;
  }
}
