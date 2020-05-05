<template>
    <Modal title="拥有权限" width="700" v-model="isVisible" @on-cancel="hide" footer-hide>
        <div class="user-privs" v-loading="isLoading">
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
            <div class="mask"></div>
        </div>
    </Modal>
</template>
<script>
import { getPrivs } from '@/api/privs';
import { getUserPrivs } from '@/api/user';
import { parsePrivsToTreeDataWithChecked } from '@/libs/tools';

export default {
    data() {
        return {
            allPrivsTreeData: [],
            selectedPrivIds: [],
            allPrivs: [], // 所有的权限数据
            isVisible: false,
            userId: '',
            isLoading: false
        };
    },

    methods: {
        show(row) {
            this.isVisible = true;
            this.userId = row.userId;
            this.getUserPrivs();
        },
        hide() {
            this.selectedPrivIds = [];
            this.userId = '';
            this.isVisible = false;
        },
        async getAllPrivs() {
            const { data } = await getPrivs();
            if (data.success && data.data) {
                this.allPrivs = data.data;
            }
        },
        async getUserPrivs() {
            try {
                this.isLoading = true;
                await this.getAllPrivs();
                const { data } = await getUserPrivs(this.userId);
                if (data.success) {
                    const privs = data.data;
                    const allPrivsTreeData = parsePrivsToTreeDataWithChecked(
                        this.allPrivs,
                        privs,
                        0
                    );
                    const adminRouteIndex = allPrivsTreeData.findIndex(
                        item => item.privCode === 'system'
                    ); // 注意这里的privCode应该和你定义的只能由管理员看到的权限保持一致
                    this.allPrivsTreeData = allPrivsTreeData.filter(
                        (_, index) => index !== adminRouteIndex
                    ); // 取消综合管理的权限分配
                    const selectedIds = privs
                        .map(item => item && item.privId)
                        .filter(item => !!item);
                    this.selectedPrivIds = selectedIds;
                }
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>

<style lang="less">
.user-privs {
    max-width: 700px;
    position: relative;
    .mask {
        position: absolute;
        z-index: 99;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
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
