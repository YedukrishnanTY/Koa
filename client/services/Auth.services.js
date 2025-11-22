import { handleResponse } from "@/common/handleResponse";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const signup = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        // IMPORTANT: await this!
        const result = await handleResponse(response);
        return result;

    } catch (error) {
        throw error; 
    }
};
