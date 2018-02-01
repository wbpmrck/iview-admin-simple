/**
 * Created by kaicui on 16/11/17.
 * 负责 权限、角色 相关的业务逻辑处理
 */
const logger = require("../log/logger");
const resp = require("../../framework/web/responseHelper");
const arrayUtil = require("../../framework/onelib/OneLib.Utils.Array");
const {db,models} = require("../dao/orm");
const consts = require("../dao/const/const");
const co = require("co");

const config = require('config');
const sha1 = require('../../framework/onelib/OneLib.SHA1');
const validate = require("../../framework/onelib/OneLib.Validation").targetWrapper;
const queryHelper = require('../../framework/dao/queryHelper');

const dateFactory = require('../../framework/time/factory');

module.exports={
    
    
    /**
     * 注册用户信息
     * @param context
     * @param accountName：用户名
     * @param password：密码
     * @returns {Promise.<*>}
     */
    async registUser(context, { accountName, password }) {
        accountName = accountName.toString();
        password = password.toString();
        // 参数简单检查
        const validateResult = await validate(accountName, 'accountName').notNull().notEmptyStr()
            .and(password, 'password').notNull().notEmptyStr()
            .run();

        // 如果验证通过
        if (validateResult.pass) {
            // 检查用户是否存在
            const count = await models.sys_account.count({ where:{
                account_name: accountName
            }});

            // 如果用户已经存在:
            if (count) {
                return resp.failed({ code: resp.codes.USERNAME_DUMP, desc: `,用户名:${accountName}` });
            }
            // 1.创建salt
            const salt = parseInt(100000 * Math.random(), 10);

            // 2.计算md5
            const hash = sha1.encode(password + salt);

            // 3.写入
            const created = await models.sys_account.create({
                account_name: accountName,
                password_secret: hash,
                salt: salt,
            });

            await created.reload();
            if (created) {
                return resp.success({ data: {
                    id:created.id,
                    name:created.account_name,
                } });
            }
            return resp.failed({ desc: ',写入用户失败' });
        }
        return resp.failed({
            code: resp.codes.PARAM_ILLEGAL,
            desc: `${validateResult.desc}${validateResult.funcDesc}`
        });
    },
    
    
    /**
     * 用户账户登录
     * @param context：请求上下文
     * @param accountName：账户名
     * @param password：密码
     * @returns 处理结果对象
     */
    async login(context, { accountName, password }) {
        // 参数简单检查
        const validateResult = await validate(accountName, 'accountName').notNull().notEmptyStr()
            .and(password, 'password').notNull().notEmptyStr()
            .run();

        // 如果验证通过
        if (validateResult.pass) {
            // 获取用户信息
            const users = await models.sys_account.findAll({ where: {
                account_name: accountName
            } });

            // 如果用户存在:
            if (users && users.length > 0) {
                const user = users[0];
                // 计算md5
                const hash = sha1.encode(password + user.salt);

                // 比较加密串
                if (hash === user.password_secret) {
                    return resp.success({ data: user });
                }
                return resp.failed({ code: resp.codes.PASSWORD_WRONG });
            }
            return resp.failed({ code: resp.codes.NO_USER });
        }
        return resp.failed({
            code: resp.codes.PARAM_ILLEGAL,
            desc: `${validateResult.desc}${validateResult.funcDesc}`
        });
    },
    
    
    /**
     * 根据用户id，查询用户详细信息，包括权限和角色（系统根用户组，自动具备所有权限）
     * @param context
     * @param id
     * @returns {Promise.<*>}
     */
    async queryUserInfo(context, { id }) {
        // 参数简单检查
        const validateResult = await validate(id, 'id').notNull().existInTable("sys_account","id")
            .run();

        // 如果验证通过
        if (validateResult.pass) {
            let user = await models.sys_account.findAll({ where: {
                id: id
            } });
            let respData ={
                id:id,
                name:user[0].account_name,
                passwordSecret:user[0].password_secret,
                salt:user[0].salt,
            };
            // 获取用户信息
            let userInfo = await db.query(`
                select A.id as account_id,A.account_name,A.password_secret,A.salt,B.role_id,D.name as role_name
                from sys_account A INNER join sys_account_role B on A.id = B.account_id
                INNER join sys_role D on B.role_id = D.id
                
                where A.id = :id
                and D.\`enable\`=1
            `,
                    {
                        replacements: { id:id},
                        type: db.QueryTypes.SELECT
                    }
                );
            if(userInfo && userInfo.length >0){
                //检查是否系统根用户
                let userHasRoot = userInfo.filter( (u)=>{
                    return u.role_id == config.access.rootUserRoleId
                });
                if(userHasRoot.length > 0){
                    respData = {
                        id:userInfo[0].account_id,
                        name:userInfo[0].account_name,
                        passwordSecret:user[0].password_secret,
                        salt:user[0].salt,
                        role:[config.access.rootUserRoleId],
                        access:config.access.rootUserAccess
                    }
                }else{
                    // 获取用户信息
                    userInfo = await db.query(`
                        select A.id as account_id,A.account_name,A.password_secret,A.salt,B.role_id,D.name as role_name,C.access_id,E.name as access_name
                        from sys_account A INNER join sys_account_role B on A.id = B.account_id
                        INNER join sys_role_access C on B.role_id = C.role_id
                        INNER join sys_role D on B.role_id = D.id
                        INNER join sys_access E on C.access_id = E.id
                        
                        where A.id = :id
                        and D.\`enable\`=1 and E.\`enable\`=1
                    `,
                        {
                            replacements: { id:id},
                            type: db.QueryTypes.SELECT
                        }
                    );
    
                    respData = {
                        id:userInfo[0].account_id,
                        name:userInfo[0].account_name,
                        passwordSecret:user[0].password_secret,
                        salt:user[0].salt,
                        role:userInfo.map( (u)=>{
                            return u.role_id
                        }),
                        access:userInfo.map( (u)=>{
                            return {id:u.access_id,name:u.access_name}
                        })
                    };
                    arrayUtil.removeDump(respData.role);
                    arrayUtil.removeDump(respData.access,false,(a)=>{return a.id});
                }
        
            }

                return resp.success({ data: respData });
        }
        return resp.failed({
            code: resp.codes.PARAM_ILLEGAL,
            desc: `${validateResult.desc}${validateResult.funcDesc}`
        });
    },

    /*
        权限相关
     */
    
    /**
     * 查询权限列表
     * @param context
     * @param condition
     * @returns {Promise.<*>}
     */
    async queryAccess(context,condition,{pageIndex=1,pageSize=10,needTotal=0}) {
        queryHelper.removeEmptyCondition(condition);
        
        queryHelper.setLike(condition,"name");
        queryHelper.setLike(condition,"desc");

        //准备返回对象
        let ret ={
            total:0,
            data:[]
        };

        ret.data = await models.sys_access.findAll({
            where:condition,
            ...queryHelper.buildPageSQL({pageIndex,pageSize,needTotal})
        });
        if(needTotal) {
            ret.total = await models.sys_access.count({
                where:condition
            });
        }else{
            delete ret.total
        }
        return resp.success({data: ret});
    },
    /**
     * 修改权限信息
     * @param context
     * @param toUpdate
     * @returns {Promise.<*>}
     */
    async updateAccess(context,toUpdate) {
        toUpdate.update_time = new Date();
        let id = toUpdate.id;
        delete toUpdate['id'];
        // 获取用户信息
        let updated = await models.sys_access.update(toUpdate,{
            where:{
                id:id
            }
        });
        updated = updated.length>0?updated[0]:updated;//获取收到影响的行数，参考：http://docs.sequelizejs.com/class/lib/model.js~Model.html#static-method-update
        return resp.success({data: updated});
    },
    async createAccess(context, { name, desc ,enable }) {
        // 参数简单检查
        const validateResult = await validate(name, 'name').notNull().notEmptyStr()
            .and(desc, 'desc').notNull().notEmptyStr()
            .and(enable, 'enable').notNull().notEmptyStr().isOneOf(["0","1"])
            .and(name, 'name').notExistInTable("sys_access","name")
            .run();

        // 如果验证通过
        if (validateResult.pass) {
            const created = await models.sys_access.create({
                name,desc,enable
            });

            await created.reload();
            if (created) {
                return resp.success({ data: created});
            }
            return resp.failed({ desc: ',写入用户失败' });
        }
        return resp.failed({
            code: resp.codes.PARAM_ILLEGAL,
            desc: `${validateResult.desc}${validateResult.funcDesc}`
        });
    },

    /*
        角色相关
     */

    /**
     * 查询角色列表
     * @param context
     * @param condition
     * @returns {Promise.<*>}
     */
    async queryRole(context,condition) {
        queryHelper.removeEmptyCondition(condition);

        queryHelper.setLike(condition,"name");
        queryHelper.setLike(condition,"desc");
        // 获取用户信息
        const data = await models.sys_role.findAll({
            where: condition
        });
        return resp.success({data: data});
    },

}