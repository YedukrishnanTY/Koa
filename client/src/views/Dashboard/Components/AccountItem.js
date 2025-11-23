import { Icon } from '@/lib/utils';
import React from 'react'

const AccountItem = ({ account, currency, onClick }) => {
    const isNegative = account.balance < 0;
    const formattedBalance = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
    }).format(account.balance);

    return (
        <div onClick={() => { onClick(account, 'edit') }} className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-700/50 cursor-pointer">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-600/50 rounded-full">
                    <Icon name={account.icon} className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-gray-200 font-medium text-sm truncate">{account?.accountName}</p>
                    <p className="text-gray-400 text-xs">Account #{account._id}</p>
                </div>
            </div>
            <div className={`font-semibold text-sm ${isNegative ? 'text-red-400' : 'text-green-400'}`}>
                {formattedBalance}
            </div>
        </div>
    );
};
export default AccountItem