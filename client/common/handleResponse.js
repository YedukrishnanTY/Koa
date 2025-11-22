
// 🔑 COMMON RESPONSE HANDLING FUNCTION
/**
 * Processes the fetch Response object to handle success and error cases.
 * @param {Response} response - The response object returned by fetch.
 */
export async function handleResponse(response,) {
    if (response.ok) {
        // Successful response (200-299 status code)
        try {
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Success but JSON parsing failed:', error);
            throw new ({ message: 'Registration Successful (No JSON body returned).' });
        }
    } else {
        // Error response (e.g., 4xx, 5xx)
        let errorData = {};

        try {
            errorData = await response.json();
        } catch (e) {
            errorData = {
                message: `Server error with status: ${response.status}`,
                details: response.statusText,
            };
        }

        const error = new Error(errorData.message || "Unknown error");
        error.data = errorData;  // attach full error payload
        error.status = response.status;
        throw error;
    }
}
// ---