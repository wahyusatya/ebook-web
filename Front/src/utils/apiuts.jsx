const BASE_URL = "http://127.0.0.1:5000";

export const loadImage = (image_path) => {
    return BASE_URL + "/public" + image_path;
};

export const getDataUTS = async (url, headers = {}) => {
    // Check if URL is already full URL or just endpoint
    const fullUrl = url.startsWith('http') ? url : BASE_URL + url;
    
    console.log("GET Request to:", fullUrl);
    console.log("Headers:", headers);
    
    return fetch(fullUrl, { headers })
        .then(async (response) => {
            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers);
            
            if (response.status === 401) {
                return { isExpiredJWT: true };
            }

            // For 204 No Content, return a success object
            if (response.status === 204) {
                return { success: true, message: 'No Content' };
            }

            // For successful responses (200-299), parse JSON
            if (response.status >= 200 && response.status <= 299) {
                try {
                    const data = await response.json();
                    console.log("Parsed JSON data:", data);
                    return data;
                } catch (e) {
                    console.error("Failed to parse JSON for successful response:", e);
                    return { error: "Failed to parse server response" };
                }
            }

            // For error responses, try to parse JSON for error message
            try {
                const errorData = await response.json();
                console.log("Error response data:", errorData);
                return { error: errorData.message || `API Error: ${response.status} ${response.statusText}` };
            } catch (e) {
                console.error("Failed to parse JSON for error response:", e);
                return { error: `API Error: ${response.status} ${response.statusText}` };
            }
        })
        .catch((err) => {
            console.error("Network error in getDataUTS:", err);
            return { error: `Network Error: ${err.message}` };
        });
};

export const sendDataUTS = async (url, data, isJson = false, headers = {}, method = "POST") => {
    const options = {
        method: method,
        headers: headers,
    };

    if (isJson) {
        options.headers = {
            ...options.headers,
            'Content-Type': 'application/json',
        };
        options.body = JSON.stringify(data);
    } else if (data) {
        options.body = data;
    }

    // Check if URL is already full URL or just endpoint
    const fullUrl = url.startsWith('http') ? url : BASE_URL + url;
    console.log("Fetching URL:", fullUrl);
    
    return fetch(fullUrl, options)
        .then(async (response) => {
            if (response.status === 401) {
                return { isExpiredJWT: true };
            }

            // For 204 No Content, return a success object without trying to parse JSON
            if (response.status === 204) {
                return { success: true, message: 'No Content' };
            }

            // For other successful responses (200-299), parse JSON
            if (response.status >= 200 && response.status <= 299) {
                try {
                    return await response.json();
                } catch (e) {
                    // If JSON parsing fails for a 2xx response, return a generic success
                    console.error("Failed to parse JSON for 2xx response:", e);
                    return { success: true, message: 'Operation successful, but response not JSON.' };
                }
            }

            // For error responses (e.g., 400, 500), try to parse JSON for error message
            try {
                const errorData = await response.json();
                return { error: errorData.message || `API Error: ${response.status} ${response.statusText}` };
            } catch (e) {
                // If JSON parsing fails for an error response, return a generic error
                console.error("Failed to parse JSON for error response:", e);
                return { error: `API Error: ${response.status} ${response.statusText}` };
            }
        })
        .then((data) => data)
        .catch((err) => {
            console.error("Network or unexpected error in sendDataUTS:", err);
            return { error: `Network Error: ${err.message}` };
        });
};

export const deleteDataUTS = async (url, data, headers = {}) => {
    // Check if URL is already full URL or just endpoint
    const fullUrl = url.startsWith('http') ? url : BASE_URL + url;
    
    return fetch(fullUrl, {
        method: "DELETE",
        body: data,
        headers: headers,
    })
        .then(async (response) => {
            if (response.status === 401) {
                return { isExpiredJWT: true };
            }

            // For 204 No Content, return a success object
            if (response.status === 204) {
                return { success: true, message: 'Deleted successfully' };
            }

            // For successful responses (200-299), parse JSON
            if (response.status >= 200 && response.status <= 299) {
                try {
                    return await response.json();
                } catch (e) {
                    console.error("Failed to parse JSON for successful delete response:", e);
                    return { success: true, message: 'Delete successful, but response not JSON.' };
                }
            }

            // For error responses, try to parse JSON for error message
            try {
                const errorData = await response.json();
                return { error: errorData.message || `API Error: ${response.status} ${response.statusText}` };
            } catch (e) {
                console.error("Failed to parse JSON for error response:", e);
                return { error: `API Error: ${response.status} ${response.statusText}` };
            }
        })
        .catch((err) => {
            console.error("Network error in deleteDataUTS:", err);
            return { error: `Network Error: ${err.message}` };
        });
};