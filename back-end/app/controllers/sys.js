// const logger = require('../log/logger');
const resp = require('../../framework/web/responseHelper');
const Meta = require('../helper/router-meta');

const sysService = require('../service/sys');

const map = new Map();

/* ======================================================
    用户相关
 ======================================================*/

map.set(
    // 用户注册，参数：用户名、密码
    ['POST', '/user/regist' , Meta.needLogin().needAccess(["user.add"])],
    async function (ctx, next) {
        const self = this;
        try {

            const { accountName, password,enable} = ctx.request.body;
            // 调用service获取返回数据
            const result = await sysService.registUser(ctx, { accountName, password,enable});
    
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

map.set(
    // 用户账户修改
    ['POST', '/user/update', Meta.needLogin().needAccess(["user.update"])],
    async function (ctx, next) {
        const self = this;
        try {

            const { id, password,enable} = ctx.request.body;
            // 调用service获取返回数据
            const result = await sysService.updateUser(ctx, { id, password,enable});

            ctx.body =result;
        } catch (e) {
            resp.failed({ desc: e.toString() }, ctx);
        } finally {
            // 执行流程交给下一个middle-ware
            await next();
        }
    }
);


map.set(
    // 查询所有用户，以及某个角色下的用户
    ['GET', '/user/queryAllAndRoleUser', Meta.needLogin()],
    async function (ctx, next) {
        const self = this;
        try {
            const { roleId} = ctx.request.query;

            // 调用service获取返回数据
            const result = await sysService.queryAllUserAndRoleUser(ctx,{roleId});
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
    // 查询账户列表信息
    ['GET', '/account/query', Meta.needLogin().needAccess(["account.read"])],
    async function (ctx, next) {
        const self = this;
        try {
            const conditon = ctx.request.query;
            const { id,account_name,pageIndex,pageSize,needTotal} = ctx.request.query;

            // 调用service获取返回数据
            const result = await sysService.queryAccount(ctx,{id,account_name},{pageIndex,pageSize,needTotal});
            ctx.body = result;
        } catch (e) {
            resp.failed({ desc: e.stack || e.toString() }, ctx);
        } finally {
            // 执行流程交给下一个middle-ware
            await next();
        }
    }
);

/* ======================================================
    权限相关
====================================================== */

map.set(
    // 查询权限
    ['GET', '/access/query', Meta.needLogin().needAccess(["access.read"])],
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
    // 查询权限列表以及是否在对应角色里
    ['GET', '/access/queryAllAndRoleAccess', Meta.needLogin()],
    async function (ctx, next) {
        const self = this;
        try {
            const { roleId} = ctx.request.query;

            // 调用service获取返回数据
            const result = await sysService.queryAllAccessAndRoleAccess(ctx,{roleId});
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
    ['POST', '/access/update', Meta.needLogin().needAccess(["access.update"])],
    async function (ctx, next) {
        const self = this;
        try {

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
    ['POST', '/access/create', Meta.needLogin().needAccess(["access.create"])],
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


/* ======================================================
    角色相关
 ====================================================== */
map.set(
    // 查询角色信息
    ['GET', '/role/query', Meta.needLogin().needAccess(["role.read"])],
    async function (ctx, next) {
        const self = this;
        try {
            const { id,name,desc,pageIndex,pageSize,needTotal} = ctx.request.query;
            
            // 调用service获取返回数据
            const result = await sysService.queryRole(ctx,{id,name,desc},{pageIndex,pageSize,needTotal});
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
    // 新增角色
    ['POST', '/role/create', Meta.needLogin().needAccess(["role.create"])],
    async function (ctx, next) {
        const self = this;
        try {

            const toCreate = ctx.request.body;
            // 调用service获取返回数据
            const result = await sysService.createRole(ctx,toCreate);
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
    // 编辑角色
    ['POST', '/role/update', Meta.needLogin().needAccess(["role.update"])],
    async function (ctx, next) {
        const self = this;
        try {

            const toUpdate = ctx.request.body;
            // 调用service获取返回数据
            const result = await sysService.updateRole(ctx,toUpdate);
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
    // 从角色中移除N个用户
    ['POST', '/role/removeUser', Meta.needLogin().needAccess(["role.update"])],
    async function (ctx, next) {
        const self = this;
        try {

            //获取从哪个角色、移除哪几个用户（id数组）
            const {roleId,userIds} = ctx.request.body;
            // 调用service获取返回数据
            const result = await sysService.removeRoleUser(ctx,{roleId,userIds});
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
    // 新增N个用户到角色中
    ['POST', '/role/addUser', Meta.needLogin().needAccess(["role.update"])],
    async function (ctx, next) {
        const self = this;
        try {

            //获取从哪个角色、移除哪几个用户（id数组）
            const {roleId,userIds} = ctx.request.body;
            // 调用service获取返回数据
            const result = await sysService.addRoleUser(ctx,{roleId,userIds});
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
    // 从角色中移除N个权限
    ['POST', '/role/removeAccess', Meta.needLogin().needAccess(["role.update"])],
    async function (ctx, next) {
        const self = this;
        try {

            //获取从哪个角色、移除哪几个权限（id数组）
            const {roleId,accessIds} = ctx.request.body;
            // 调用service获取返回数据
            const result = await sysService.removeRoleAccess(ctx,{roleId,accessIds});
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
    // 新增N个权限到角色中
    ['POST', '/role/addAccess', Meta.needLogin().needAccess(["role.update"])],
    async function (ctx, next) {
        const self = this;
        try {

            //获取从哪个角色、移除哪几个权限（id数组）
            const {roleId,accessIds} = ctx.request.body;
            // 调用service获取返回数据
            const result = await sysService.addRoleAccess(ctx,{roleId,accessIds});
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