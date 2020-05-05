import Main from '@/components/main';

const systemRoutes = [
    {
        path: '/system',
        name: 'system',
        component: Main,
        meta: {
            title: '系统管理',
            icon: 'md-cog',
            showAlways: true
        },
        children: [
            {
                path: 'users-mgr',
                meta: {
                    title: '用户管理',
                    icon: 'ios-people'
                },
                name: 'users-mgr',
                component: () => import('@/view/system/users-mgr/index.vue')
            },
            {
                path: 'roles-mgr',
                meta: {
                    title: '角色管理',
                    icon: 'ios-person'
                },
                name: 'roles-mgr',
                component: () => import('@/view/system/roles-mgr/index.vue')
            },
            {
                path: 'configs-mgr',
                name: 'configs-mgr',
                meta: {
                    title: '系统配置管理',
                    icon: 'md-cog'
                },
                component: () => import('@/view/system/configs-mgr/index.vue')
            }
        ]
    }
];
export default systemRoutes;
