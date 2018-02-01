import ajaxHelper from "./ajax-helper";

/**
 * 新增 knowledge
 * @param knowledge
 */
exports.query=function (condition) {
  return ajaxHelper.get(
    `/access/query`,
      condition
  )
};

    
