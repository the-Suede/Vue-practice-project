export * from './request';
//格式化时间
export const formatTime = function (date, fuhao) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = month >= 10 ? month : "0" + month;
    var day = date.getDate();
    // 如果 日期是 10号之后的 直接写本身，如果日期小于 10 的是，需要在日期前面 +0
    day = day >= 10 ? day : "0" + day;
    // var hours = date.getHours();
    // var min = date.getMinutes();
    // var sec = date.getSeconds();
    // var week = date.getDay(); //返回值的是 数字

    // var arr = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    // week = arr[week];

    fuhao = fuhao ? fuhao : "-";
    // 如果不传递符号这个参数的时候  ，需要做一个处理
    // return `${year}${fuhao}${month}${fuhao}${day}  ${hours}:${min}:${sec}`
    return `${year}${fuhao}${month}${fuhao}${day}`
}