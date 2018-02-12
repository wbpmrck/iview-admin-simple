import ajaxHelper from "./ajax-helper";


exports.login=function ({accountName,password}) {
  return ajaxHelper.post(
    `/user/login`,
    {accountName,password}
  )
};
exports.logout=function () {
  return ajaxHelper.post(
    `/user/logout`,
    {}
  )
};
exports.regist=function ({accountName,password,enable}) {
  return ajaxHelper.post(
    `/user/regist`,
    {accountName,password,enable}
  )
};
exports.queryAllAndRoleUser=function ({roleId}) {
  return ajaxHelper.get(
    `/user/queryAllAndRoleUser`,
    {roleId}
  )
};

exports.queryAccounts=function (condition) {
    return ajaxHelper.get(
        `/account/query`,
        condition
    )
};

//
// /**
//  * 查询 knowledge
//  * @param name
//  */
// exports.query=function (condition) {
//
//     return ajaxHelper.get(
//         `/knowledge/query`,
//         condition
//     )
// };
//
// /**
//  * 更新单个 knowledge
//  * @param knowledge
//  */
// exports.update=function (knowledge) {
//
//     return ajaxHelper.post(
//         `/knowledge/update`,
//         knowledge
//     )
// };
// /**
//  * 新增 knowledge
//  * @param knowledge
//  */
// exports.create=function (knowledge) {
//
//     return ajaxHelper.post(
//         `/knowledge/create`,
//         knowledge
//     )
// };
    
