<style lang="less">
    @import '../../styles/common.less';

    #access-index .ivu-input-group-prepend{
        background-color: #fff;
        border:none;
    }

</style>

<template>
    <div id="access-index">
        <Card>
            <p slot="title">
                <Icon type="ios-shuffle-strong"></Icon>
                权限管理
            </p>

            <Row>
                <Col :span="10">
                    <Input v-model="condition.name" placeholder="请输入权限名称" style="width: 250px" @on-enter="queryAccess">
                        <span slot="prepend">权限名称:</span>
                        <!--<Button slot="append" icon="ios-search" @click="queryAccess"></Button>-->
                    </Input>
                </Col>

                <Col :span="10">
                    <Input v-model="condition.desc" placeholder="请输入权限描述" style="width: 250px" @on-enter="queryAccess" >
                        <span slot="prepend">权限描述:</span>
                        <!--<Button slot="append" icon="ios-search" @click="queryAccess"></Button>-->
                    </Input>
                </Col>
                <Col :span="4">
                    <Button type="primary" icon="ios-search" @click="queryAccess">查询</Button>
                    <Button type="primary" icon="ios-search" @click="create">新增</Button>

                </Col>
            </Row>

            <div class="split"></div>

            <Row>
                <Page :total="tableData.total" :page-size-opts="condition.pageSizeOpts"  show-sizer show-total show-elevator @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
            </Row>


            <div class="split"></div>
            <Row>
                <Table stripe :columns="tableColumns" :data="tableData.data"></Table>

            </Row>
        </Card>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import Util from '@/libs/util';
import dateUtil from '@/libs/date.js';
import queryHelper from '@/libs/query-helper';
import accessService from '@/services/access-service';
export default {
    name:"access_index",
    data () {
        return {
            condition:{
                name:"",
                desc:"",
                ...queryHelper.pageCondition
            },
            tableColumns: [
                {
                    title: 'ID',
                    key: 'id'
                },
                {
                    title: '名称',
                    key: 'name'
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
                    render (_,{row, column, index}) {
                        return dateUtil.format(new Date(row.update_time),'yyyy-MM-dd hh:mm:ss');
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
            if(from.name==='access_create'){
                vm.queryAccess();
            }
        })
    },
    methods: {
        pageChange:function (pageIndex) {
            this.condition.pageIndex = pageIndex;
            this.queryAccess();
        },
        pageSizeChange:function (pageSize) {
            this.condition.pageSize = pageSize;
            this.queryAccess();
        },
        create:function () {
            this.$router.push({
                name: 'access_create'
            });
        },
        queryAccess : function(){
            var self = this;
            accessService.query(this.condition).then(function (resp) {
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
