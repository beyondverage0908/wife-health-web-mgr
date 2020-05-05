module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    extends: ['plugin:vue/essential', 'eslint-config-airbnb-base', 'plugin:prettier/recommended'],
    rules: {
        'prettier/prettier': 0, // 由于与eslint冲突，关闭。vscode的eslintIntegration属性不可用。
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'import/no-unresolved': 'off', // webpack别名报错
        'func-names': [2, 'as-needed'], // 要求或禁止使用命名的 function 表达式
        'import/no-extraneous-dependencies': 0,
        'vue/no-use-v-if-with-v-for': 0,
        'operator-linebreak': [2, 'before'], // 运算符换行时，运算符在前，与prettier冲突
        'curly': [2, 'all'], // if else等就算只有一行也要大括号包围
        'wrap-iife': [2, 'any'], // iife必须有括号包围
        'new-cap': 2, // new 调用的构造函数必须大写开头
        'eqeqeq': [2, 'smart'],
        'no-else-return': ['error', { allowElseIf: true }], // if return了不允许有后续代码块，elseif可以
        'no-extra-boolean-cast': 2, // 禁止不必要的布尔类型转换
        'radix': 2,
        'import/extensions': 0,
        'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],

        'eqeqeq': 0, // 要求使用 === 和 !==
        'no-underscore-dangle': 0, // 禁止标识符中有悬空下划线
        'no-nested-ternary': 0, // 禁用嵌套的三元表达式
        'consistent-return': 0, // 要求 return 语句要么总是指定返回的值，要么不指定
        'no-plusplus': 0, // 禁用一元操作符 ++ 和 --
        'no-shadow': 0, // 禁止变量声明与外层作用域的变量同名
        'no-param-reassign': [2, { props: false }], // 禁止对 function 的参数进行重新赋值
        'global-require': 0, // 要求 require() 出现在顶层模块作用域中
        'import/no-dynamic-require': 0,
        'guard-for-in': 0, // 要求 for-in 循环中有一个 if 语句
        'no-multi-assign': 0, // 禁止连续赋值
        'no-void': 0, // 禁用 void 操作符
        'no-restricted-properties': 0, // 禁止使用对象的某些属性
        'import/prefer-default-export': 0 // 单个导出用default
    },
    globals: {
        // 全局变量
        EMCaptcha: true,
        baseURL: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
};
