
//这里的ENV是webpack的definePlugin构建过程中替换的。表示当前构建环境
import app from "../store/modules/app";

var env = ENV;

let root_user_access = "__all__"; //表示系统根用户的权限标识。具备此权限标识的用户，不受任何权限约束


let appConfigs={
    development:{
        dynamicDomain:"http://localhost:8080" //动态服务域名
    },
    production:{
        dynamicDomain:"http://admin.xunfei.cn" //动态服务域名
    }
};




module.exports = {
  root_user_access,
  // staticDomain,
    ...appConfigs[env]
}