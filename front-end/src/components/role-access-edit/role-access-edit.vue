<style lang="less">
    @import '../../styles/common.less';


</style>

<template>
    <div id="role-access-edit">
        <Card>
            <p slot="title">
                <Icon type="edit"></Icon>
                角色权限编辑
            </p>
            <Spin size="large" fix v-if="spinShow"></Spin>
            <Transfer
                    :list-style="listStyle"
                    :titles="['待选择权限','角色内权限']"
                    :data="allAccess"
                    :target-keys="targetKeys"
                    :render-format="renderItem"
                    @on-change="handleChange"></Transfer>

        </Card>
    </div>
</template>

<script>
    import Util from '@/libs/util';
    import queryHelper from '@/libs/query-helper';
    import accessService from '@/services/access-service';
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
                    width: '400px',
                    height: '500px'
                },
                spinShow:false,
                allAccess:[],
                targetKeys: []
            }
        },
        computed: {
        },
        created(){
            this.getAllAccesses();
        },
        beforeRouteEnter(to, from, next){
            next(vm=>{

            })
        },
        watch:{
            roleId:function (val, oldVal) {
                this.getAllAccesses();//当角色变化的时候，修改
            }
        },
        methods: {
            //获取所有权限信息，以及该角色下的权限信息
            getAllAccesses () {
                var self = this;
                if(self.roleId==-1){return}
                self.spinShow = true;
                accessService.queryAllAndRoleAccess({roleId:self.roleId}).then(function (resp) {
                    self.spinShow = false;
                    if(resp && resp.success){
                        if(resp.data && resp.data.length>0){
                            //赋值当前用户列表，以及在角色中的用户列表
                            let data = resp.data.map((item)=>{
                                return {
                                    key: item.id,
                                    label: item.name,
                                    description: item.desc,
                                    disabled: false
                                }
                            });
                            self.allAccess=  data;

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
                return `${item.label}(${item.description})`;
            },
            handleChange (newTargetKeys, direction, moveKeys) {
                var self = this;
                console.log(newTargetKeys);
                console.log(direction);
                console.log(moveKeys);
                this.targetKeys = newTargetKeys;
                //调用接口，完成角色、权限关系改变
                if(direction.toLowerCase() ==='left'){
                    //向左，表示把角色中权限移除

                    let loadingEnd = this.$Message.loading({
                        top:60,
                        content: '处理中...',
                        duration: 0
                    });
                    roleService.removeAccess({roleId:self.roleId,accessIds:moveKeys}).then(function (resp) {
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
                    //向右，表示在角色中添加权限

                    let loadingEnd = this.$Message.loading({
                        top:60,
                        content: '处理中...',
                        duration: 0
                    });
                    roleService.addAccess({roleId:self.roleId,accessIds:moveKeys}).then(function (resp) {
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
