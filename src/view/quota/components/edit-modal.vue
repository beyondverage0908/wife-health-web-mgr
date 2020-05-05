<template>
    <main>
        <Form ref="form" :model="form" :label-width="70" :rules="rules">
            <Row class-name="form-row" :gutter="16">
                <Col span="12">
                    <FormItem label="脖围" prop="neck">
                        <Input v-model="form.neck" placeholder="请输入" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="胸围" prop="bust">
                        <Input v-model="form.bust" placeholder="请输入" />
                    </FormItem>
                </Col>
            </Row>
            <Row class-name="form-row" :gutter="16">
                <Col span="12">
                    <FormItem label="腰围" prop="waistline">
                        <Input v-model="form.waistline" placeholder="请输入" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="臀围" prop="hips">
                        <Input v-model="form.hips" placeholder="请输入" />
                    </FormItem>
                </Col>
            </Row>
            <Row class-name="form-row" :gutter="16">
                <Col span="12">
                    <FormItem label="左手围" prop="leftArm">
                        <Input v-model="form.leftArm" placeholder="请输入" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="右手围" prop="rightArm">
                        <Input v-model="form.rightArm" placeholder="请输入" />
                    </FormItem>
                </Col>
            </Row>
            <Row class-name="form-row" :gutter="16">
                <Col span="12">
                    <FormItem label="左腿" prop="leftLeg">
                        <Input v-model="form.leftLeg" placeholder="请输入" />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="右腿" prop="rightLeg">
                        <Input v-model="form.rightLeg" placeholder="请输入" />
                    </FormItem>
                </Col>
            </Row>
        </Form>
    </main>
</template>

<script>
import { addBodyDetail } from '@/api/body-detail';

export default {
    props: {
        isEdit: {
            type: Boolean,
            default: false
        },
        detail: Object
    },
    watch: {
        detail: {
            handler(nVal, oVal) {
                debugger;
                this.form = {
                    ...this.form,
                    ...nVal
                };
            },
            deep: true
        }
    },
    data() {
        return {
            form: {
                neck: ''
            },
            rules: {}
        };
    },
    methods: {
        async save() {
            const validate = await await this.$refs.form.validate();
            if (!validate) {
                this.$emit('submit', false);
                return;
            }
            this.submit();
        },
        async submit() {
            try {
                const { data } = await addBodyDetail(this.form);
                if (data.success) {
                    this.$Message.success('添加成功');
                    this.$emit('submit', true);
                } else {
                    this.$emit('submit', false);
                    this.$Message.warning(data.message);
                }
            } catch (error) {
                console.log(error);
                this.$Message.warning(error.message);
            }
        }
    }
};
</script>
