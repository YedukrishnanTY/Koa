import { palettes } from '@/common/palettes';
import { AddAccount, DeleteAccount, EditAccount, getAccountslist } from '@/services/Accounts.services';
import React from 'react'

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';
import { toast } from 'sonner';
import Addmodal from './Addmodal';
import AddAccountItem from './AddAccountItem';
import AccountItem from './AccountItem';
import { ScrollArea } from '@/components/ui/scroll-area';

const balanceData = [
    { name: 'Jan', balance: 8000 },
    { name: 'Feb', balance: 9200 },
    { name: 'Mar', balance: 7600 },
    { name: 'Apr', balance: 11200 },
    { name: 'May', balance: 9800 },
    { name: 'Jun', balance: 12500 },
    { name: 'Jul', balance: 14300 },
];



function ChartAndSubs({ currencyList, profile, accounts, getList }) {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [editDetails, setEditDetails] = React.useState({});


    const handleOpenModal = (account, type) => {
        if (type !== 'edit') {
            setEditDetails({})
            setIsDialogOpen(true)
            return
        } else {
            setIsDialogOpen(true)
            setEditDetails(account)

        }
    };

    const handleAddAccount = async (payload) => {
        if (editDetails?._id) {
            EditAccount(payload)
                .then(res => {
                    toast.success('Edited successfully')
                    getList();
                }).catch(err => {
                    toast.error(err?.message || 'failed to add')
                })
        } else {
            AddAccount(payload)
                .then(res => {
                    toast.success('added successfully')
                    getList();
                }).catch(err => {
                    toast.error(err?.message || 'failed to add')
                })
        }
    };

    const handleDelete = async (payload) => {
        if (editDetails?._id) {
            DeleteAccount(payload)
                .then(res => {
                    toast.success('Deleted successfully')
                    getList();
                }).catch(err => {
                    toast.error(err?.message || 'failed to add')
                })
        } else {
            toast.error('failed to delete your account')
        }
    };

    const format = (v) => v.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
    return (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8" >

            {/* 1. Spending/Trend Chart Card (lg:col-span-2) - Revamped Design */}
            <div
                className="lg:col-span-2 rounded-2xl p-5 shadow-2xl border border-gray-700/50"
                style={{ backgroundColor: palettes.dark[800] }}
            >
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-extrabold text-xl text-white">Spending Trend</h3>
                    <div className="text-sm text-gray-400 font-medium">Sep — Nov</div>
                </div>

                {/* Chart area container (dark theme) */}
                <div className="rounded-xl p-4 shadow-inner" style={{ backgroundColor: palettes.dark[900], border: '1px solid #334155' }}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold text-lg text-white">Balance trend</div>
                        <div className="text-xs text-gray-400">Last 6 months</div>
                    </div>
                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                            <LineChart data={balanceData}>
                                {/* Mock Recharts elements for structure */}
                                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip contentStyle={{ backgroundColor: palettes.dark[800], border: 'none' }} itemStyle={{ color: palettes.primary[400] }} />
                                <Line type="monotone" dataKey="balance" stroke={palettes.primary[400]} strokeWidth={3} dot={{ r: 4, fill: palettes.primary[400] }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Insights metrics */}
                <div className="mt-6 grid grid-cols-3 gap-4 text-white">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: palettes.dark[900], border: '1px solid #334155' }}>
                        <div className="text-gray-400 text-xs uppercase tracking-wider">Top category</div>
                        <div className="font-semibold text-base mt-1 text-white">Food & Drink</div>
                    </div>
                    <div className="p-3 rounded-xl" style={{ backgroundColor: palettes.dark[900], border: '1px solid #334155' }}>
                        <div className="text-gray-400 text-xs uppercase tracking-wider">Avg daily spend</div>
                        <div className="font-semibold text-base mt-1" style={{ color: palettes.red[500] }}>{format(40)}</div>
                    </div>
                    <div className="p-3 rounded-xl" style={{ backgroundColor: palettes.dark[900], border: '1px solid #334155' }}>
                        <div className="text-gray-400 text-xs uppercase tracking-wider">Forecast total</div>
                        <div className="font-semibold text-base mt-1 text-white">{format(2200)}</div>
                    </div>
                </div>
            </div>

            {/* 2. Accounts List Card (lg:col-span-1) - Revamped Design */}
            <div
                className="rounded-2xl p-5 shadow-2xl border border-gray-700/50"
                style={{ backgroundColor: palettes.dark[800] }}
            >
                <h4 className="font-extrabold text-xl text-white mb-4">Your Accounts</h4>

                {/* Account List Area */}
                <ScrollArea
                    className="space-y-2 pr-1"
                    style={{ maxHeight: '300px' }}
                >
                    {accounts.map((account) => (
                        <AccountItem key={account._id} account={account} onClick={handleOpenModal} />
                    ))}
                </ScrollArea>

                <AddAccountItem onClick={handleOpenModal} currencyList={currencyList} profile={profile} />

                <Addmodal
                    isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}
                    currencyList={currencyList} profile={profile}
                    onSave={handleAddAccount} editDetails={editDetails}
                    handleDelete={handleDelete}
                />
            </div>
        </section>
    )
}

export default ChartAndSubs