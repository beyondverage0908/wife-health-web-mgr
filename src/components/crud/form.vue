<template>
    <Form ref="form" :model="formData" :label-width="70" :rules="rules" label-position="right">
        <Row class-name="form-row" :gutter="10" v-for="(row, idx) in columns" :key="idx">
            <Col :xs="xs" :sm="xs" :md="md" v-for="col in row" :key="col.label">
                <FormItem :label="col.label" :prop="col.prop">
                    <Input
                        v-if="isDefaultType(col.type)"
                        :type="col.type"
                        v-model="formData[col.prop]"
                        :placeholder="`请输入${col.label}...`"
                        :disabled="loading"
                        :readonly="isReadOnly"
                    />
                    <Select
                        v-if="col.type === 'select'"
                        v-model="formData[col.prop]"
                        :disabled="loading"
                    >
                        <Option
                            v-for="item in col.dicts"
                            :value="item.value"
                            :key="item.value"
                            :disabled="isReadOnly"
                            >{{ item.label }}</Option
                        >
                    </Select>
                    <DatePicker
                        v-if="col.type === 'date' || col.type === 'datetime'"
                        v-model="formData[col.prop]"
                        :type="col.type"
                        :format="col.format || ''"
                        :placeholder="`请选择${col.label}`"
                        :disabled="loading"
                        :readonly="isReadOnly"
                    ></DatePicker>
                    <Upload
                        v-if="col.type === 'file' || col.type === 'image'"
                        v-bind="col.uploadConfig"
                        :disabled="loading || isReadOnly"
                    >
                        <div class="inner-upload">
                            <img
                                v-if="col.type === 'image' && !!formData[col.prop]"
                                :src="formData[col.prop]"
                                class="upload-image"
                            />
                            <Icon
                                type="ios-cloud-upload"
                                size="20"
                                :class="['upload-icon', { 'default-visible': !formData[col.prop] }]"
                            ></Icon>
                        </div>
                    </Upload>
                </FormItem>
            </Col>
        </Row>
        <slot v-bind:formData="{ formData }"> </slot>
    </Form>
</template>

<script>
/**
 * formColumns:array:[
 * {
 *  label:string,
 *  prop:string,
 *  type:string,// input支持的type | select | date|datetime | file | image,
 *  format:string,//见iview的datepicker的format参数
 *  dicts:[
 *    {
 *      label:string,
 *      value:string
 *    }
 *  ],
 *  uploadConfig:{} //upload组件的prop信息
 * }
 * ]
 */
export default {
    name: 'crud-form',
    inject: ['formData', 'onCreateForm', 'onUpdateForm', 'rules', 'formColumns'],
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        isReadOnly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            colNum: 2, // 每行几个formitem
            md: 12, // 大于md尺寸时每列宽度
            xs: 24, // 小尺寸时每列宽度
            columns: [],
            isEdit: false
        };
    },
    created() {
        this.initConfig();
    },
    methods: {
        initConfig() {
            const columns = [];
            let cur = -1;
            for (let i = 0; i < this.formColumns.length; i++) {
                if (i % this.colNum === 0) {
                    columns[++cur] = [];
                }
                const temp = this.formColumns[i];
                columns[cur].push({
                    ...temp,
                    dicts: temp.dicts || []
                });
            }
            this.columns = columns;
        },
        initForm(row) {
            this.isEdit = !!row;
            if (row) {
                // 直接用列表初始化表单
                Object.keys(row).forEach(key => {
                    const keyObj = this.formColumns.find(col => col.prop === key);
                    if (keyObj && keyObj.type && keyObj.type.indexOf('time') > -1) {
                        this.formData[key] = new Date(row[key]);
                    } else {
                        this.formData[key] = row[key];
                    }
                });
            }
        },
        async submit() {
            const valid = await this.$refs.form.validate();
            if (valid) {
                if (this.isEdit) {
                    // 更新
                    await this.onUpdateForm(this.formData);
                } else {
                    // 创建
                    await this.onCreateForm(this.formData);
                }
                this.$emit('close-modal');
            }
        },
        clearForm() {
            this.$refs.form.resetFields();
        },
        isDefaultType(type) {
            const otherTypes = ['select', 'date', 'datetime', 'file', 'image'];
            const hasType = otherTypes.find(item => item === type);
            return !hasType;
        },
        sync(prop, value) {
            this.formData[prop] = value;
        }
    }
};
</script>

<style lang="less" scoped>
.inner-upload {
    width: 60px;
    height: 60px;
    border: 1px dashed rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    position: relative;
    transition: 0.3s;
    cursor: pointer;
    overflow: hidden;
    &:hover {
        box-shadow: 0px 5px 10px 1px rgba(0, 0, 0, 0.3);
        .upload-icon {
            opacity: 1;
        }
    }
    .upload-image {
        position: absolute;
        z-index: 2;
        width: 50px;
        height: 50px;
        display: block;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .upload-icon {
        width: 60px;
        height: 60px;
        background: rgba(0, 0, 0, 0.5);
        position: absolute;
        z-index: 10;
        text-align: center;
        line-height: 60px;
        color: #fff;
        opacity: 0;
        &.default-visible {
            opacity: 1;
        }
    }
}
</style>
