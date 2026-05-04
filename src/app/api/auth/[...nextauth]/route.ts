import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // MOCK AUTH: In a real app, you would look up the user in a database and verify the password here.
        // For this assignment, we accept any credentials and return a mock user profile.
        if (credentials?.email && credentials?.password) {
          return {
            id: "1",
            name: credentials.email.split('@')[0] || "Awesome User",
            email: credentials.email,
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
          };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Pass user info to the token right after sign in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass token info to the session so it's available to the client
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture as string | null | undefined;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Use our custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
