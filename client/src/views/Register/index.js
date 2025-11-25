'use client'
import { palettes } from '@/common/palettes'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

import { signup } from '@/services/Auth.services'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner';

function Register({ currencyList = [] }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        if (username.trim() === '' || password.trim() === '' || selectedCurrency.trim() === '') {
            toast.warning('All fields are required');
            return;
        }
        e.preventDefault();
        const formData = {
            name: username,
            password,
            currency: selectedCurrency,
        };
        const response = signup(formData).then((data) => {
            toast.success('', {
                title: "Registration Successful",
                description:
                    "You have registered successfully",
            });
            setTimeout(() => {
                router.push('/login');
            }, 1500);
        }).catch((error) => {
            toast.warning('', {
                title: "Registration Failed",
                description:
                    error?.data?.message ||
                    error?.message ||
                    "Something went wrong",
            });
        });

    };

    return (
        <div className='flex'>
            <div className='w-full md:w-1/2 lg:w-1/3 p-4 mx-auto mt-20'>
                <div className='p-5 rounded-lg shadow-lg flex flex-col gap-8 shadow-2xl border border-gray-700/50' style={{ background: palettes.dark[800], color: palettes.primary[400] }}>
                    <div className='flex flex-col gap-2 '>
                        <h2 className='text-2xl font-bold' style={{ color: palettes.primary[400] }} >Create an account</h2>
                        <h5 className='text-sm' style={{ color: palettes.light[50] }}>Please fill in the information below:</h5>
                    </div>
                    <div className='flex flex-col gap-5'>
                        <Form onSubmit={handleSubmit}>
                            <div className='w-full mb-4'>
                                <Input
                                    type='text'
                                    placeholder='User Name'
                                    className='w-full p-5 rounded-sm'
                                    style={{ background: palettes.dark[800], color: palettes.light[50] }}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='w-full mb-4'>
                                <Input
                                    type='password'
                                    placeholder='Password'
                                    className='w-full p-5 rounded-sm'
                                    style={{ background: palettes.dark[800], color: palettes.light[50] }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className='w-full mb-6'>
                                <Select onValueChange={setSelectedCurrency} value={selectedCurrency} required>
                                    <SelectTrigger
                                        className='w-full p-5 rounded-sm'
                                        style={{ background: palettes.dark[800], color: palettes.light[50] }}>
                                        <SelectValue placeholder="Select Currency" />
                                    </SelectTrigger>
                                    <SelectContent className='w-full bg-gray-800 border-gray-700 text-white'>
                                        <SelectGroup>
                                            <SelectLabel>Currency</SelectLabel>
                                            {currencyList.map((currency) => (
                                                <SelectItem key={currency.code} value={currency.code}>
                                                    {currency.code} ({currency.name})
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>

                                </Select>
                            </div>
                            <div className='flex items-center justify-between'>
                                <Button onClick={handleSubmit} type='submit' className='w-full font-bold' style={{
                                    backgroundColor: palettes.primary[400],
                                    color: palettes.slate[100]
                                }}>
                                    Register
                                </Button>
                            </div>
                        </Form>
                        <div className='flex flex-col gap-2 '>
                            <h5 className='text-sm' style={{ color: palettes.light[50] }}>
                                <Link style={{
                                    color: palettes.primary[400],
                                }}
                                    href={'/login'}> Already have an account? </Link></h5>
                        </div>
                        <div className='mt-4 p-3 border rounded-md' style={{ borderColor: palettes.slate[700] }}>
                            <p className='text-xs' style={{ color: palettes.light[50] }}>
                                ⚠️ <strong>Disclaimer:</strong> Please remember your <strong>User Name</strong> and <strong>Password</strong>.
                                In this initial phase, the password <strong>cannot be reset</strong> if forgotten.
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Register