String.prototype.trim=function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim=function(){
    return this.replace(/(^\s*)/g,"");
}
String.prototype.rtrim=function(){
    return this.replace(/(\s*$)/g,"");
}
/**
 * 显示错误信息
 * @param errMsg
 */
function showError(errMsg) {
    if($("#error_show").length>0){
        $("#error_show").text(errMsg);
    }else{
        $("#error_hide").text(errMsg);
        $("#error_hide").show();
    }
}
/**
 * 显示成功信息
 * @param msg
 */
function showOk(msg) {
    if($("#success_show").length>0){
        $("#success_show").text(errMsg);
    }else{
        $("#success_hide").text(errMsg);
        $("#success_hide").show();
    }
}
/**
 * 检查用户名格式是否正确
 * @param username
 * @returns {boolean}
 */
function checkUserName(username) {
    username=username.trim();
    return username.length>=1;
}
/**
 * 检查密码格式是否正确
 * @param pwd
 * @returns {boolean}
 */
function checkPwd(pwd) {
    pwd=pwd.trim();
    return pwd.length>=6;
}