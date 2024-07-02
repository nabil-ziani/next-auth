import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {

    const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: '2FA Code',
        html: `<p>Your 2FA code: ${token}</p>`
        // react: EmailTemplate({ firstName: 'John' }),
    });
};


export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `https://localhost:3000/auth/new-password?token=${token}`

    const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Reset your password',
        html: `<p>Click <a href="${resetLink}">here to reset your password</a></p>`
        // react: EmailTemplate({ firstName: 'John' }),
    });
};

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `https://localhost:3000/auth/new-verification?token=${token}`

    const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Confirm your email',
        html: `<p>Click <a href="${confirmLink}">here to confirm your mail</a></p>`
        // react: EmailTemplate({ firstName: 'John' }),
    });
};