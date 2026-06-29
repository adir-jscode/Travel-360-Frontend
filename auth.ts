import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    /**
     * Fires after Google successfully authenticates the user.
     * We call our backend to upsert the user and get JWT tokens set as cookies.
     */
    async signIn({ user, account }) {
      // Only handle Google provider
      if (account?.provider !== "google") {
        return true;
      }

      try {
        const response = await fetch(`${BACKEND_API_URL}/auth/google-oauth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            picture: user.image,
            providerId: account.providerAccountId,
          }),
        });

        const result = await response.json();

        if (!result.success) {
          console.error(
            "[NextAuth] Google OAuth backend error:",
            result.message,
          );
          // Return false to abort sign in if backend rejected (e.g. user blocked)
          return false;
        }

        // Tokens are returned in the response body (backend also sets them as
        // httpOnly cookies on API calls that go through the proxy — here we
        // store them in the NextAuth JWT so the signIn callback can forward
        // them to the Next.js cookie store in the server action layer).
        // We attach them to user so jwt() callback can forward them.
        user.accessToken = result.data.accessToken;
        user.refreshToken = result.data.refreshToken;
        user.dbUser = result.data.user;

        return true;
      } catch (error) {
        console.error(
          "[NextAuth] Failed to reach backend during Google OAuth:",
          error,
        );
        return false;
      }
    },

    /**
     * Persist tokens from signIn into the NextAuth JWT so we can access
     * them in session() and in server actions.
     */
    async jwt({ token, user }) {
      if (user?.accessToken) {
        token.accessToken = user?.accessToken as string;
        token.refreshToken = user?.refreshToken as string;
        token.dbUser = user.dbUser;
      }
      return token;
    },

    /**
     * Expose the tokens and db user in the client-side session object.
     */
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.refreshToken = token.refreshToken as string | undefined;
      session.dbUser = token.dbUser as Record<string, unknown>;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
});
