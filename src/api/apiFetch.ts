import axios from "axios";

const apiFetch = axios.create({
    baseURL: "http://192.168.1.100:8080",
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