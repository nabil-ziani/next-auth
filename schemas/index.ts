import { newPassword } from '@/actions/new-password'
import { UserRole } from '@prisma/client'
import * as z from 'zod'

export const NewPasswordSchema = z.object({
    password: z.string().min(6, { message: "Minimum 6 characters required" })
})

export const ResetSchema = z.object({
    email: z.string().email({ message: "Email is required" }),
})

export const LoginSchema = z.object({
    email: z.string().email({ message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    code: z.optional(z.string())
})

export const RegisterSchema = z.object({
    firstname: z.string().min(1, { message: 'Firstname is required' }),
    lastname: z.string().min(1, { message: 'Lastname is required' }),
    email: z.string().email({ message: "Email is required" }),
    password: z.string().min(6, { message: "Minimum 6 characters required" })
})

export const SettingsSchema = z.object({
    firstname: z.optional(z.string()),
    lastname: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
})
    .refine((data) => {
        if (data.password && !data.newPassword) {
            return false
        }

        return true
    }, { message: 'New password is required!', path: ["newPassword"] })
    .refine((data) => {
        if (data.newPassword && !data.password) {
            return false
        }

        return true
    }, { message: 'Password is required!', path: ["password"] })
