import React, { ReactNode } from 'react'
import Navbar from './_components/navbar'

interface ProtectedLayoutProps {
    children: ReactNode
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    return (
        <div className='h-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
            <Navbar />
            {children}
        </div>
    )
}

export default ProtectedLayout