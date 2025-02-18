'use client'

import React, { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogTrigger } from '../ui/dialog'
import { DialogContent } from '@radix-ui/react-dialog'
import { LoginForm } from './login-form'

interface LoginButtonProps {
    children: ReactNode,
    mode?: 'modal' | 'redirect',
    asChild?: boolean
}

export const LoginButton = ({ children, mode = 'redirect', asChild }: LoginButtonProps) => {

    const router = useRouter()

    const onClick = () => router.push('/auth/login')

    if (mode == 'modal') {
        return (
            <span>
                <Dialog>
                    <DialogTrigger asChild={asChild}>
                        {children}
                    </DialogTrigger>
                    <DialogContent className='p-0 w-auto bg-transparent border-none'>
                        <LoginForm />
                    </DialogContent>
                </Dialog>
            </span>
        )
    }

    return (
        <span onClick={onClick} className='cursor-pointer'>
            {children}
        </span>
    )
}