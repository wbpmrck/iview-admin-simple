// const logger = require('../log/logger');
const resp = require('../../framework/web/responseHelper');
const Meta = require('../helper/router-meta');

const sysService = require('../service/sys');

const map = new Map();


map.set(
    // 用户注册，参数：用户名、密码
    ['POST', '/user/regist' , Meta.needLogin().needAccess(["user.add"])],
    async function (ctx, next) {
        const self = this;
        try {

            const { accountName, password} = ctx.request.body;
            // 调用service获取返回数据
            const result = await sysService.registUser(ctx, { accountName, password});
    
            ctx.body =result;
        } catch (e) {
            resp.failed({ desc: e.stack || e.toString() }, ctx);
        } finally {
            // 执行流程交给下一个middle-ware
            await next();
        }
    }
);
map.set(
    // 用户登录：用户名、密码
    ['POST', '/user/login'],
    async function (ctx, next) {
        const self = this;
        try {
            // 如果已经登录，则直接返回
            if (ctx.hasLogin()) {
                resp.success({ data: ctx.getSessionUser() }, ctx);
            } else {
              
                const { accountName, password } = ctx.request.body;

                // 调用service获取返回数据
                const result = await sysService.login(ctx, { accountName, password });

                if (result.success) {
                    //todo:查询用户详细角色，权限信息，写入会话，返回客户端
                    const userInfo = await sysService.queryUserInfo(ctx, { id:result.data.id });
                    ctx.setSessionUser(userInfo.data);
                    ctx.body =userInfo;
                }else{
                    ctx.body =result;
                }
            }
        } catch (e) {
            resp.failed({ desc: e.stack || e.toString() }, ctx);
        } finally {
            // 执行流程交给下一个middle-ware
            await next();
        }
    }
);
map.set(
    // 用户取消登录
    ['POST', '/user/logout', Meta.needLogin()],
    async function (ctx, next) {
        const self = this;
        try {
            // 如果已经登录，则直接返回
            if (ctx.hasLogin()) {
                ctx.setSessionUser(undefined);
                resp.success({ data: true }, ctx);
            } else {
                resp.failed({ code: resp.codes.NO_USER }, ctx);
            }
        } catch (e) {
            resp.failed({ desc: e.toString() }, ctx);
        } finally {
            // 执行流程交给下一个middle-ware
            await next();
        }
    }
);

/*
    权限相关
 */

map.set(
    // 查询权限
    ['GET', '/access/query'],
    async function (ctx, next) {
        const self = this;
        try {
            const conditon = ctx.request.query;
            const { id,name,desc,pageIndex,pageSize,needTotal} = ctx.request.query;

            // 调用service获取返回数据
            const result = await sysService.queryAccess(ctx,{id,name,desc},{pageIndex,pageSize,needTotal});
            ctx.body = result;
        } catch (e) {
            resp.failed({ desc: e.stack || e.toString() }, ctx);
        } finally {
            // 执行流程交给下一个middle-ware
            await next();
        }
    }
);
map.set(
    // 修改权限
    ['POST', '/access/update'],
    async function (ctx, next) {
        const self = this;
        try {n

            const toUpdate = ctx.request.body;
            // 调用service获取返回数据
            const result = await sysService.updateAccess(ctx,toUpdate);
            ctx.body = result;
        } catch (e) {
            resp.failed({ desc: e.stack || e.toString() }, ctx);
        } finally {
            // 执行流程交给下一个middle-ware
            await next();
        }
    }
);
map.set(
    // 新增权限
    ['POST', '/access/create'],
    async function (ctx, next) {
        const self = this;
        try {

            const toCreate = ctx.request.body;
            // 调用service获取返回数据
            const result = await sysService.createAccess(ctx,toCreate);
            ctx.body = result;
        } catch (e) {
            resp.failed({ desc: e.stack || e.toString() }, ctx);
        } finally {
            // 执行流程交给下一个middle-ware
            await next();
        }
    }
);


/*
    角色相关
 */
map.set(
    // 查询角色信息
    ['GET', '/role/query'],
    async function (ctx, next) {
        const self = this;
        try {
            const conditon = ctx.request.query;
            
            // 调用service获取返回数据
            const result = await sysService.queryRole(ctx,conditon);
            ctx.body = result;
        } catch (e) {
            resp.failed({ desc: e.stack || e.toString() }, ctx);
        } finally {
            // 执行流程交给下一个middle-ware
            await next();
        }
    }
);
module.exports = map;