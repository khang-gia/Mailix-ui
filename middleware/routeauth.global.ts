export default defineNuxtRouteMiddleware((to, from) => {
    const { status, data:userInfo } = useAuth(); // Access the authentication composable

    const publicRoutes = ['/login', '/login/otp-verify', '/login/forgot-password','/change-password'];
    const authRedirectRoutes = ['/login', '/login/otp-verify', '/login/forgot-password'];
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
    console.log('Navigating to:', to.path);
    console.log('Authentication status:', status.value);
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