<style lang="less">
    @import '../../styles/common.less';


</style>

<template>
    <div id="access-index">
        <Card>
            <p slot="title">
                <Icon type="android-add-circle"></Icon>
                权限新增
            </p>

            <Form ref="form" :model="form"  :rules="rule" label-position="right">
                <FormItem label="权限名称：" prop="name" label-width="100">
                        <Input v-model="form.name" style="width: 300px"></Input>
                </FormItem>

                <FormItem label="权限描述：" prop="desc" label-width="100">
                        <Input v-model="form.desc"  style="width: 300px"></Input>
                </FormItem>

                <FormItem label="是否启用：" prop="enable" label-width="100">
                    <i-switch v-model="form.enable"></i-switch>
                </FormItem>

                <Form-item label-width="100">
                    <Button type="primary" @click="handleSubmit('form')">提交</Button>
                </Form-item>
            </Form>

        </Card>
    </div>
</template>

<script>
import Util from '@/libs/util';
import dateUtil from '@/libs/date.js';
import queryHelper from '@/libs/query-helper';
import accessService from '@/services/access-service';
export default {
    name:"access_create",
    data () {
        return {
            form:{
                name:"",
                desc:"",
                enable:true
            },
            rule: {
                name: [
                    { required: true, message: '名称不能为空', trigger: 'blur' }
                ],

                desc: [
                    { required: true, message: '请输入介绍', trigger: 'blur' },
                    { type: 'string', min: 5, message: '介绍不能少于5字', trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
    },
    methods: {
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('提交成功!');
                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        }
    }
};
</script>

<style>

</style>
