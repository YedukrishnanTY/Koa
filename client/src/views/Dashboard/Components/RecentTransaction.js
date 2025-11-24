import React from 'react';
import { ChevronRight, } from 'lucide-react';
import { palettes } from '@/common/palettes';
import { simpleIconCdn } from '@/lib/utils';
import Image from 'next/image';
import { TransactionDetailModal } from './TransactionDetailModal';

const format = (value) => `$${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;


function RecentTransaction({ recent, category }) {

    const [selectedTransaction, setSelectedTransaction] = React.useState(null);

    const handleTransactionClick = (transaction) => {
        setSelectedTransaction(transaction);
    };

    const handleCloseModal = () => {
        setSelectedTransaction(null);
    };
    return (
        <section
            className="rounded-2xl p-5 shadow-2xl border border-gray-700/50"
            style={{ backgroundColor: palettes.dark[800] }}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-xl text-white"> Transactions</h3>
                {/* <button
                    className="text-sm font-semibold hover:text-white transition"
                    style={{ color: palettes.primary[400] }}
                >
                    See all
                </button> */}
            </div>
            <ul className="space-y-2">
                {recent?.map((t) => {
                    const isExpense = t.isIncome ? false : true;
                    const amountColor = isExpense ? palettes.red[500] : palettes.green[500];
                    // const IconComponent = categoryIcons[t.category] || ChevronRight; // Default icon
                    return (
                        <li
                            key={t._id}
                            className="py-3 px-2 flex items-center justify-between rounded-lg hover:bg-gray-700/50 transition duration-150 cursor-pointer"
                            onClick={() => handleTransactionClick(t)}
                        >
                            <div className="flex items-center gap-4">

                                {/* Transaction Icon based on Expense/Income */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md  `}>
                                    <Image
                                        src={simpleIconCdn(category?.find(i => i._id === t.categoryId)?.icon)}
                                        style={{
                                            filter:
                                                "invert(75%) sepia(24%) saturate(1063%) hue-rotate(210deg) brightness(98%) contrast(92%)",
                                        }}
                                        alt={simpleIconCdn(category?.find(i => i._id === t.categoryId)?.icon) || ''}
                                        width={28}
                                        height={28}
                                    />
                                </div>

                                <div>
                                    <div className="font-medium text-white">{t.categoryName}</div>
                                    <div className="text-xs text-gray-400">{t.accountName} • {new Date(t.createdAt).toLocaleString()}</div>
                                </div>
                            </div>

                            {/* Amount */}
                            <div className="flex items-center gap-1">
                                <span className={`font-bold text-lg`} style={{ color: amountColor }}>
                                    {isExpense ? '-' : '+'} {format(t.price)}
                                </span>
                                <ChevronRight className="w-4 h-4 text-gray-500 ml-2" />
                            </div>
                        </li>
                    );
                })}
            </ul>
            {selectedTransaction && (
                <TransactionDetailModal
                    transaction={selectedTransaction}
                    category={category}
                    onClose={handleCloseModal}
                />
            )}
        </section>
    );
}

export default RecentTransaction;