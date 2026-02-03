export default defineNuxtRouteMiddleware((to, from) => {
    const { status, data:userInfo } = useAuth(); // Access the authentication composable

    const publicRoutes = ['/login', '/login/otp-verify', '/login/forgot-password','/change-password'];
    const authRedirectRoutes = ['/login', '/login/otp-verify', '/login/forgot-password'];
    const pathMapping = [
        {
            name: 'customer',
            path: ['/me','/hr','/dashboard-hrm']
        },
        {
            name: 'crm',
            path: ['/contacts','/customers']
        },
        {
            name: 'workspace',
            path: ['/works','/schedules','/social','/dashboard-work']
        },
        {
            name: 'company',
            path: ['/groups','/departments']
        }
    ]
    console.log('Navigating to:', to.path);
    console.log('Authentication status:', status.value);
    
    // Handle root path and unmatched routes - redirect to /social
    // This prevents 500 errors when users navigate to /hrm/ or invalid URLs
    if (to.path === '/' || to.matched.length === 0) {
        console.log('Root path or unmatched route detected, redirecting to /social');
        return navigateTo('/social');
    }
    
    if (status.value !== 'authenticated') {
        // Allow access to public routes for unauthenticated users
        if (authRedirectRoutes.includes(to.path)) {
            return;
        }
        // Redirect unauthenticated users to /login
        console.log('not authen')
        return navigateTo('/login');
    }
    let userinfo = userInfo.value
    console.log('userinfo',userinfo)
    if (!userinfo){
        console.log('not userinfo')
        return navigateTo('/login');
    }
    console.log('User Info:', userinfo.is_superuser);
    if (userinfo.is_superuser){
        console.log('Superuser access granted');
        return; 
    }
    else if (!userinfo.profile_hr){
        console.log('not profile hr')
        return navigateTo('/login');
    }
    let role = userinfo.profile_hr.role 
    let department = userinfo.profile_hr.department
    if (!department){
        console.log('not department')
        return navigateTo('/login');
    }
    if (userInfo.value.profile_hr.is_first_login) {
        if (status.value === 'authenticated'){
            if (to.path !== '/change-password') {
                console.log('First login detected. Forcing redirect to /change-password.');
                return navigateTo('/change-password');
            }
            return;
        }
        return;
    }
    let resource = department.group?.resources || [];
    
    const resourceNames = resource.map((item: { code: string }) => item.code);
    if (role !=='A'){
        for (const mapping of pathMapping) {
            if (mapping.path.some(p => to.path.startsWith(p))) {
                if (!resourceNames.includes(mapping.name)) {
                    return navigateTo('/social');
                }
            }
        }
    }

    // Redirect authenticated users away from public routes to /social
    if (publicRoutes.includes(to.path)) {
        return navigateTo('/social');
    }

    // Catch-all: if route doesn't exist (like /hrm/ without a valid page), redirect to /social
    // This prevents 500 errors when users navigate to invalid routes
    if (to.matched.length === 0) {
        console.log('Invalid route detected, redirecting to /social');
        return navigateTo('/social');
    }
});