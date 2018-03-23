var config={
    app: {
        name: 'mall_xunfei',
        domainPrefix:"", //动态网站部署的一级目录名，为""表示端口根目录
        // domainPrefix:"/service", //动态网站部署的一级目录名，为""表示端口根目录
        version: '0.0.1'
    },
    access:{
      rootUserRoleId:1,  //根用户的角色标识  默认账户:admin/123
      rootUserAccess:"__all__"   //根用户的权限标识（front-end工程里的配置，需要与这里一致。用于区别是系统根用户）
    },
    server: {
        port: 1234
    },
    db :{
        modelPath: require('path').join(__dirname, '../app/dao/models/generated'),
        db: 'mall_xunfei',
        username: 'root',
        password: 'kaicui',
        dialect: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        timezone:'+08:00', //很重要，sequenlize会根据时区，自动处理 写入、和读取日期时间的数值转换，方便
        pool: {
            maxConnections: 10,
            minConnections: 0,
            maxIdleTime: 30000
        }
    },

    template: {
        path: 'app/views',
        options: {
            map: { html: 'handlebars' }
        }
    },
    static:{
        path:"app/static"
    },
    session: {
        key: 'koa:sess2', /** (string) cookie key (default is koa:sess) */
        maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
        overwrite: true, /** (boolean) can overwrite or not (default true) */
        httpOnly: true, /** (boolean) httpOnly or not (default true) */
        signed: false, /** (boolean) signed or not (default true) */
    }
};
//如果是prod环境,则取消sql的日志
if(process.env.NODE_DEBUG && process.env.NODE_DEBUG.indexOf('debug')<0){
    console.log('关闭mysql日志')
    config.db.logging = false;
}
module.exports = config;