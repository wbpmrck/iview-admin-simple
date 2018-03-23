<style lang="less">
    @import '../../styles/common.less';
    @import './access.less';
</style>

<template>
    <div class="access">
        <Row>
            <Col span="8">
                <Card>
                    <p slot="title">
                        <Icon type="android-contact"></Icon>
                        当前用户
                    </p>
                    <div class="access-user-con access-current-user-con">
                        <p>当前用户权限值:<b>{{ JSON.stringify(currentAccess) }}</b></p>
                    </div>
                </Card>
            </Col>
            <Col span="16" class="padding-left-10">
                <Card>
                    <p slot="title">
                        <Icon type="android-contacts"></Icon>
                        不同权限用户的不同菜单
                    </p>
                    <div class="access-user-con access-change-access-con">
                        <Col span="8">
                            <Row type="flex" justify="center" align="middle" class="access-change-access-con-row">
                                <i-switch :value="switchValue" @on-change="changeAccess" size="large"></i-switch>
                            </Row>
                        </Col>
                        <Col span="16" class="padding-left-10">
                            <Row type="flex" justify="center" align="middle" class="access-change-access-con-row">
                                <p>您可以通过左侧的开关来切换当前用户的权限值，然后您可以观察左侧菜单栏的变化，如果当前用户的权限值是<b> [error_page] </b>，
                                    则左侧菜单栏会显示"错误页面（演示）"这一项。 <br>
                                    <b>权限控制也会在手动输入无权限的url地址时，进行控制。</b> <br/>
                                    注意：ajax的权限控制是在back-end项目里控制的

                                </p>

                            </Row>
                        </Col>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import Util from '@/libs/util';
export default {
    name: 'access_demo',
    data () {
        return {
            switchValue: 0
        };
    },
    computed: {
        currentAccess:function () {
            return this.$store.state.user.userInfo.access
        }
    },
    methods: {
//        todo:这里出于演示考虑，直接修改前端的权限信息，正常应该是提交到服务端，然后服务端重新查询用户权限信息，客户端根据服务器返回信息进行更新
        changeAccess (res) {
            if (res) {
                let accessCode = [{id:1,name:'error_page'}];
              this.$store.commit("changeAccess",accessCode);
//                Cookies.set('access', 1);
            } else {
                let accessCode = [];
//                Cookies.set('access', 0);
//              Util.setAccessInfo(this.accessCode);
                this.$store.commit("changeAccess",accessCode);
            }
//            this.$store.commit('updateMenulist');
            this.$store.dispatch('updateMenulist');
        }
    }
};
</script>

<style>

</style>
