import type { NextAuthConfig } from "next-auth"

import Credentials from "next-auth/providers/credentials"
import Google, { GoogleProfile } from "next-auth/providers/google"
import Facebook, { FacebookProfile } from "next-auth/providers/facebook"
import Instagram from "next-auth/providers/instagram"
import { LoginSchema } from "./schemas"
import { getUserByEmail } from "./data/user"
import bcrypt from "bcryptjs"

export default {
    providers: [
        Google({
            profile: (_profile: GoogleProfile) => {
                return {
                    id: _profile.sub,
                    firstname: _profile.given_name,
                    lastname: _profile.family_name,
                    email: _profile.email,
                    image: _profile.picture
                };
            },
        }),
        Facebook({
            // allowDangerousEmailAccountLinking: true,
            userinfo: {
                URL: "https://graph.facebook.com/me?fields=id,name,email,picture,first_name,last_name"
            },
            profile: (_profile: FacebookProfile) => {
                return {
                    id: _profile.id,
                    firstName: _profile.first_name,
                    lastName: _profile.last_name,
                    email: _profile.email,
                    image: _profile.picture.data.url
                };
            },
        }),
        Instagram({
            // allowDangerousEmailAccountLinking: true,
            userinfo: {
                URL: "https://graph.facebook.com/me?fields=id,name,email,picture,first_name,last_name"
            },
            profile: (_profile) => {
                return {
                    id: _profile.id,
                    firstName: _profile.first_name,
                    lastName: _profile.last_name,
                    email: _profile.email,
                    image: _profile.picture.data.url
                };
            },
        }),
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials)

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data

                    const user = await getUserByEmail(email)
                    if (!user || !user.password) return null

                    const passwordsMatch = await bcrypt.compare(password, user.password)

                    if (passwordsMatch) return user
                }

                return null
            }
        })
    ]
} satisfies NextAuthConfig