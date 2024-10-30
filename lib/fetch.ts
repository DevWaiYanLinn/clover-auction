export const fetchAPI = async (url: string, options?: RequestInit) => {
    try {
        const res = await fetch(url, options);
        if (res.ok) {
            return await res.json();
        }
        throw new Error(`HTTP ERROR with status ${res.status}`);
    } catch (error) {
        console.error(error);
        throw Error(`${error}`);
    }
};
