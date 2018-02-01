
module.exports.hoursAfterNow = function (hours) {
    var d = new Date();

    return new Date( +d + 3600 *1000 * hours);
}