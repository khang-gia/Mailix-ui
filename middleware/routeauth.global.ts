export default defineNuxtRouteMiddleware((to, from) => {
    const { status } = useAuth(); // Access the authentication composable
    console.log('status.value', status);

    const publicRoutes = ['/login', '/login/otp-verify', '/login/forgot-password'];

    if (status.value !== 'authenticated') {
        // Allow access to public routes for unauthenticated users
        if (publicRoutes.includes(to.path)) {
            return;
        }
        // Redirect unauthenticated users to /login
        return navigateTo('/login');
    }

    // Redirect authenticated users away from public routes to /hrm/me
    if (publicRoutes.includes(to.path)) {
        return navigateTo('/me');
    }
});