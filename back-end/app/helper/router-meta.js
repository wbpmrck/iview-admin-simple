/*
    用于给路由对象添加meta信息
 */

function Meta({loginNeed=false,accessNeed=[]}){
    var self = this;
    self.loginNeed = loginNeed;
    self.accessNeed = accessNeed;
}
Meta.prototype.needLogin=function () {
    this.loginNeed = true;
    return this;
};
/**
 * 设置router需要权限
 * @param accessArray：权限name列表，数组的每一项都必须拥有才会通过ACCESS检查
 * @returns {Meta}
 */
Meta.prototype.needAccess=function (accessArray) {
    this.accessNeed = accessArray||[];
    return this;
};

module.exports={
    needLogin:function () {
        return new Meta({loginNeed:true});
    },
    /**
     * 设置router需要权限
     * @param accessArray：权限name列表，数组的每一项都必须拥有才会通过ACCESS检查
     * @returns {Meta}
     */
    needAccess:function (accessArray) {
        return new Meta({accessNeed:accessArray});
    }
}