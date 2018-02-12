<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import Util from '@/libs/util';
import userService from '@/services/user-service';
export default {
    data () {
        return {
            form: {
                userName: 'admin',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
          var self = this;
            self.$refs.loginForm.validate((valid) => {
            if (valid) {
              userService.login({accountName:self.form.userName,password:self.form.password}).then(function (resp) {
                if(resp && resp.success){

                    self.$store.commit("login",resp.data);
//                  Cookies.set('user', self.form.userName);
//                  Cookies.set('password', self.form.password);
//                  if (self.form.userName === 'iview_admin') {
//                    Util.setAccessInfo(0);
//                  } else {
//                    Util.setAccessInfo([1, 2, 3]);
//                    Util.setAccessInfo(resp.data.access.map( (a)=>{
//                        return a.id;
//                    }));
//                  }
                  self.$router.push({
                    name: 'home_index'
                  });

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
          });
        }
    }
};
</script>

<style>

</style>
