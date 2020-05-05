### iview-admin

[iview4.0](https://www.iviewui.com/docs/guide/update)
[文档](https://lison16.github.io/iview-admin-doc/#/)

### 示例说明

编写 crud 管理时，在 view/todos 中为示例，是最简单的crud模板，可 copy 后加以修改,也可自行删除。

### 状态管理

> 在抽离状态前，先明确这个数据是否被多个组件使用。

> 组件间共享的除了状态，还有事件。如果某个事件被很多组件触发，也可以考虑抽离。

-   如果一个数据只被一个组件使用，那这个数据应该由该组件自行管理。
-   如果一个数据被多个组件共用，考虑将该数据进行状态提升，由父组件管理，用到该数据的组件以 prop 被动接收，如果子组件获取该数据只是纯渲染，就不需要做其他事；如果需要根据该数据改变来获取数据，可 watch 该数据来触发 getData。
-   如果一个数据或一组数据由多个组件共同使用或产生（如一个查询条件由多个组件构成/按步骤表单等），可以考虑引入 vuex 处理该数据。
-   如果组件嵌套多层，并且嵌套组件多次引用某数据，使用状态提升会重复传递数据，可以引入 vuex
-   对全局使用的数据，使用 vuex 管理
-   组件间通信，不复杂的情况可以考虑由父组件中转事件；复杂情况如多层嵌套可以通过[eventHub 方式](https://cn.vuejs.org/v2/guide/migration.html#dispatch-%E5%92%8C-broadcast-%E6%9B%BF%E6%8D%A2),[简单状态](https://cn.vuejs.org/v2/guide/state-management.html)，vuex 进行事件处理。

### 登陆状态

`src/libs/common-utils.js`中

-   用 getUserStatus（可获取用户信息和登陆态的接口）(/users/cur-user)判断登陆态和获取当前登陆用户的信息。

使用方法:

    1. main.js 中引用 js 中引用 initAppByStatus

2. 在 main.js 中调用

-   登陆状态保存在 store 中
    登陆状态是 store.state.user.hasLogged,一切对登陆态的判断都基于此。
    获取和设置登陆态的方法参考 store/user 中的 getUserStatus

    ```
    // 获取用户信息和状态
    async getUserStatus({ commit }, status) {
        // 直接设置登陆态
        if (status !== undefined) {
            commit('setHasLogged', status);
            return;
        }
        const { data } = await getUserStatus();
        if (data.success && data.data) {
            commit('setUserInfo', data.data);
            commit('setHasLogged', true);
            commit('setHasGetInfo', true);
            commit('setAccess', data.data.roles);
            return true;
        } else {
            commit('setHasGetInfo', false);
            commit('setUserInfo', {});
            commit('setAccess', []);
            commit('setHasLogged', false);
            return false;
        }
    }
    ```

### 验证码

在`buildconfig.js`中设置验证码插件地址，在`src/components/login-form`中使用

> 注:
>
> 1.如果用 ci/cd，建议使用 ci/cd 的相关配置来设置验证码地址(默认配置，在 public 下)；
>
> 2.也可以根据当前访问 host 判断环境，在 public/index.html 中替换 script 代码：
>
> ```js
> <script>
> 		var isProd = window.location.hostname === 'qhkhgl.eastmoney.com' || window.location.hostname ===
> 			'https://scrm.eastmoney.com'
> 		var captUrl = isProd ? "https://cfgpassport2.eastmoney.com/captcha/scripts/em_capt.js" :
> 			"https://cfgpassportuat2.eastmoney.com/captcha/scripts/em_capt.js"
> 		document.write("<script src=" + captUrl + "><\/script>")
> 	</script>
> ```

-   使用

    目前模板中`src/components/login-form`默认启用。注意标记 TODO 注释的地方。

-   不使用

    1. 将以下内容注释

        ```
         <!-- 验证码相关 -->
                <input type="hidden" id="contextId" />
                <input type="hidden" id="accountIdHide" value="admin" />
                <div id="containerId" style="border:1px solid #d7dde4;width:100%;height:46px;margin-bottom:10px;"></div>
                <!-- end -->

        ```

    2. 去除 mounted 时的操作

    3. 修改 handleSubmit 中的相关信息
       主要是提交登陆接口时传入的参数

### 更新日志

修改根目录下 CHANGELOG.md。修改版本号时也可以同时修改 package.json 中的 version。

### 系统部署环境显示

在顶部栏显示系统的当前部署环境，开发，测试，生产环境等。

注意使用的环境字段。在 src/components/main/components/env 中修改

```
computed: {
        activeEnv() {
            return this.$store.state.app.env;
        }
    },
```

### appContainer

> 当在.vue 文件外使用 router 和根 vue 实例时，从 appContainer 中取得

-   为什么这样？
    如果从服务端取得权限路由再 addRoutes 到已有 router，当退出登陆后已有的路由不会清除，需要重新 initApp，createRouter。
    每次 initApp 时得到的是一个新的 router 对象和 vue 实例，为了能获取到准确的对象，使用 appContainer 包装

### axios 拦截

-   当 success!==true 时提示 message 错误信息（业务逻辑中可以不再手动提示）

-   get 请求默认加入时间戳,禁用缓存

-   当 code==='10000'时表示未登录，跳转登陆，不提示

    ```js
    if (data.code === '10000') {
        // 是否是获取用户信息/状态的接口 如果是，则10000表示未登录，无需退出
        const isGetInfo = ~res.config.url.indexOf('users/cur-user');
        if (!isGetInfo) {
            store.dispatch('handleLogOut');
        }
    }
    ```

### mock

在 mock 文件夹中进行 mock

### 配置项

在原有 config/index.js 中添加了 2 个字段.根据实际情况启用

不启用权限管理，则 routes 为所有路由（如果觉得判断冗余，可以检查 usePermission 字段的使用地方，进行删改）

如果启用权限管理，也必须配置管理员可见路由,此时系统管理模块不受服务端返回数据影响：

> 1. 当前用户非管理员-分配系统管理权限=》不显示系统管理
> 2. 当前用户是管理员-不管是否分配系统管理权限=》显示系统管理
>    管理员判断规则：当前登陆用户的 roles 中是否有 A。可以在 router/index 中进行修改 judgeAdmin 函数。

```jsons
    /**
     * @description 是否启用权限管理
     */
    usePermission: true,
    /**
     * @description 只有管理员可见的路由，usePermission时才有用，并且需要在router/index中设置判断管理员的条件
     */
    adminRoutes: ['system', 'users-mgr', 'roles-mgr', 'configs-mgr']
```

### modal 中表单清除验证状态

> 有时关闭 modal 时出现上次的校验结果遗留的问题

1. 在 Form 组件的 resetFields 方法有效的情况下使用该方法清除数据即可（只清除 form 绑定的数据，其余数据需手动清除）
2. 在 Form 上加入 key，关闭时手动清除数据并更新 key，强制更新 form(如果存在多个表单需要维护多个 key)。
3. 参考\\172.31.231.22\Share\Team\技术三组\03 技术预研 中的弹窗数据清除方案。
4. 不用 iview 的 Form 组件，改用 elementui（或其他表单组件），调用 clearValidate 方法单独清除验证。

### 其他

有 TODO 开头的注释表示下面的内容可能需要修改
