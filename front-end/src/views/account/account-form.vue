<style lang="less">
    @import '../../styles/common.less';


</style>

<template>
    <div id="access-index">
        <Card>
            <p slot="title">
                <Icon v-if="mode=='account_create'" type="android-add-circle"></Icon>
                <Icon v-if="mode=='account_update'" type="edit"></Icon>
                {{mode=='account_create'?'创建账户':'编辑账户'}}
            </p>

            <Form ref="form" :model="form"  :rules="rule" label-position="right">
                <Spin size="large" fix v-if="spinShow"></Spin>
                <FormItem label="账户名称：" prop="accountName" :label-width="100">
                    <Input v-model="form.accountName" style="width: 300px"></Input>
                </FormItem>

                <FormItem label="账户密码：" prop="password" :label-width="100">
                    <Input v-model="form.password"  style="width: 300px"></Input>
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
    import userService from '@/services/user-service';
    export default {
//        name:"access_unknown",
        data () {
            return {
                mode:"unknown", // 工作模式，默认未知、其他页面传入可选"create","update"

                spinShow:false,
                form:{
                    id:-1,
                    accountName:"",
                    password:"",
                    enable:true
                },
                rule: {
                    accountName: [
                        { required: true, message: '名称不能为空', trigger: 'blur' }
                    ],

                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码位数不能少于6个字', trigger: 'blur' }
                    ]
                }
            };
        },
        computed: {
        },
        created(){
          console.log('create');
        },
        beforeRouteEnter(to, from, next){
            next(vm=>{
                vm.mode = to.name;
                if(vm.mode=="account_update"&& to.params.id !== undefined){
                    vm.form.id = to.params.id;
                    vm.queryAccount();
                }
            })
        },
        methods: {

            queryAccount : function(){
                var self = this;
                self.spinShow = true;
                userService.queryAccounts({id:self.form.id}).then(function (resp) {
                    self.spinShow = false;
                    if(resp && resp.success){
                        if(resp.data.data && resp.data.data.length>0){
                            self.form = resp.data.data[0];
                        }
                    }else{
                        self.$Notice.error({
                            title: '错误',
                            desc: resp.desc
                        });
                    }
                }).catch(function(err){
                    self.spinShow = false;
                    self.$Notice.error({
                        title: '错误',
                        desc: err.message
                    });
                });
            },
            handleSubmit (name) {
                var self = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {

                        const loadingEnd = this.$Message.loading({
                            top:60,
                            content: '处理中...',
                            duration: 0
                        });
                        if(self.mode ==='account_create'){
                            userService.regist(self.form).then(function (resp) {
                                loadingEnd();
                                if(resp && resp.success){
                                    self.$Message.success({
                                        content:'新增成功!',
                                        duration:1,
                                        onClose:()=>{
                                            //跳转
                                            self.$router.replace({
                                                name: 'account_index'
                                            });
                                        }});
                                }else{
                                    self.$Message.error('错误：'+resp.desc,9);
                                }
                            }).catch(function(err){
                                loadingEnd();
                                self.$Message.error('错误：'+err.message,9);
                            });
                        }else if(self.mode == 'account_update'){
                            userService.update(self.form).then(function (resp) {
                                loadingEnd();
                                if(resp && resp.success){
                                    self.$Message.success({
                                        content:'修改成功!',
                                        duration:1,
                                        onClose:()=>{
                                            //跳转
                                            self.$router.replace({
                                                name: 'account_index'
                                            });
                                        }});
                                }else{
                                    self.$Message.error('错误：'+resp.desc,9);
                                }
                            }).catch(function(err){
                                loadingEnd();
                                self.$Message.error('错误：'+err.message,9);
                            });
                        }else{
                            loadingEnd();
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
