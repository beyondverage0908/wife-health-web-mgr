import Main from '@/components/main';

const todosRoutes = [
    {
        path: '/指标管理',
        name: 'quota',
        // redirect: '/todos/list',
        meta: {
            title: '指标列表',
            icon: 'md-albums',
            showAlways: true
        },
        component: Main,
        children: [
            {
                path: '/quota/list',
                name: 'quota-list',
                meta: {
                    title: '指标一览表',
                    icon: 'md-albums'
                },
                component: () => import('@/view/quota/index.vue')
            }
        ]
    }
];

export default todosRoutes;
