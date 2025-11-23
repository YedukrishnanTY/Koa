'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
} from 'recharts';
import { palettes } from '@/common/palettes';
import { getProfileDetails } from '@/services/Auth.services';
import { toast } from 'sonner';
import { set } from 'date-fns';

const balanceData = [
    { name: 'Jan', balance: 8000 },
    { name: 'Feb', balance: 9200 },
    { name: 'Mar', balance: 7600 },
    { name: 'Apr', balance: 11200 },
    { name: 'May', balance: 9800 },
    { name: 'Jun', balance: 12500 },
    { name: 'Jul', balance: 14300 },
];

const expensesByCategory = [
    { category: 'Food', amount: 4200 },
    { category: 'Transport', amount: 1500 },
    { category: 'Shopping', amount: 2300 },
    { category: 'Bills', amount: 900 },
    { category: 'Others', amount: 600 },
];

const recentTransactions = [
    { id: 'tx_01', title: 'Grocery', category: 'Food', amount: 420, date: '2025-11-21' },
    { id: 'tx_02', title: 'Uber', category: 'Transport', amount: 320, date: '2025-11-20' },
    { id: 'tx_03', title: 'Electricity bill', category: 'Bills', amount: 1200, date: '2025-11-18' },
    { id: 'tx_04', title: 'Shoes', category: 'Shopping', amount: 2599, date: '2025-11-15' },
    { id: 'tx_05', title: 'Coffee', category: 'Food', amount: 180, date: '2025-11-14' },
];

export default function HomePage({
    balance = 1243.72,
    income = 4200.5,
    expenses = 2956.78,
    recent = [
        { id: 1, title: 'Grocery', amount: -45.2, category: 'Food', date: 'Nov 20' },
        { id: 2, title: 'Salary', amount: 2000, category: 'Income', date: 'Nov 18' },
        { id: 3, title: 'Spotify', amount: -9.99, category: 'Subscription', date: 'Nov 15' },
    ],
}) {
    const router = useRouter();
    const format = (v) => v.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
    const [loading, setLoading] = React.useState(true);
    const [profile, setProfile] = React.useState(null);

    const getDetails = async () => {
        setLoading(true);
        await getProfileDetails()
            .then((res) => {
                setProfile(res);
            })
            .catch((err) => {
                toast.error('Failed to fetch profile details. Please login again.');
                router.push('/login');
            }).finally(() => {
                setLoading(false);
            });
    };

    React.useEffect(() => {
        getDetails();
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
                <div className="flex items-center gap-3">
                    <button className="px-3 py-2 bg-white rounded-lg shadow-sm text-sm">Accounts</button>
                    <button className="px-3 py-2 bg-white rounded-lg shadow-sm text-sm">Sync</button>
                </div>
            </header>





            {/* Top row: Balance + Quick actions */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6" >

                <div className="md:col-span-2 bg-white rounded-2xl p-5 shadow-md" style={{ backgroundColor: palettes.slate[100] }}>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-gray-400">Net balance</p>
                            <h1 className="text-2xl md:text-3xl font-bold mt-1">{format(balance)}</h1>
                            <div className="mt-3 flex gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-green-600">▲</span>
                                    <div>
                                        <div className="text-xs">Income</div>
                                        <div className="font-medium">{format(income)}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-red-600">▼</span>
                                    <div>
                                        <div className="text-xs">Expenses</div>
                                        <div className="font-medium">{format(expenses)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Placeholder for sparkline / donut */}
                        <div className="hidden md:flex items-center" >
                            <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 flex items-center justify-center">
                                <div className="text-sm text-indigo-700">Spending
                                    <div className="text-2xl font-semibold">60%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Insights row (small cards) */}
                    <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="col-span-1 bg-gray-50 p-3 rounded-lg text-sm">
                            <div className="font-medium">This month</div>
                            <div className="mt-1">Spent {format(1200)}</div>
                        </div>
                        <div className="col-span-1 bg-gray-50 p-3 rounded-lg text-sm">
                            <div className="font-medium">Subscriptions</div>
                            <div className="mt-1">3 active</div>
                        </div>
                        <div className="col-span-1 bg-gray-50 p-3 rounded-lg text-sm">
                            <div className="font-medium">Budget left</div>
                            <div className="mt-1">{format(300)}</div>
                        </div>
                    </div>
                </div>


                {/* Quick actions column */}
                <aside className="bg-white rounded-2xl p-4 shadow-md flex flex-col gap-3" style={{ backgroundColor: palettes.slate[100] }}>
                    <div className="text-sm font-medium">Quick actions</div>
                    <button className="w-full py-2 rounded-lg border text-sm">+ Add expense</button>
                    <button className="w-full py-2 rounded-lg border text-sm">+ Add income</button>
                </aside>
            </section>

            {/* Middle row: Charts + Subscriptions/Budgets */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6" >
                <div className="lg:col-span-2 bg-white rounded-2xl p-4 shadow-md">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Spending this month</h3>
                        <div className="text-sm text-gray-500">Sep — Nov</div>
                    </div>

                    {/* Chart placeholder - replace with real chart (recharts / chart.js) */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-4 shadow-sm" style={{ backgroundColor: palettes.slate[100] }}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="font-medium">Balance trend</div>
                            <div className="text-xs text-slate-500">Last 6 months</div>
                        </div>
                        <div style={{ width: '100%', height: 180 }}>
                            <ResponsiveContainer>
                                <LineChart data={balanceData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="balance" stroke="#6366F1" strokeWidth={3} dot={{ r: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-gray-600">
                        <div>
                            <div className="text-xs">Top category</div>
                            <div className="font-medium">Food</div>
                        </div>
                        <div>
                            <div className="text-xs">Avg daily</div>
                            <div className="font-medium">{format(40)}</div>
                        </div>
                        <div>
                            <div className="text-xs">Forecast</div>
                            <div className="font-medium">{format(2200)}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-md">
                    <h4 className="font-semibold mb-3">Subscriptions</h4>
                    <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Spotify</div>
                                <div className="text-xs text-gray-500">Monthly • Next: Dec 2</div>
                            </div>
                            <div className="font-medium">-9.99</div>
                        </li>
                        <li className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Netlify</div>
                                <div className="text-xs text-gray-500">Annual • Next: Jan 10</div>
                            </div>
                            <div className="font-medium">-99</div>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Recent transactions */}
            <section className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Recent transactions</h3>
                    <button className="text-sm text-indigo-600">See all</button>
                </div>

                <ul className="divide-y">
                    {recent.map((t) => (
                        <li key={t.id} className="py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm">{t.title[0]}</div>
                                <div>
                                    <div className="font-medium">{t.title}</div>
                                    <div className="text-xs text-gray-500">{t.category} • {t.date}</div>
                                </div>
                            </div>
                            <div className={`font-medium ${t.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>{t.amount < 0 ? '-' : '+'}{Math.abs(t.amount)}</div>
                        </li>
                    ))}
                </ul>
            </section>

        </div>
    )
}

