//变量me，代表当前用户，cancel功能，使用制定消息和HTTP状态吗，结束一个请求。该代码，允许有权限的用户，和管理员用户访问，单其他请求都会用401状态吗结束，这代表客户端是没有权限做请求
if (me === undefined || me.username != "admin") {
    cancel("No authorization", 401);
}