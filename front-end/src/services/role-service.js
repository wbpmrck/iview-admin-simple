import ajaxHelper from "./ajax-helper";

exports.query=function (condition) {
  return ajaxHelper.get(
    `/role/query`,
      condition
  )
};
exports.create=function ( { name, desc ,enable }) {
  return ajaxHelper.post(
    `/role/create`,
      { name, desc ,enable }
  )
};

exports.update=function ( {id, name, desc ,enable }) {
  return ajaxHelper.post(
    `/role/update`,
      {id, name, desc ,enable }
  )
};


/**
 * 从角色中删除用户列表
 * @param roleId
 * @param userIds：id数组
 * @returns {*}
 */
exports.removeUser=function ( {roleId,userIds}) {
  return ajaxHelper.post(
    `/role/removeUser`,
      {roleId,userIds}
  )
};
exports.removeAccess=function ( {roleId,accessIds}) {
  return ajaxHelper.post(
    `/role/removeAccess`,
      {roleId,accessIds}
  )
};


/**
 * 添加用户列表到角色
 * @param roleId
 * @param userIds：id数组
 * @returns {*}
 */
exports.addUser=function ( {roleId,userIds}) {
  return ajaxHelper.post(
    `/role/addUser`,
      {roleId,userIds}
  )
};

exports.addAccess=function ( {roleId,accessIds}) {
  return ajaxHelper.post(
    `/role/addAccess`,
      {roleId,accessIds}
  )
};


