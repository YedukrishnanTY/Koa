
import { getCurrencyList } from '@/services/Currency.services';
import Dashboard from '@/src/views/Dashboard'
import React from 'react'

export default async function Page() {
    let currencyList = [];

    try {
        currencyList = await getCurrencyList();
    } catch (error) {
        console.error('Error fetching currency list:', error);
    }
    return <Dashboard currencyList={currencyList} />;
}
