import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("Authorize called with:", credentials?.email);

                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    throw new Error("Credenciais inválidas");
                }

                // Normalize email
                const email = credentials.email.toLowerCase().trim();
                console.log("Searching for user with normalized email:", email);

                let user;

                try {
                    user = await prisma.user.findUnique({
                        where: {
                            email: email,
                        },
                    });
                } catch (error: any) {
                    console.error("Database error in authorize:", error);
                    // Differentiate between connection error and other errors
                    if (error.code === 'P1001') {
                        throw new Error("Erro de conexão com o banco de dados");
                    }
                    throw new Error(error.message || "Falha na conexão com o banco de dados");
                }

                console.log("User found:", !!user);

                if (!user || !user.password) {
                    console.log("User not found or no password set");
                    throw new Error("Credenciais inválidas");
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isCorrectPassword) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
