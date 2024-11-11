export const fetchAPI = async (url: string, options?: RequestInit) => {
    try {
        const res = await fetch(url, { credentials: "include", ...options });
        const response = await res.json();
        if (!res.ok) {
            throw { ...response, status: res.status };
        }

        return response;
    } catch (error) {
        throw error;
    }
};
