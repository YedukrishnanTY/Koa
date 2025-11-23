import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { palettes } from "@/common/palettes";
import { SelectIcon } from "@radix-ui/react-select";
import { Icon } from "@/lib/utils";


export default function AddModal({ isOpen, onClose, onSave, currencyList, profile, editDetails, handleDelete }) {
    const [name, setName] = React.useState("");
    const [balance, setBalance] = React.useState("");
    const [selectedCurrency, setSelectedCurrency] = React.useState(profile?.currency || '');
    const [selectedIcon, setSelectedIcon] = React.useState('banknote');

    const accountIcons = [
        { name: "Bank Account", value: "banknote", icon: "banknote" },
        { name: "Savings", value: "piggy-bank", icon: "piggy-bank" },
        { name: "Credit Card", value: "credit-card", icon: "credit-card" },
        { name: "Investments", value: "trending-up", icon: "trending-up" },
        { name: "Insurance", value: "shield-check", icon: "shield-check" },
        { name: "Travel", value: "plane", icon: "plane" },
        { name: "Other", value: "plus", icon: "plus" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || isNaN(parseFloat(balance))) {
            toast.error("Please enter a valid name and balance.");
            return;
        }
        onSave({
            accountName: name,
            balance: parseFloat(balance),
            currency: selectedCurrency,
            icon: selectedIcon || "banknote",
            ...(editDetails?._id ? { _id: editDetails?._id } : {})
        });

        // close after save
        onClose();
    };

    const handleOpenChange = (open) => {
        if (!open) onClose();
    };

    React.useEffect(() => {
        if (editDetails?._id) {
            setName(editDetails?.accountName || '')
            setBalance(editDetails?.balance || '')
            setSelectedCurrency(editDetails?.currency || '')
            setSelectedIcon(editDetails?.icon || 'banknote')
        } else {
            setName('')
            setBalance('')
            setSelectedCurrency(profile?.currency || '')
            setSelectedIcon('banknote')
        }
    }, [editDetails, profile?.currency])

    const isEditMode = !!editDetails?._id;

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            {/* Darker background and rounded corners for the dialog content */}
            <DialogContent className="sm:max-w-xl bg-gray-900 text-white border-gray-700 p-6 rounded-xl shadow-2xl">
                <DialogHeader>
                    {/* Dynamic Title based on mode */}
                    <DialogTitle className="text-2xl font-bold text-primary-400">
                        {isEditMode ? "Edit Account Details" : "Create New Account"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Account Name */}
                    <div>
                        <div className="text-sm font-semibold mb-2 text-gray-300">Account Name</div>
                        <Input
                            id="account-name"
                            placeholder="e.g., Travel Fund, Business Checking"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            // Sleek dark input style
                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 p-3 rounded-lg focus:ring-2 focus:ring-primary-400"
                            disabled={isEditMode}
                        />
                        {isEditMode && (
                            <p className="text-xs text-red-400 mt-1">
                                Note: Account name cannot be changed in edit mode.
                            </p>
                        )}
                    </div>

                    {/* Starting Balance */}
                    <div>
                        <div className="text-sm font-semibold mb-2 text-gray-300">Starting Balance</div>
                        <Input
                            id="account-balance"
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            step="0.01"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            required
                            // Sleek dark input style
                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 p-3 rounded-lg focus:ring-2 focus:ring-primary-400"
                        />
                    </div>

                    {/* Grid for Currency and Icon */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Currency Selector */}
                        <div>
                            <div className="text-sm font-semibold mb-2 text-gray-300">Currency</div>
                            <Select onValueChange={setSelectedCurrency} value={selectedCurrency} required>
                                <SelectTrigger
                                    className='w-full bg-gray-800 border-gray-700 text-white p-3 rounded-lg h-auto'
                                >
                                    <SelectValue placeholder="Select Currency" />
                                </SelectTrigger>
                                <SelectContent className='w-full bg-gray-800 border-gray-700 text-white'>
                                    <SelectGroup>
                                        <SelectLabel className="text-primary-400">Available Currencies</SelectLabel>
                                        {currencyList.map((currency) => (
                                            <SelectItem key={currency.code} value={currency.code} className="hover:bg-gray-700 cursor-pointer">
                                                {currency.name} ({currency.code})
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Icon Selector */}
                        <div>
                            <div className="text-sm font-semibold mb-2 text-gray-300">Account Icon</div>
                            <Select onValueChange={(value) => setSelectedIcon(value)} value={selectedIcon}>
                                <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white p-3 rounded-lg h-auto">
                                    <div className="flex items-center gap-3">
                                        {/* Use the PascalCase name for the dynamic Icon component */}
                                        <Icon name={selectedIcon} className="w-5 h-5 text-primary-400" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className='w-full bg-gray-800 border-gray-700 text-white'>
                                    <SelectGroup>
                                        <SelectLabel className="text-primary-400">Choose Icon</SelectLabel>
                                        {accountIcons.map((item) => (
                                            <SelectItem key={item.value} value={item.value} className="hover:bg-gray-700 cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <Icon name={item.icon} className="w-5 h-5 text-gray-400" />
                                                    {/* {item.name} */}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <DialogFooter className="flex flex-col sm:flex-row sm:justify-between pt-6">
                        {/* Delete Button (Only in Edit Mode) */}
                        {isEditMode && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                    handleDelete(editDetails);
                                    onClose();
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold w-full sm:w-auto mb-3 sm:mb-0 order-2 sm:order-1 transition-all duration-200"
                            >
                                Delete Account
                            </Button>
                        )}

                        <div className={`flex space-x-3 ${isEditMode ? 'order-1 sm:order-2 ml-auto' : 'w-full justify-end'}`}>
                            {/* Cancel Button */}
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => onClose()}
                                className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold transition-all duration-200"
                            >
                                Cancel
                            </Button>

                            {/* Save Button (Primary) */}
                            <Button
                                style={{
                                    backgroundColor: palettes.primary[400],
                                    color: palettes.slate[100],
                                }}
                                type="submit"
                                className="bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-lg shadow-primary-500/30 transition-all duration-200"
                            >
                                {isEditMode ? "Update Account" : "Save Account"}
                            </Button>
                        </div>
                    </DialogFooter>
                    <div className="p-4 bg-gray-800 rounded-xl border border-primary-500/50 shadow-inner">
                        <h3 className="text-lg font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-2">Account Preview</h3>
                        <div className="flex items-center justify-between space-x-4">
                            {/* Icon and Name */}
                            <div className="flex items-center space-x-3 truncate">
                                <div className="p-3 rounded-full bg-primary-500/20 text-primary-400 flex-shrink-0">
                                    <Icon name={selectedIcon} className="w-6 h-6" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="text-xl font-bold text-white truncate">
                                        {name || 'Account Name'}
                                    </p>
                                </div>
                            </div>

                            {/* Balance and Currency */}
                            <div className="text-right flex-shrink-0">
                                <p className="text-xl font-extrabold text-green-400 md:text-2xl">
                                    {balance}
                                </p>
                                <p className="text-xs text-gray-500">{selectedCurrency || 'USD'}</p>
                            </div>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog >
    );
}