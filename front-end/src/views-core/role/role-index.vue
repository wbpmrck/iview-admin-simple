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
                <Icon type="person-stalker"></Icon>
                角色管理
            </p>

            <Row>
                <Col :span="10">
                    <Input v-model="condition.name" placeholder="请输入角色名称" style="width: 250px" @on-enter="queryRole">
                        <span slot="prepend">角色名称:</span>
                    </Input>
                </Col>

                <Col :span="10">
                    <Input v-model="condition.desc" placeholder="请输入角色描述" style="width: 250px" @on-enter="queryRole" >
                        <span slot="prepend">角色描述:</span>
                    </Input>
                </Col>
                <Col :span="4">
                    <i-button type="primary" icon="ios-search" @click="queryRole">查询</i-button>
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
        <Modal v-model="isEditRoleUser" :mask-closable="false"	 class-name="vertical-center-modal" :styles="{width:'auto'}">
            <role-user-edit :role-id="roleIdToEditUser"></role-user-edit>
            <div slot="footer">
                <i-button type="success" size="large" long @click="finishEditRoleUser">完成编辑</i-button>
            </div>
        </Modal>
        <Modal v-model="isEditRoleAccess" :mask-closable="false"	 class-name="vertical-center-modal" :styles="{width:'auto'}">
            <role-access-edit :role-id="roleIdToEditAccess"></role-access-edit>
            <div slot="footer">
                <i-button type="success" size="large" long @click="finishEditRoleAccess">完成编辑</i-button>
            </div>
        </Modal>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import Util from '@/libs/util';
import dateUtil from '@/libs/date.js';
import queryHelper from '@/libs/query-helper';
import roleService from '@/services/role-service';
import roleUserEdit from '../../components/role-user-edit/role-user-edit.vue';
import roleAccessEdit from '../../components/role-access-edit/role-access-edit.vue';
export default {
//    name:"access_index",
    components: {
        roleUserEdit,
        roleAccessEdit,
    },
    data () {
        return {
            condition:{
                name:"",
                desc:"",
                ...queryHelper.pageCondition
            },
            isEditRoleUser:false, //是否正在编辑角色对应的用户
            roleIdToEditUser:-1, //要编辑角色下用户的角色id
            isEditRoleAccess:false, //是否正在编辑角色对应的权限
            roleIdToEditAccess:-1, //要编辑角色下权限的角色id
            spinShow:false,
            tableColumns: [
                {
                    title: 'ID',
                    width: 110,
                    key: 'id'
                },
                {
                    title: '名称',
                    key: 'name'
                },
                {
                    title: '是否启用',
                    align: 'center',
                    key: 'name',
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
                    title: '描述',
                    key: 'desc'
                },
                {
                    title: '创建时间',
                    key: 'create_time',
                    render (_,{row, column, index}) {
                        return dateUtil.format(new Date(row.create_time),'yyyy-MM-dd hh:mm:ss');
                    }
                },
                {
                    title: '修改时间',
                    key: 'update_time',
                    render (createElement,{row, column, index}) {
                        return dateUtil.format(new Date(row.update_time),'yyyy-MM-dd hh:mm:ss');
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    fixed: 'right',
                    width: 250,
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
                            h('i-button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginLeft:"20px"
                                },
                                on: {
                                    click: () => {
                                        this.editRoleUser(row)
                                    }
                                }
                            }, '角色用户'),
                            h('i-button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginLeft:"20px"
                                },
                                on: {
                                    click: () => {
                                        this.editRoleAccess(row)
                                    }
                                }
                            }, '角色权限')
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
            if(from.name==='role_create' || from.name==='role_update' ){
                vm.queryRole();
            }
        })
    },
    methods: {
        pageChange:function (pageIndex) {
            this.condition.pageIndex = pageIndex;
            this.queryRole();
        },
        pageSizeChange:function (pageSize) {
            this.condition.pageSize = pageSize;
            this.queryRole();
        },
        create:function () {
            this.$router.replace({
                name: 'role_create'
            });
        },
        editRoleUser:function (row) {
            this.roleIdToEditUser = row.id;
            this.isEditRoleUser = true;
        },
        editRoleAccess:function (row) {
            this.roleIdToEditAccess = row.id;
            this.isEditRoleAccess = true;
        },
        finishEditRoleAccess:function (row) {
            this.roleIdToEditAccess = -1;
            this.isEditRoleAccess = false;
        },
        finishEditRoleUser:function (row) {
            this.roleIdToEditUser = -1;
            this.isEditRoleUser = false;
        },
        update:function (roleInfo) {
            this.$router.replace({
                name: 'role_update',
                params:{
                    id:roleInfo.id
                }
            });
        },
        queryRole : function(){
            var self = this;
            self.spinShow = true;
            roleService.query(this.condition).then(function (resp) {
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
