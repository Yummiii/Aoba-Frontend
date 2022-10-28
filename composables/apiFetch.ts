import { UseFetchOptions } from "nuxt/dist/app/composables";

export const apiFetch = async (url: string, options: UseFetchOptions<ResponseType> = {}) => {
    options.baseURL = "http://192.168.1.100:8080";
    if (process.client && localStorage.getItem("token")) {
        options.headers = {
            ...options.headers,
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    } 
    return await $fetch(url, options);
};
