import axios from "axios";

const apiFetch = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

apiFetch.interceptors.request.use((config) => {
    if (localStorage.getItem("token")) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
    }
    return config;
});

export default apiFetch;