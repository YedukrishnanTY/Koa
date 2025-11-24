'use client';
import { palettes } from '@/common/palettes';
import { Button } from '@/components/ui/button'
import { getProfileDetails } from '@/services/Auth.services';
import { ChevronDown, CurrencyIcon, LogOut, SearchIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'

import React from 'react'

function Header() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [profile, setProfile] = React.useState(null);


    const handleLogo = () => {
        setLoading(true)
        getProfileDetails()
            .then((res) => {
                setProfile(res);
                router.push('/dashboard');
            })
            .catch((err) => {
                router.push('/');
            })
            .finally(() => {
                setLoading(false)
            })
    }

    // Handler for currency change (Mock)
    const handleCurrencyChange = (newCurrency) => {
        setProfile(prev => ({ ...prev, currency: newCurrency }));
    };

    // Handler for logout (Mock)
    const handleLogout = () => {
        setProfile(null); // Simulate logging out
        localStorage.clear()
        router.push('/');
        console.log('User logged out.');
    };

    React.useEffect(() => {
        handleLogo()
    }, [])

    return (
        <div className='flex items-center justify-between px-2 py-2 sm:flex-row'>
            <Image src="/logo.png" onClick={() => { handleLogo() }} alt="Logo" width={60} height={40} className='cursor-pointer' />
            <div className='flex gap-4 flex-row items-center'>
                {loading ? (
                    // Loading Spinner (simple Tailwind)
                    <div className="w-6 h-6 border-2 border-[#a78bfa] border-t-transparent rounded-full animate-spin"></div>
                ) : profile ? (
                    // Display Avatar Menu if profile is loaded
                    <ProfileDropdown
                        profile={profile}
                        onLogout={handleLogout}
                        onCurrencyChange={handleCurrencyChange}
                    />
                ) : (
                    // Optional: Display login button if not authenticated
                    <></>
                )}
            </div>
        </div>
    )
}

export default Header


const ProfileDropdown = ({ profile, onLogout, onCurrencyChange }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const dropdownRef = React.useRef(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm(''); // Clear search on close
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    // Filter currencies based on search term
    const MOCK_CURRENCIES = []
    const filteredCurrencies = MOCK_CURRENCIES.filter(currency =>
        currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        currency.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectCurrency = (currencyCode) => {
        onCurrencyChange(currencyCode);
        setSearchTerm('');
        setIsOpen(false);
    };
    const User = (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );


    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#a78bfa]"
                aria-expanded={isOpen}
            >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#a78bfa] flex items-center justify-center shadow-md ring-2 ring-[#a78bfa] text-white font-semibold text-lg">
                    {profile.name ? profile.name?.substring(0, 2).toUpperCase() : '-'}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>

            {/* Dropdown Content */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 z-20">
                    <div className="p-4 space-y-3">

                        {/* User Info Section */}
                        <div className="flex items-center space-x-3 border-b pb-3 mb-3">
                            <User className="w-5 h-5 text-[#a78bfa]" />
                            <div className="text-sm font-semibold text-gray-900 truncate">{profile.name}</div>
                        </div>


                        {/* Logout Button */}
                        <Button
                            onClick={onLogout}
                            className="w-full text-red-600 bg-red-50 hover:bg-red-100 mt-4 flex items-center justify-center"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>

                    </div>
                </div>
            )}
        </div>
    );
};