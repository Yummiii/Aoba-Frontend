export default defineNuxtRouteMiddleware((to, from) => {
    if (process.client && !localStorage.getItem("token")) {
        return navigateTo("/login");
    }
});
