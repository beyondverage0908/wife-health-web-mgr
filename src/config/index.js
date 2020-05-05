export default {
    /**
     * @description 配置显示在浏览器标签的title
     */
    title: 'iView-admin',
    /**
     * @description token在Cookie中存储的天数，默认1天
     */
    cookieExpires: 1,
    /**
     * @description 是否使用国际化，默认为false
     *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
     *              用来在菜单中显示文字
     */
    useI18n: false,
    /**
     * @description api请求基础路径
     */
    baseUrl: {
        dev: '/v1/api',
        pro: '/v1/api'
    },
    /**
     * @description 默认打开的首页的路由name值，默认为home
     */
    homeName: 'home',
    /**
     * @description 需要加载的插件
     */
    plugin: {
        // 使用插件方法：在plugin目录下建同名文件夹，并在此书写配置信息已决定何时启用等
        // 'error-store': {
        //     showInHeader: false, // 设为false后不会在顶部显示错误日志徽标
        //     developmentOff: false // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
        // }
    },
    /**
     * @description 是否启用权限管理
     */
    usePermission: false,
    /**
     * @description 只有管理员可见的路由，usePermission时才有用，并且需要在router/index中设置判断管理员的条件，目前根据roles中是否有A
     */
    adminRoutes: ['system', 'users-mgr', 'roles-mgr', 'configs-mgr']
};
