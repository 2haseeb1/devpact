// types/next-auth.d.ts

// We are only importing what we explicitly use: DefaultSession and DefaultJWT
import type { DefaultSession } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

// Augment the 'next-auth/jwt' module to add custom properties to the JWT
declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback and `auth`, when using JWT sessions
   */
  interface JWT extends DefaultJWT {
    /** The user's database ID. */
    id?: string;
    /** The user's custom username. */
    username?: string;
  }
}

// Augment the 'next-auth' module to add custom properties to the Session and User
declare module "next-auth" {
  /**
   * The shape of the `session` object returned by `useSession`, `auth`, etc.
   */
  interface Session {
    user: {
      /** The user's database ID, added from the JWT. */
      id: string;
      /** The user's custom username, added from the JWT. */
      username?: string | null;
    } & DefaultSession["user"]; // Inherit default properties like name, email, image
  }

  /**
   * The shape of the `user` object in the database or returned by the adapter.
   * We are adding our custom 'username' property.
   */
  interface User {
    username?: string | null;
  }
}
