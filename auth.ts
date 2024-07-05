import NextAuth from "next-auth"
import authConfig from "./auth.config"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"
import { getUserById } from "./data/user"
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation"
import { getAccountByUserId } from "./data/account"

export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error"
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            })
        }
    },
    callbacks: {
        async signIn({ user, account }) {
            // Allow OAuth without email verification
            if (account?.provider !== "credentials") return true

            const existingUser = await getUserById(user.id!)

            // Prevent signin without email verification
            if (!existingUser?.emailVerified) {
                return false
            }

            if (existingUser.isTwoFactorEnabled) {
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

                if (!twoFactorConfirmation) return false

                // Delete two factor confirmation for next sign-in
                await db.twoFactorConfirmation.delete({
                    where: { id: twoFactorConfirmation.id }
                })
            }

            return true
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role
            }

            if (token.firstname && session.user) {
                session.user.firstname = token.firstname as string
            }

            if (token.lastname && session.user) {
                session.user.lastname = token.lastname as string
            }

            if (token.email && session.user) {
                session.user.email = token.email
            }

            if (session.user) {
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
                session.user.isOAuth = token.isOAuth as boolean
            }

            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token

            const existingUser = await getUserById(token.sub)
            if (!existingUser) return token

            const existingAccount = await getAccountByUserId(existingUser.id)

            token.isOAuth = !!existingAccount
            token.firstname = existingUser.firstname
            token.lastname = existingUser.lastname
            token.email = existingUser.email
            token.role = existingUser.role
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

            return token
        }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
})