<template>
    <div class="privs" v-loading="isPrivLoading">
        <div v-if="allPrivsTreeData.length > 0">
            <header>
                <div class="actions">
                    <Button type="primary" @click="handleSavePrivs">保存</Button>
                    <Button @click="initPrivsSelect" style="margin-left:10px">重置</Button>
                </div>
            </header>
            <div class="tree-select-header">
                <span>权限名称</span>
                <span>权限编码</span>
            </div>
            <treeselect
                :multiple="true"
                :options="allPrivsTreeData"
                value-consists-of="ALL_WITH_INDETERMINATE"
                v-model="selectedPrivIds"
                :defaultExpandLevel="Infinity"
                alwaysOpen
                placeholder="选择权限"
                noOptionsText="没有可选权限"
            >
                <label slot="option-label" slot-scope="{ node }" class="option-label">
                    <div class="label-title">
                        <Icon
                            type="ios-folder"
                            v-if="node.children"
                            color="#2d8cf0"
                            style="margin-right:5px;"
                        />
                        <Icon type="ios-leaf" v-else color="#19be6b" style="margin-right:5px;" />
                        <span class="label">{{ node.label }}</span>
                    </div>
                    <span class="item"
                        ><Icon type="md-code-working" color="#19be6b" style="margin-right:5px;" />{{
                            node.raw.privCode
                        }}</span
                    >
                </label>
            </treeselect>
        </div>
        <div v-else style="text-align:center;margin-top:50px;font-size:20px;"></div>
    </div>
</template>
<script>
import { addRolePrivs, getRolePrivs } from '@/api/roles';
import { getPrivs } from '@/api/privs';
import { parsePrivsToTreeDataWithChecked } from '@/libs/tools';

export default {
    data() {
        return {
            selectedPrivIds: [], // 选中的权限
            isPrivLoading: false,
            rolePrivs: [], // 角色的权限
            allPrivsTreeData: [], // 根据角色权限选中全部权限中的部分
            selectRoleId: null // 当前选中角色id
        };
    },
    methods: {
        async getData() {
            Object.assign(this, {
                selectedPrivIds: [],
                allPrivsTreeData: [],
                rolePrivs: []
            });
            await this.getPrivsData();
        },
        async changeRole(selectRoleId) {
            this.selectRoleId = selectRoleId;
            await this.getData();
        },
        async getPrivsData() {
            if (this.selectRoleId) {
                try {
                    this.isPrivLoading = true;
                    const { data } = await getRolePrivs(this.selectRoleId);
                    const { data: allPrivsData } = await getPrivs();
                    if (data.success && data.data && allPrivsData.success && allPrivsData.data) {
                        const rolePrivs = data.data; // 角色的权限
                        const allPrivs = allPrivsData.data; // 全部的权限
                        this.rolePrivs = rolePrivs;
                        const allPrivsTreeData = parsePrivsToTreeDataWithChecked(
                            allPrivs,
                            rolePrivs,
                            0
                        );
                        const adminRouteIndex = allPrivsTreeData.findIndex(
                            item => item.privCode === 'system'
                        );
                        this.allPrivsTreeData = allPrivsTreeData.filter(
                            (_, index) => index !== adminRouteIndex
                        ); // 取消综合管理的权限分配
                        this.initPrivsSelect(); // 初始化选中权限的值
                    }
                } finally {
                    this.isPrivLoading = false;
                }
            } else {
                Object.assign(this, {
                    selectedPrivIds: [],
                    allPrivsTreeData: [],
                    rolePrivs: []
                });
            }
        },
        initPrivsSelect() {
            const selectedIds = this.rolePrivs
                .map(item => item && item.privId)
                .filter(item => !!item);
            this.selectedPrivIds = selectedIds;
        },
        handlePageChange(page) {
            if (this.page === page) {
                return;
            }
            this.getUsers({ page });
        },
        handlePageSizeChange(pageSize) {
            this.getUsers({ page: 1, pageSize });
        },
        handleSelectionChange(val) {
            this.selectedPrivIds = val.map(item => item.privId);
        },
        async handleSavePrivs() {
            const { data } = await addRolePrivs({
                roleId: this.selectRoleId,
                privIds: this.selectedPrivIds
            });
            if (data.success && data.data) {
                this.$Message.success('保存成功');
                this.getPrivsData();
            }
        }
    }
};
</script>

<style lang="less" socped>
.privs {
    max-width: 1100px;
    .vue-treeselect__control {
        display: none;
    }
    .vue-treeselect {
        position: static;
    }
    .vue-treeselect__label-container {
        table-layout: auto;
    }
    .vue-treeselect__option {
        table-layout: auto;
    }
    .vue-treeselect__menu-container {
        position: static;
        box-sizing: border-box;
    }
    .vue-treeselect__menu {
        max-height: 5000px !important;
        position: static;
        box-sizing: border-box;
    }
}
.option-label {
    font-size: 12px;
    line-height: 25px;
    display: flex;
    align-items: center;
    padding: 5px 0;
    width: 100%;
    .label-title {
        // min-width: 200px;
        flex: 1;
        box-sizing: border-box;
        padding-left: 10px;
        display: block;
    }
    .item {
        flex: 1;
        text-align: left;
        box-sizing: border-box;
        padding: 0 20px;
        display: block;
    }
}
.tree-select-header {
    display: flex;
    border: 1px solid #ccc;
    border-bottom: none;
    padding: 5px 0 5px 60px;
    font-size: 14px;
    margin-top: 15px;
    span {
        flex: 1;
        display: block;
    }
}
</style>
