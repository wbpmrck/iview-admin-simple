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

    
