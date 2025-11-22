import { handleResponse } from "@/common/handleResponse";
import getHeaders from "../common/getHeaders";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCurrencyList = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/currencies`, {
            method: 'GET',
            headers: getHeaders(),
            credentials: 'include',
        });
        const result = handleResponse(response);
        return result;
    } catch (error) {
        console.error('Failed to fetch currency list:', error);
        throw error;
    }
}
