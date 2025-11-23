import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { palettes } from "@/common/palettes";
import { Icon } from "@/lib/utils";


export default function AddModal({ isOpen, onClose, onSave, currencyList, profile, editDetails }) {
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
            setSelectedIcon(editDetails?.icon || '')
        }
    }, [editDetails])
    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create New Account</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <label className="block">
                        <div className="text-sm font-medium mb-1">Account Name</div>
                        <Input
                            id="account-name"
                            placeholder="e.g., Travel Fund, Business Checking"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ background: palettes.dark[800], color: palettes.light[50] }}
                            disabled={editDetails?._id}
                        />
                    </label>

                    <label className="block">
                        <div className="text-sm font-medium mb-1">Starting Balance</div>
                        <Input
                            id="account-balance"
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            step="0.01"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            required
                            style={{ background: palettes.dark[800], color: palettes.light[50] }}
                        />
                    </label>

                    <div className='w-full mb-6'>
                        <Select onValueChange={setSelectedCurrency} value={selectedCurrency} required>
                            <SelectTrigger
                                className='w-full p-5 rounded-sm'
                                style={{ background: palettes.dark[800], color: palettes.light[50] }}>
                                <SelectValue placeholder="Select Currency" />
                            </SelectTrigger>
                            <SelectContent className='w-full'>
                                <SelectGroup>
                                    <SelectLabel>Currency</SelectLabel>
                                    {currencyList.map((currency) => (
                                        <SelectItem key={currency.code} value={currency.code}>
                                            {currency.name} ({currency.code})
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='w-full mb-6'>

                        <div className="text-sm font-medium mb-1">Icon</div>
                        <Select onValueChange={setSelectedIcon} value={selectedIcon}  >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Icon" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Icons</SelectLabel>
                                    {accountIcons.map((item) => (
                                        <SelectItem key={item.value} value={item.value} >
                                            <div className="flex items-center gap-2">
                                                <Icon name={item.icon} className="w-30 h-30" />
                                                {/* {item.name} */}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => onClose()}>
                            Cancel
                        </Button>
                        <Button type="submit">Save Account</Button>
                    </div>
                </form>

                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
}
