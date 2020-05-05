
### (2020-1-3) 0.0.5
- 删除角色管理里无效代码
### (2019-12-23) 0.0.4
- 更新eslint，同步h5，对违反规则的：iview-admin本身的则disable-eslint，业务代码按规则修复
- package.json 添加prettier命令，对src下的.vue .js批量格式化
- 删除components下的不常用的组件，如果有需要可以在iview-admin文档实例中查看再手动引入

### (2019-12-18) 0.0.3
- 更新eslint和prettier，同步h5配置，对冲突的规则先禁用，后续项目中逐步修改

### (2019-11-26) 0.0.2
- refactor: src/*.vue所有的visible/loading等bool类型字段，改成isXXX形式
- refactor: 重构roles-mgr角色管理，减少耦合性
- fix: 修复设置selectRole=null的后获取数据问题
- refactor:selectRole改成selectRoleId

### (2019-11-22) 0.0.1
- refactor: 所有的visible/loading等bool类型字段，改成isXXX形式
- comments: 添加部分方法注释
- style: 修改eslint配置
