import type { NextAuthConfig } from "next-auth";
import { getDynamicNextAuthUrl } from "@/lib/url-helpers";

    export const authConfig: NextAuthConfig = {
    debug: process.env.NODE_ENV === "development",
    trustHost: true,
    basePath: "/api/auth",
    providers: [], // Providers will be added in the route handler
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
        const isLoggedIn = !!auth?.user;
        const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
        if (isOnDashboard) {
            if (isLoggedIn) return true;
            return false; // Redirect unauthenticated users to login page
        } else if (isLoggedIn) {
            return true;
        }
        return true;
        },
        jwt: async ({ token, user }) => {
        if (user) {
            token.id = user.id;
            token.email = user.email;
        }
        return token;
        },
        session: async ({ session, token }) => {
        if (token && session.user) {
            session.user.id = token.id as string;
        }
        return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/error",
    },
};