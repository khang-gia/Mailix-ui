export default defineNuxtRouteMiddleware((to, from) => {
    const { status, data:userInfo } = useAuth(); // Access the authentication composable

    const publicRoutes = ['/login', '/login/otp-verify', '/login/forgot-password','/change-password'];
    const authRedirectRoutes = ['/login', '/login/otp-verify', '/login/forgot-password'];
    const pathMapping = [
        {
            name: 'hrm',
            path: ['/hr','/dashboard-hrm']
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
        },
        {
            name: 'guide_mail',
            path: ['/guide-mail']
        },
        {
            name: 'guide_app',
            path: ['/guide-app']
        },
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

    let userinfo = userInfo.value;
    console.log('userinfo', userinfo);

    // If authenticated but missing userinfo somehow
    if (!userinfo) {
        console.log('Missing core user info');
        if (!authRedirectRoutes.includes(to.path)) {
            return navigateTo('/login');
        }
        return; // Already on login or a public auth route, stay there
    }

    console.log('User Info:', userinfo.is_superuser);
    if (userinfo.is_superuser) {
        console.log('Superuser access granted');
        // Redirect superusers away from public routes to /social
        if (publicRoutes.includes(to.path)) {
            return navigateTo('/social');
        }
        return; 
    }

    // Normal users must have a profile and department
    if (!userinfo.profile_hr || !userinfo.profile_hr.department) {
        console.log('Missing HR profile or department');
        if (!authRedirectRoutes.includes(to.path)) {
            return navigateTo('/login');
        }
        return;
    }

    let role = userinfo.profile_hr.role;
    let department = userinfo.profile_hr.department;

    if (userinfo.profile_hr.is_first_login) {
        if (to.path !== '/change-password') {
            console.log('First login detected. Forcing redirect to /change-password.');
            return navigateTo('/change-password');
        }
        return;
    }

    let resource = department.resources || department.group?.resources || [];
    const resourceNames = resource.map((item: { code: string }) => item.code);
    
    // Determine the user's default safe dashboard based on permissions
    let defaultDashboard = '/social';
    if (role !== 'A') {
        const fallbackPaths: Record<string, string> = {
            'workspace':  '/social',
            'hrm':        '/hr',
            'crm':        '/contacts',
            'company':    '/groups',
            'guide_mail': '/guide-mail',
            'guide_app':  '/guide-app',
        };
        const firstAllowed = resourceNames.find((name: string) => fallbackPaths[name]);
        if (firstAllowed) {
            defaultDashboard = fallbackPaths[firstAllowed];
        } else {
            defaultDashboard = '/login'; // No valid permissions found
        }
    }
    
    if (role !== 'A') {
        for (const mapping of pathMapping) {
            if (mapping.path.some(p => to.path.startsWith(p))) {
                if (!resourceNames.includes(mapping.name)) {
                    console.warn(`Access denied to resource: ${mapping.name}. Redirecting to safe dashboard.`);
                    if (to.path !== defaultDashboard) {
                        return navigateTo(defaultDashboard);
                    }
                    // Failsafe: if they are somehow failing their own default dashboard, log them out
                    return navigateTo('/login');
                }
            }
        }
    }

    // Redirect authenticated users away from public routes to their allowed dashboard
    if (publicRoutes.includes(to.path)) {
        if (defaultDashboard !== '/login') {
            return navigateTo(defaultDashboard);
        }
    }
});