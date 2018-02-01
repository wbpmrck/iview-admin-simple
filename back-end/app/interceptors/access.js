'use strict';
/**
 * Created by kaicui on 16/11/15.
 * 拦截器:用户权限检查
 */

const logger = require('../log/logger');
const resp = require("../../framework/web/responseHelper");

module.exports=async (ctx,next)=>{
    let route = require('../../app/routes').getRouter();
    let req= ctx.request; // Request 对象
    let session = ctx.session; // session 对象
    //指定路由不做检查 ,静态文件路由(含.)不做检查
    let matched  =route.match(req.path);

    //判断哪些路由不需要进行登录检查
    if(matched && matched.path && matched.path.length>0 && matched.path[0].name){
        
        let meta = matched.path[0].name;
        if(meta.accessNeed){
            logger.debug("检查权限状态");
            if(!ctx.hasAccessTo(meta.accessNeed)){
                //如果是html请求
                if(ctx.request.headers["accept"] && ctx.request.headers["accept"].indexOf('text/html')>-1){
                    //如果是页面，则重定向
                    ctx.response.redirect('/403');
                }else{
                    // 如果是ajax
                    resp.failed({code:resp.codes.NOT_AUTH},ctx);
                }
            }else{
                await next();
            }
        }else{
            await next();
        }
    }else{
        await next();
    }
}
