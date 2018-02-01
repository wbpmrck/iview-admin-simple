/**
 * Created by kaicui on 17/9/28.
 */


module.exports.removeEmptyCondition=function (conditionObj) {
    for(var key in conditionObj){
        if(conditionObj[key]===undefined||conditionObj[key]===null){
            delete conditionObj[key];
        }
    }
};
module.exports.setLike=function (conditionObj,key) {
        if(conditionObj[key]!==undefined){
            conditionObj[key] = {
                $like: `%${conditionObj[key] }%`
            }
        }
};
module.exports.buildPageSQL=function ({pageIndex=1,pageSize=10,needTotal=0}) {
    pageIndex = parseInt(pageIndex);
    pageSize = parseInt(pageSize);
    needTotal = parseInt(needTotal);

    return {
        offset:(pageIndex-1) * pageSize,
        limit: pageSize
    }
};