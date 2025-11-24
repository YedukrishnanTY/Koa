'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { palettes } from '@/common/palettes';
import { getProfileDetails } from '@/services/Auth.services';
import { toast } from 'sonner';
import RecentTransaction from './Components/RecentTransaction';
import ChartAndSubs from './Components/ChartAndSubs';
import Balance from './Components/Balance';
import { Button } from '@/components/ui/button';
import { createExpenseOrIncome, getExpenseAll } from '@/services/Expenses.services';
import { getAccountslist } from '@/services/Accounts.services';
import { getCategoryList } from '@/services/Category.services';



export default function HomePage({
    currencyList
}) {
    const router = useRouter();
    const [loading, setLoading] = React.useState(true);
    const [profile, setProfile] = React.useState(null);
    const [recent, setRecent] = React.useState(null);
    const [accounts, setAccounts] = React.useState([]);
    const [category, setCategory] = React.useState([])
    const [selectedcategory, setSelectedCategory] = React.useState({})
    const [selectedOptions, setSelectedOptions] = React.useState('')

    const loadData = async () => {
        try {
            setLoading(true);

            const [profile, expenses, accounts, categories] = await Promise.all([
                getProfileDetails(),
                getExpenseAll(),
                getAccountslist(),
                getCategoryList()
            ]);

            setProfile(profile);
            setRecent(expenses || []);
            setAccounts(accounts || []);
            setCategory(categories || [])
            setSelectedCategory(categories?.[0] || {})

        } catch (err) {
            if (err?.from === 'profile') {
                toast.error('Failed to fetch profile details. Please login again.');
                router.push('/login');
            } else {
                toast.error(err?.message || 'Something went wrong.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleExpense = (data) => {
        if (!data?.price || isNaN(Number(data.price))) return toast.warning('please add a valid amount')
        const payload = {
            isIncome: selectedOptions === 'Expense' ? false : true,
            ...data,
            price: Number(data?.price || 0)
        }
        createExpenseOrIncome(payload)
            .then(res => {
                toast.success('expense added')
                loadData();
            }).catch(err => {
                loadData();
                toast.error(err?.message || 'Something went wrong.');
            })
    }

    React.useEffect(() => {
        loadData()
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white-900"></div>
            </div>
        );
    }

    return (
        <div className=" p-6 md:p-10" style={{ color: palettes.primary[400] }}>
            {/* Header */}
            <header className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg md:text-xl font-semibold">Welcome back, {profile?.name}</h2>
                    <p className="text-sm text-gray-500">Overview of your money at a glance</p>
                </div>

            </header>

            {/* Top row: Balance + Quick actions */}
            <Balance
                accounts={accounts || []} category={category}
                setSelectedCategory={setSelectedCategory} selectedcategory={selectedcategory}
                handleExpense={handleExpense}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
            />

            {/* Middle row: Charts + Subscriptions/Budgets */}
            <ChartAndSubs currencyList={currencyList} profile={profile} accounts={accounts || []} getList={loadData} />

            {/* Recent transactions */}
            <RecentTransaction recent={recent} accounts={accounts || []} />

        </div>
    )
}

