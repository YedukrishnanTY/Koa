import { Icon } from '@/lib/utils';
import React from 'react'

const AddAccountItem = ({ onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-center p-3 mt-2 rounded-lg transition-colors 
               border-2 border-dashed border-indigo-600/70 text-indigo-400 hover:bg-indigo-900/40 
               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
    >
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600/30 rounded-full">
                <Icon name="plus" className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="font-medium text-sm">
                Add New Account
            </span>
        </div>
    </button>
);

export default AddAccountItem