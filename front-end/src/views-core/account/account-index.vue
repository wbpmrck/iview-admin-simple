<style lang="less">
    @import '../../styles/common.less';

    #role-index .ivu-input-group-prepend{
        background-color: #fff;
        border:none;
    }

</style>

<template>
    <div id="role-index">
        <Card>
            <p slot="title">
                <Icon type="ios-people"></Icon>
                账户管理
            </p>

            <Row>
                <Col :span="20">
                    <Input v-model="condition.account_name" placeholder="请输入账户名称" style="width: 250px" @on-enter="queryAccount">
                        <span slot="prepend">账户名:</span>
                    </Input>
                </Col>


                <Col :span="4">
                    <i-button type="primary" icon="ios-search" @click="queryAccount">查询</i-button>
                    <i-button type="primary" icon="android-add-circle" @click="create">新增</i-button>

                </Col>
            </Row>

            <div class="split"></div>

            <Row>
                <Page :total="tableData.total" :page-size-opts="condition.pageSizeOpts"  show-sizer show-total show-elevator @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
            </Row>


            <div class="split"></div>
            <Row>
                <Table stripe :columns="tableColumns" :data="tableData.data"></Table>
                <Spin size="large" fix v-if="spinShow"></Spin>
            </Row>
        </Card>
        <!--<Modal v-model="isEditRoleUser" :mask-closable="false"	 class-name="vertical-center-modal" :styles="{width:'auto'}">-->
            <!--<role-user-edit :role-id="roleIdToEditUser"></role-user-edit>-->
            <!--<div slot="footer">-->
                <!--<i-button type="success" size="large" long @click="finishEditRoleUser">完成编辑</i-button>-->
            <!--</div>-->
        <!--</Modal>-->
        <!--<Modal v-model="isEditRoleAccess" :mask-closable="false"	 class-name="vertical-center-modal" :styles="{width:'auto'}">-->
            <!--<role-access-edit :role-id="roleIdToEditAccess"></role-access-edit>-->
            <!--<div slot="footer">-->
                <!--<i-button type="success" size="large" long @click="finishEditRoleAccess">完成编辑</i-button>-->
            <!--</div>-->
        <!--</Modal>-->
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import Util from '@/libs/util';
import dateUtil from '@/libs/date.js';
import queryHelper from '@/libs/query-helper';
import userService from '@/services/user-service';
export default {
//    name:"access_index",
    components: {
    },
    data () {
        return {
            condition:{
                account_name:"",
                ...queryHelper.pageCondition
            },
            spinShow:false,
            tableColumns: [
                {
                    title: 'ID',
                    width: 110,
                    key: 'id'
                },
                {
                    title: '名称',
                    key: 'account_name'
                },
                {
                    title: '是否启用',
                    align: 'center',
                    key: 'enable',
                    render: (h, {row, column, index}) => {

                        let styleObject ={};
                        if(row.enable){
                            styleObject={
                                type: 'checkmark-circled',
                                color: 'green'
                            }
                        }else{
                            styleObject={
                                type: 'close-circled',
                                color: 'red'
                            }
                        }

                        return h('div', [
                            h('Icon', {
                                props: {
                                    ...styleObject,
                                    size:22,
                                },
                                style: {
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '密文',
                    key: 'password_secret'
                },
                {
                    title: 'salt',
                    key: 'salt'
                },
                {
                    title: '创建时间',
                    key: 'create_time',
                    render (createElement,{row, column, index}) {
                        return createElement('span',dateUtil.format(new Date(row.create_time),'yyyy-MM-dd hh:mm:ss'))
                    }
                },
                {
                    title: '修改时间',
                    key: 'update_time',
                    render (createElement,{row, column, index}) {
                        return createElement('span',dateUtil.format(new Date(row.update_time),'yyyy-MM-dd hh:mm:ss'))
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    fixed: 'right',
                    width: 180,
                    render: (h, {row, column, index}) => {
                        return h('div', [
                            h('i-button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
//                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.update(row)
                                    }
                                }
                            }, '编辑'),
//                            h('i-button', {
//                                props: {
//                                    type: 'primary',
//                                    size: 'small'
//                                },
//                                style: {
//                                    marginLeft:"20px"
//                                },
//                                on: {
//                                    click: () => {
//                                        this.editUserRole(row)
//                                    }
//                                }
//                            }, '所属角色')
                        ]);
                    }
                }
            ],
            tableData:{
                total:0,
                data:[
                ]
            }
        };
    },
    computed: {
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            // 通过 `vm` 访问组件实例
            console.log(from);
            //如果是从"新增"场景回到管理场景，则刷新
            if(from.name==='account_create' || from.name==='account_update' ){
                vm.queryAccount();
            }
        })
    },
    methods: {
        pageChange:function (pageIndex) {
            this.condition.pageIndex = pageIndex;
            this.queryAccount();
        },
        pageSizeChange:function (pageSize) {
            this.condition.pageSize = pageSize;
            this.queryAccount();
        },
        create:function () {
            this.$router.replace({
                name: 'account_create'
            });
        },
        editUserRole:function (row) {
            alert('编辑账户所属的角色')
        },

        update:function (data) {
            this.$router.replace({
                name: 'account_update',
                params:{
                    id:data.id
                }
            });
        },
        queryAccount : function(){
            var self = this;
            self.spinShow = true;
            userService.queryAccounts(this.condition).then(function (resp) {
                self.spinShow = false;
                if(resp && resp.success){
                    self.tableData.total= resp.data.total;
                    self.tableData.data = resp.data.data;
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
        }
    }
};
</script>

<style>

</style>
