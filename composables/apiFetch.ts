import { UseFetchOptions } from "nuxt/dist/app/composables";

export const apiFetch = async (url: string, options: UseFetchOptions<ResponseType>) => {
    options.baseURL = "http://127.0.0.1:8080"
    return await $fetch(url, options);
};
