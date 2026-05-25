import { type NextAuthOptions, type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // TODO: Später mit Datenbank verbinden
        // Für jetzt: Test-Accounts
        const testAccounts = [
          { email: "operator@easyb2b.de", password: "operator123", name: "Operator 1" },
          { email: "admin@easyb2b.de", password: "admin123", name: "Admin" },
        ];

        const user = testAccounts.find(
          (account) =>
            account.email === credentials?.email &&
            account.password === credentials?.password
        );

        if (user) {
          return {
            id: user.email,
            email: user.email,
            name: user.name,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
