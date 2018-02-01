'use strict';
/**
 * Created by kaicui on 16/11/15.
 * 拦截器:用于在http 的 context 上添加一些helper方法，在action中就可以直接this.xxx使用了
 */
const config = require('config');

module.exports=async (ctx,next)=>{
    
    /**
     * 判断是否登录
     * @returns {boolean}
     */
    ctx.hasLogin=function () {
        var self = this;
        if(self.session && self.session.user){
            return true;
        }else{
            return false;
        }
    };
    
    /**
     * 判断是否有目标权限
     * @returns {boolean}
     */
    ctx.hasAccessTo=function (needAccessArray) {
        var self = this;
        if(self.session && self.session.user && self.session.user.access){
            let access = self.session.user.access;
            //如果是根用户权限，直接返回yes
            if(access === config.access.rootUserAccess){
                return true;
            }
            //查看权限列表
            let notHave =  needAccessArray.filter((n)=>{
                return access.filter( (a)=>{
                    return a.name === n
                } ).length<1
            });
            if(notHave.length>0){
                return false;
            }else{
                return true;
            }
        }else{
            return false;
        }
    };
    /**
     * 获取 session user
     * @returns {*}
     */
    ctx.getSessionUser=function () {
        var self = this;
        if(self.session && self.session.user){
            return self.session.user;
        }else{
            return undefined;
        }
    };
    /**
     * 设置 session user
     * @param user
     * @returns {boolean}
     */
    ctx.setSessionUser=function (user) {
        var self = this;
        if(self.session){
            self.session.user = user;
            return true;
        }else{
            return false;
        }
    };
    
    await next();
}