import { palettes } from "@/common/palettes";
import { simpleIconCdn } from "@/lib/utils";

import { ChevronRight, X, DollarSign, Calendar, Tag, CreditCard, AlignLeft } from 'lucide-react';

const format = (value) => `$${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const TransactionDetailModal = ({ transaction, category, onClose }) => {
    if (!transaction) return null;

    const isExpense = transaction.isIncome ? false : true;
    const amountColor = isExpense ? palettes.red[500] : palettes.green[500];
    const iconUrl = simpleIconCdn(category?.find(i => i._id === transaction.categoryId)?.icon);

    const DetailItem = ({ icon: Icon, label, value }) => (
        <div className="flex items-center space-x-3 p-3 bg-gray-700/60 rounded-xl">
            {/* <Icon className="w-5 h-5 text-gray-400 flex-shrink-0" /> */}
            <div>
                <p className="text-sm font-medium text-gray-300">{label}</p>
                <p className="text-base font-semibold text-white">{value}</p>
            </div>
        </div>
    );

    return (
        // Overlay
        <div
            className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            {/* Modal Content */}
            <div
                className="relative w-full max-w-lg mx-auto bg-gray-800 rounded-2xl shadow-2xl transition-transform duration-300 transform scale-100"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                    <h2 className="text-2xl font-extrabold text-white">
                        Transaction Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Primary Info Block (Icon + Amount) */}
                    <div className="flex flex-col items-center justify-center space-y-3">
                        {/* Icon */}
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ring-4 ${isExpense ? 'ring-red-500/30' : 'ring-green-500/30'}`}>
                            <img
                                src={iconUrl}
                                alt={transaction.categoryName}
                                className="w-8 h-8 filter invert-[75%]"
                            />
                        </div>

                        {/* Amount */}
                        <div className="text-4xl font-black">
                            <span style={{ color: amountColor }}>
                                {isExpense ? '-' : '+'} {format(transaction.price)}
                            </span>
                        </div>

                        {/* Name */}
                        <h3 className="text-xl font-bold text-white text-center">
                            {transaction.categoryName}
                        </h3>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DetailItem
                            icon={Tag}
                            label="Category"
                            value={transaction?.categoryName || 'N/A'}
                        />
                        <DetailItem
                            icon={CreditCard}
                            label="Account"
                            value={transaction.accountName}
                        />
                        <DetailItem
                            icon={Calendar}
                            label="Date"
                            value={new Date(transaction.createdAt).toLocaleString()}
                        />
                        <DetailItem
                            icon={DollarSign}
                            label="Type"
                            value={isExpense ? 'Expense' : 'Income'}
                        />
                    </div>

                    {/* Description */}
                    <div className="pt-4 space-y-2">
                        <div className="flex items-center text-gray-400 font-medium">
                            <AlignLeft className="w-4 h-4 mr-2" />
                            Description
                        </div>
                        <p className="text-sm text-gray-300 p-4 bg-gray-700/60 rounded-xl">
                            {transaction.notes || "No description provided for this transaction."}
                        </p>
                    </div>
                </div>

                {/* Footer (Optional action buttons) */}
                {/* <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => { alert('Pretending to edit transaction...'); onClose(); }}
                        className="px-4 py-2 text-sm font-semibold rounded-lg text-black bg-white hover:bg-gray-200 transition"
                    >
                        Edit Transaction
                    </button>
                </div> */}
            </div>
        </div>
    );
};