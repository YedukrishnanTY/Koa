import { handleResponse } from "@/common/handleResponse";
import getHeaders from "../common/getHeaders";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getExpenseAll = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/expense/all`, {
            method: 'GET',
            headers: getHeaders(),
            credentials: 'include',
        });
        const result = await handleResponse(response);
        return result;
    } catch (error) {
        console.error('Failed to fetch', error);
        throw error;
    }
}

export const createExpenseOrIncome = async (payload) => {
    try {
        const response = await fetch(`${API_BASE_URL}/expense/create`, {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify(payload)
        });
        const result = await handleResponse(response);
        return result;
    } catch (error) {
        console.error('Failed to fetch', error);
        throw error;
    }
}
