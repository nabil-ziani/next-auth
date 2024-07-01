'use server'

import * as z from 'zod'
import { RegisterSchema } from '@/schemas'
import bcrypt from "bcryptjs"
import { db } from '@/lib/db'
import { getUserByEmail } from '@/data/user'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: 'Invalid fields!' }
    }

    const { firstname, lastname, email, password } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
        return { error: 'Email already in use!' }
    }

    await db.user.create({
        data: {
            firstname,
            lastname,
            email,
            password: hashedPassword
        }
    })

    // TODO: send verification token email

    return { success: 'User created!' }
}