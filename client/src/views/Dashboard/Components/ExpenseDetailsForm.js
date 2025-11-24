import { simpleIconCdn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";


export const ExpenseDetailsForm = ({ category, onBack, onSave, accounts }) => {
    const [expenseData, setExpenseData] = React.useState({
        categoryId: category?._id,
        categoryName: category?.name,
        accountId: accounts?.[0]._id,
        accountName: accounts?.[0].accountName,
        price: '',
        currency: accounts?.[0].currency,
        notes: '',
    });

    const [tempcat, setTempCat] = React.useState(
        JSON.stringify(accounts?.[0] || {})
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "accountId") {
            const accountObj = JSON.parse(value);
            setTempCat(value);
            setExpenseData(prev => ({
                ...prev,
                accountId: accountObj._id,
                accountName: accountObj.accountName,
                currency: accountObj.currency,
            }));
            return;
        }

        setExpenseData(prev => ({ ...prev, [name]: value }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(expenseData);
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className={`text-sm font-semibold mb-6 flex items-center p-3 rounded-xl bg-gray-700 flex gap-2`}>
                <Image
                    src={simpleIconCdn(category.icon)}
                    style={{
                        filter:
                            "invert(75%) sepia(24%) saturate(1063%) hue-rotate(210deg) brightness(98%) contrast(92%)",
                    }}
                    alt={category.icon}
                    width={28}
                    height={28}
                />
                <span className="ml-2 text-white font-bold">{category?.name}</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
                {/* Account Dropdown */}
                <div>
                    <label htmlFor="accountId" className="block text-sm font-medium text-gray-400 mb-1">Account</label>
                    <div className="relative">
                        <select
                            id="accountId"
                            name="accountId"
                            value={tempcat}   // <-- FIXED
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl p-3 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition"
                        >
                            {accounts.map(account => (
                                <option key={account._id} value={JSON.stringify(account)}>
                                    {account.accountName}
                                </option>
                            ))}
                        </select>

                        <ChevronRight className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 pointer-events-none" />
                    </div>
                </div>

                {/* Price and Currency */}
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-400 mb-1">Price</label>
                        <input
                            id="price"
                            name="price"
                            type="text"
                            inputMode="decimal"
                            value={expenseData?.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            required
                            step="0.01"
                            min="0.01"
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl p-3 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>
                    <div className="w-24">
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-400 mb-1">Currency</label>
                        <div className="relative">
                            <input
                                type="text"
                                disabled
                                id="currency"
                                name="currency"
                                value={expenseData?.currency}
                                onChange={handleChange}
                                className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl p-3 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition"
                            >
                            </input>
                        </div>
                    </div>
                </div>

                {/* Notes (Extra detail) */}
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-400 mb-1">Notes (Optional)</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={expenseData?.notes}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Add a brief description or note..."
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl p-3 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                    ></textarea>
                </div>
            </form>

            {/* Save Button */}
            <div className="mt-6">
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-lg shadow-indigo-500/50"
                >
                    Save Expense
                </button>
            </div>
        </div>
    );
};