export default defineNuxtRouteMiddleware((to, from) => {
    const { status, data:userInfo } = useAuth(); // Access the authentication composable

    const publicRoutes = ['/login', '/login/otp-verify', '/login/forgot-password'];
    const pathMapping = [
        {
            name: 'customer',
            path: ['/me','/hr']
        },
        {
            name: 'crm',
            path: ['/contacts','/customers']
        },
        {
            name: 'hrm',
            path: ['/works','/schedules']
        },
        {
            name: 'company',
            path: ['/groups','/departments']
        }
    ]
    
    if (status.value !== 'authenticated') {
        // Allow access to public routes for unauthenticated users
        if (publicRoutes.includes(to.path)) {
            return;
        }
        // Redirect unauthenticated users to /login
        return navigateTo('/login');
    }
    let userinfo = userInfo.value
    if (!userinfo){
        return navigateTo('/login');
    }
    let department = userinfo.profile_hr.department
    if (!department){
        return navigateTo('/login');
    }
    let resource = department.group?.resources || [];
    let role = userinfo.profile_hr.role
    const resourceNames = resource.map((item: { code: string }) => item.code);
    if (role !=='A'){
        for (const mapping of pathMapping) {
            if (mapping.path.some(p => to.path.startsWith(p))) {
                if (!resourceNames.includes(mapping.name)) {
                    return navigateTo('/me');
                }
            }
        }
    }

    // Redirect authenticated users away from public routes to /hrm/me
    if (publicRoutes.includes(to.path)) {
        return navigateTo('/me');
    }
});