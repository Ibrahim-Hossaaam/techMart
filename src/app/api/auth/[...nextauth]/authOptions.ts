import CredentialsProvider from "next-auth/providers/credentials";
import apiService from "../../../../../services/api";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Gmail",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await apiService.signin(
          credentials?.email ?? "",
          credentials?.password ?? ""
        );

        if (res.message === "success") {
          return {
            id: res.user.email,
            name: res.user.name,
            email: res.user.email,
            role: res.user.role,
            token: res.token,
          };
        }
        return null;
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async session({ session, token }) {
      session.user.role = token.role as string;
      session.user.token = token.token as string;
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.token = user.token;
      }
      return token;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};