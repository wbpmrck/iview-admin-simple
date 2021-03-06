
var map = new Map();


// map.set(
//     //登录页面
//     ["GET","/login","ALLOW_ANONYMOUS"],
//     async function(ctx,next) {
//
//         if(ctx.hasLogin()){
//             //如果已经登录，则重定向
//             ctx.response.redirect('/');
//         }else{
//             // this.session.user = {AccountName:"kaicui"};
//             await ctx.render('login.html', {
//                 userInfo: JSON.stringify(ctx.getSessionUser())
//             });
//         }
//         await next();
//     }
// );
map.set(
    //首页，允许匿名访问
    ["GET","/"],
    async function (ctx,next) {
        await ctx.render('index.html', {
            user: JSON.stringify(ctx.getSessionUser()) ||"undefined",
            title:"首页",
            // user: JSON.stringify({id:1})
        });
        await next();
    }
);

module.exports=map;