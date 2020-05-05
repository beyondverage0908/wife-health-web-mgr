<template>
    <div class="crud">
        <Row type="flex" justify="space-between" align="middle" class-name="header-actions">
            <Col :xs="24" :sm="24" :md="12">
                <Button v-if="hasAddBtn" type="primary" icon="md-add" @click="handleAdd"
                    >添加</Button
                >
                <Button
                    v-if="hasBatchDelBtn"
                    type="error"
                    icon="md-trash"
                    @click="handleBatchDelete"
                    >批量删除</Button
                >
                <Button
                    v-if="hasExportCsvBtn"
                    type="warning"
                    icon="md-download"
                    @click="handleExportCsv"
                    >导出csv</Button
                >
                <slot name="left-actions"></slot>
            </Col>
            <Col>
                <slot name="right-actions"></slot>
            </Col>
        </Row>
        <Table
            :data="data"
            :columns="columns"
            :loading="loading"
            v-bind="this.$attrs"
            ref="crud-table"
            v-on="tableListeners"
        >
            <template slot="row-actions" slot-scope="{ row }">
                <div class="row-actions">
                    <slot name="rewrite-row-actions" v-bind:row="row">
                        <Button
                            v-if="hasRowInfoBtn"
                            type="primary"
                            size="small"
                            @click="handleInfo(row)"
                            >详情</Button
                        >
                        <Button
                            v-if="hasRowEditBtn"
                            type="warning"
                            size="small"
                            @click="handleEdit(row)"
                            >编辑</Button
                        >
                        <Button
                            v-if="hasRowDelBtn"
                            type="error"
                            size="small"
                            @click="handleDelete(row)"
                            >删除</Button
                        >
                    </slot>
                    <slot name="append-row-actions" v-bind:row="row"></slot>
                </div>
            </template>
        </Table>
        <Row type="flex" justify="end" style="margin:15px 0;" v-if="pageConfig">
            <Page v-bind="pageConfig" v-on="pageListeners" />
        </Row>
        <EditModal ref="edit-modal">
            <slot name="form-items" v-bind:formData="formData"></slot>
        </EditModal>
    </div>
</template>

<script>
import CrudExpandRow from './table-expand-row';
import EditModal from './modal';
import { assignWithOutKeys, assignWithKeys } from './utils';

export default {
    name: 'crud',
    inheritAttrs: false, // 不继承属性
    components: {
        EditModal
    },
    props: {
        // ===============table props
        data: {
            type: Array,
            default: () => []
        },
        columns: {
            // 支持iview-table columns的所有参数
            type: Array,
            default: () => []
        },
        loading: {
            type: Boolean,
            default: false
        },
        // ==============table props end
        // 列会传入表单中，需要传入以下属性
        /**
         * {
         * label:string,
         * prop:string,// 对应的字段
         * type:text|datetime|select,
         * dicts:[] //type===select?
         * }
         * 如果type为select
         * 则需要传入对应的select字典
         * dicts:[
         * {
         *  label:string,
         *  value:string
         * }
         * ]
         */
        formColumns: {
            type: Array,
            default: () => []
        },
        formData: {
            // 当前正在添加或编辑的表单数据
            type: Object,
            default: () => ({})
        },
        rules: {
            type: Object,
            default: () => ({})
        },
        hasRowInfoBtn: {
            type: Boolean,
            default: true
        },
        hasRowDelBtn: {
            // 是否具有行内删除按钮
            type: Boolean,
            default: true
        },
        hasRowEditBtn: {
            // 是否具有行内编辑按钮
            type: Boolean,
            default: true
        },
        hasBatchDelBtn: {
            type: Boolean,
            default: true
        },
        hasAddBtn: {
            // 是否具有添加按钮
            type: Boolean,
            default: true
        },
        hasExportCsvBtn: {
            type: Boolean,
            default: true
        },
        exportCsvConfig: {
            type: Object,
            default() {
                return {};
            }
        },
        // 分页
        // 是否分页，有则必须配置pageConfig
        pageConfig: {
            // 配置分页信息
            type: Object
        },
        // 增加/编辑/删除,当提交请求时的处理函数，edit/delete传入当前row信息
        onCreateForm: Function,
        onUpdateForm: Function,
        onDeleteRow: Function,
        onBatchDelete: Function,
        rowActionsWidth: Number,
        rowActionsFixed: String // left|right
    },
    data() {
        return {
            parsedColumns: [],
            pageListeners: assignWithKeys(this.$listeners, ['on-change', 'on-page-size-change']),
            tableListeners: assignWithOutKeys(this.$listeners, ['on-change', 'on-page-size-change'])
        };
    },
    provide() {
        return {
            onCreateForm: this.onCreateForm,
            onUpdateForm: this.onUpdateForm,
            formData: this.formData,
            rules: this.rules,
            formColumns: this.formColumns,
            data: this.data,
            columns: this.columns
        };
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.initColumns();
        },
        initColumns() {
            const { columns } = this;
            if (!columns.find(item => item.slot === 'row-actions')) {
                const actionColumn = {
                    title: '操作',
                    slot: 'row-actions',
                    align: 'center',
                    width: this.rowActionsWidth || 150
                };
                if (this.rowActionsFixed) {
                    actionColumn.fixed = this.rowActionsFixed;
                }
                columns.push(actionColumn);
            }
            if (this.hasBatchDelBtn && !columns.find(item => item.type === 'selection')) {
                columns.unshift({
                    type: 'selection',
                    width: 50
                });
            }
            const expandColumnIdx = columns.findIndex(item => item.type === 'expand');
            if (expandColumnIdx > -1 && !columns[expandColumnIdx].render) {
                Object.assign(columns[expandColumnIdx], {
                    render: (h, { row }) =>
                        h(CrudExpandRow, {
                            props: {
                                row,
                                expandedColumns: columns[expandColumnIdx].expandedColumns,
                                colNum: columns[expandColumnIdx].colNum
                            }
                        })
                });
            }
            this.parsedColumns = columns;
        },
        handleInfo(row) {
            this.$refs['edit-modal'].openModal(row, true); // 第二个参数为是否只读
        },
        handleEdit(row) {
            this.$refs['edit-modal'].openModal(row);
        },
        handleAdd() {
            this.$refs['edit-modal'].openModal();
        },
        handleDelete(row) {
            this.$Modal.confirm({
                title: '警告',
                content: '确定删除该行数据吗？',
                onOk: () => {
                    this.onDeleteRow(row);
                }
            });
        },
        handleBatchDelete() {
            this.$Modal.confirm({
                title: '警告',
                content: '确定删除这些数据吗？',
                onOk: () => {
                    this.onBatchDelete();
                }
            });
        },
        handleExportCsv() {
            this.$refs['crud-table'].exportCsv(this.exportCsvConfig);
        }
    }
};
</script>

<style lang="less" scoped>
.crud {
    .row-actions {
        text-align: center;
        button {
            margin-right: 10px;
        }
    }
}
</style>
