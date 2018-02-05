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
                <FormItem label="权限名称：" prop="name" :label-width="100">
                    <Input v-model="form.name" style="width: 300px"></Input>
                </FormItem>

                <FormItem label="权限描述：" prop="desc" :label-width="100">
                    <Input v-model="form.desc"  style="width: 300px"></Input>
                </FormItem>

                <FormItem label="是否启用：" prop="enable" :label-width="100">
                    <i-switch v-model="form.enable"></i-switch>
                </FormItem>

                <Form-item :label-width="100">
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
//        name:"access_unknown",
        data () {
            return {
                mode:"unknown", // 工作模式，默认未知、其他页面传入可选"create","update"

                form:{
                    id:-1,
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
        beforeRouteEnter(to, from, next){
            next(vm=>{
                vm.mode = to.params.mode;
//                vm.name =`access_${vm.mode}`
                if(to.params.data){
                    vm.form = to.params.data;
//                    vm.form.id = to.params.data.id;
//                    vm.form.name = to.params.data.name;
//                    vm.form.desc = to.params.data.desc;
//                    vm.form.enable = to.params.data.enable;
                }
//                alert(JSON.stringify(to.params));
            })
        },
        methods: {
            handleSubmit (name) {
                var self = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {

                        if(self.mode ==='create'){
                            accessService.create(self.form).then(function (resp) {
                                if(resp && resp.success){
                                    self.$Message.success({
                                        content:'新增成功!',
                                        duration:1,
                                        onClose:()=>{
                                            //跳转到上个页面
                                            self.$router.go(-1);
                                        }});
                                }else{
                                    self.$Message.error('错误：'+resp.desc,9);
                                }
                            }).catch(function(err){
                                self.$Message.error('错误：'+err.message,9);
                            });
                        }else if(self.mode == 'update'){
                            accessService.update(self.form).then(function (resp) {
                                if(resp && resp.success){
                                    self.$Message.success({
                                        content:'修改成功!',
                                        duration:1,
                                        onClose:()=>{
                                            //跳转到上个页面
                                            self.$router.go(-1);
                                        }});
                                }else{
                                    self.$Message.error('错误：'+resp.desc,9);
                                }
                            }).catch(function(err){
                                self.$Message.error('错误：'+err.message,9);
                            });
                        }else{
                            self.$Message.error('错误的mode参数！');
                        }

                    } else {
                        this.$Message.error('信息填写不正确，请检查!');
                    }
                })
            }
        }
    };
</script>

<style>

</style>
