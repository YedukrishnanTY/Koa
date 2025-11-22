import React from 'react'
import { getCurrencyList } from '@/services/Currency.services';
import Register from '@/src/views/Register';

export default async function Page() {
  let currencyList = [];

  try {
    currencyList = await getCurrencyList();
  } catch (error) {
    console.error('Error fetching currency list:', error);
  }

  return <Register currencyList={currencyList} />;
}
