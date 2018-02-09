import ajaxHelper from "./ajax-helper";

exports.query=function (condition) {
  return ajaxHelper.get(
    `/access/query`,
      condition
  )
};
exports.create=function ( { name, desc ,enable }) {
  return ajaxHelper.post(
    `/access/create`,
      { name, desc ,enable }
  )
};

exports.update=function ( {id, name, desc ,enable }) {
  return ajaxHelper.post(
    `/access/update`,
      {id, name, desc ,enable }
  )
};

exports.queryAllAndRoleAccess=function ({roleId}) {
    return ajaxHelper.get(
        `/access/queryAllAndRoleAccess`,
        {roleId}
    )
};

    
