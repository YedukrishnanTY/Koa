import { handleResponse } from "@/common/handleResponse";
import getHeaders from "../common/getHeaders";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAccountslist = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/account/details`, {
            method: 'GET',
            headers: getHeaders(),
            credentials: 'include',
        });
        const result = await handleResponse(response);
        return result;
    } catch (error) {
        console.error('Failed to fetch  list:', error);
        throw error;
    }
}

export const AddAccount = async (payload) => {
    try {
        const response = await fetch(`${API_BASE_URL}/account/create`, {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify(payload)
        });
        const result = await handleResponse(response);
        return result;
    } catch (error) {
        console.error('Failed to fetch  list:', error);
        throw error;
    }
}

export const EditAccount = async (payload) => {
    try {
        const response = await fetch(`${API_BASE_URL}/account/create`, {
            method: 'PUT',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify(payload)
        });
        const result = await handleResponse(response);
        return result;
    } catch (error) {
        console.error('Failed to fetch  list:', error);
        throw error;
    }
}

export const DeleteAccount = async (payload) => {
    try {
        const response = await fetch(`${API_BASE_URL}/account/create`, {
            method: 'DELETE',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify(payload)
        });
        const result = await handleResponse(response);
        return result;
    } catch (error) {
        console.error('Failed to fetch  list:', error);
        throw error;
    }
}
