'use client';
import { palettes } from '@/common/palettes';
import { Button } from '@/components/ui/button'
import { getProfileDetails } from '@/services/Auth.services';
import Image from 'next/image';
import { useRouter } from 'next/navigation'

import React from 'react'

function Header() {
    const router = useRouter();

    const handleLogo = () => {
        getProfileDetails()
            .then((res) => {
                router.push('/dashboard');
            })
            .catch((err) => {
                router.push('/');
            });
    }


    return (
        <div className='flex items-center justify-between px-2 py-2 sm:flex-row'>
            <Image src="/logo.png" onClick={() => { handleLogo() }} alt="Logo" width={60} height={40}  className='cursor-pointer'/>
            <div className='flex gap-4 flex-row'>
                {/* <Button type='submit' className='font-bold'
                    onClick={() => { router.push('/register') }}
                    style={{
                        backgroundColor: palettes.primary[400],
                        color: palettes.slate[100],

                    }}>
                    Sign up
                </Button>
                <Button type='submit' className='font-bold'
                    onClick={() => { router.push('/login') }}
                    style={{
                        color: palettes.primary[400],
                        backgroundColor: palettes.slate[100],
                        padding: '12px 16px'
                    }}>
                    Login
                </Button> */}
            </div>
        </div>
    )
}

export default Header