<style lang="less">
    @import '../../styles/common.less';


</style>

<template>
    <div id="role-user-edit">
        <Card>
            <p slot="title">
                <Icon type="edit"></Icon>
                角色用户编辑
            </p>
            <Spin size="large" fix v-if="spinShow"></Spin>
            <Transfer
                    :list-style="listStyle"
                    :titles="['待选择用户','角色内用户']"
                    :data="allUsers"
                    :target-keys="targetKeys"
                    :render-format="renderItem"
                    @on-change="handleChange"></Transfer>

        </Card>
    </div>
</template>

<script>
    import Util from '@/libs/util';
    import queryHelper from '@/libs/query-helper';
    import roleService from '@/services/role-service';
    import userService from '@/services/user-service';
    export default {

        props: {
//            // 基础类型检测 (`null` 指允许任何类型)
//            propA: Number,
//            // 可能是多种类型
//            propB: [String, Number],
//            // 必传且是字符串
            roleId: {
                type: Number,
                required: true,
                default: -1
            },
//            // 数值且有默认值
//            propD: {
//                type: Number,
//                default: 100
//            },
//            // 数组/对象的默认值应当由一个工厂函数返回
//            propE: {
//                type: Object,
//                default: function () {
//                    return { message: 'hello' }
//                }
//            },
//            // 自定义验证函数
//            propF: {
//                validator: function (value) {
//                    return value > 10
//                }
//            }
        },
        data () {
            return {
                listStyle: {
                    width: '200px',
                    height: '300px'
                },
                spinShow:false,
                allUsers:[],
                targetKeys: []
            }
        },
        computed: {
        },
        created(){
            this.getAllUsers();
        },
        beforeRouteEnter(to, from, next){
            next(vm=>{

            })
        },
        watch:{
            roleId:function (val, oldVal) {
                this.getAllUsers();//当角色变化的时候，修改
            }
        },
        methods: {
            //获取所有用户信息，以及该角色下的用户信息
            getAllUsers () {
                var self = this;
                if(self.roleId==-1){return}
                self.spinShow = true;
                userService.queryAllAndRoleUser({roleId:self.roleId}).then(function (resp) {
                    self.spinShow = false;
                    if(resp && resp.success){
                        if(resp.data && resp.data.length>0){
                            //赋值当前用户列表，以及在角色中的用户列表
                            let data = resp.data.map((item)=>{
                                return {
                                    key: item.id,
                                    label: item.account_name,
                                    description: '',
                                    disabled: false
                                }
                            });
                            self.allUsers=  data;

                            //放在"角色下用户"里的用户，必须具有当前编辑的roleId
                            let keys = resp.data.filter((item=>{
                                return item.roleId == self.roleId
                            })).map((item)=>{
                                return item.id
                            });
                            self.targetKeys = keys;
                        }
                    }else{
                        self.$Message.error({
                            content: '错误:'+resp.desc,
                            duration: 7
                        });
                    }
                }).catch(function(err){
                    self.spinShow = false;
                    self.$Message.error({
                        content: '错误:'+err.message,
                        duration: 7
                    });
                });
            },
            /**
             * 如何渲染每一个穿梭条目
             * @param item
             */
            renderItem (item) {
                return item.label;
            },
            handleChange (newTargetKeys, direction, moveKeys) {
                var self = this;
                console.log(newTargetKeys);
                console.log(direction);
                console.log(moveKeys);
                this.targetKeys = newTargetKeys;
                //调用接口，完成角色、用户关系改变
                if(direction.toLowerCase() ==='left'){
                    //向左，表示把角色中用户移除

                    let loadingEnd = this.$Message.loading({
                        top:60,
                        content: '处理中...',
                        duration: 0
                    });
                    roleService.removeUser({roleId:self.roleId,userIds:moveKeys}).then(function (resp) {
                        loadingEnd();
                        if(resp && resp.success){
                            self.$Message.success({
                                content:'处理成功!',
                                duration:1
                            });
                        }else{
                            self.$Message.error({
                                content: '错误:'+resp.desc,
                                duration: 7
                            });
                        }
                    }).catch(function(err){
                        loadingEnd();
                        self.$Message.error({
                            content: '错误:'+err.message,
                            duration: 7
                        });
                    });
                }else if(direction.toLowerCase() ==='right'){
                    //向右，表示在角色中添加用户

                    let loadingEnd = this.$Message.loading({
                        top:60,
                        content: '处理中...',
                        duration: 0
                    });
                    roleService.addUser({roleId:self.roleId,userIds:moveKeys}).then(function (resp) {
                        loadingEnd();
                        if(resp && resp.success){
                            self.$Message.success({
                                content:'处理成功!',
                                duration:1
                            });
                        }else{
                            self.$Message.error({
                                content: '错误:'+resp.desc,
                                duration: 7
                            });
                        }
                    }).catch(function(err){
                        loadingEnd();
                        self.$Message.error({
                            content: '错误:'+err.message,
                            duration: 7
                        });
                    });
                }
            }
        }
    };
</script>

<style>

</style>
