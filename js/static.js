/**
 * Created by TT on 2017/7/7.
 */
!(function () {
    $.use(["dict"], function (dict) {
        dict.set("user_info_state", [{code: "1", caption: "未提交", enabled: true}, {
            code: "2", caption: "待审核", enabled: true
        }, {
            code: "3", caption: "审核通过", enabled: true
        }, {
            code: "4", caption: "审核失败", enabled: true}]);
        dict.set("user_degree", [{code: "博士", caption: "博士", enabled: true}, {
            code: "硕士", caption: "硕士", enabled: true
        }, {
            code: "学士", caption: "学士", enabled: true
        }, {
            code: "大专", caption: "大专", enabled: true
        }, {
            code: "其他", caption: "其他", enabled: true}]);
        dict.set("authentication", [{code: "0", caption: "普通用户", enabled: true}, {
            code: "1", caption: "科研工作者", enabled: true
        }, {
            code: "2", caption: "企业高管", enabled: true
        }, {
            code: "3", caption: "在校生", enabled: true
        }, {
            code: "4", caption: "技术人员", enabled: true
        }, {
            code: "5", caption: "HR/猎头", enabled: true
        }, {
            code: "6", caption: "销售人员", enabled: true
        }, {
            code: "7", caption: "投资方", enabled: true
        }, {
            code: "8", caption: "咨询顾问", enabled: true}]);
        dict.set("user_info_state_review", [{
            code: "3", caption: "审核通过", enabled: true
        }, {
            code: "4", caption: "审核失败", enabled: true}]);
        dict.set("user_info_state_check", [{
            code: "2", caption: "待审核", enabled: true
        }, {
            code: "3", caption: "审核通过", enabled: true
        }, {
            code: "4", caption: "审核失败", enabled: true}]);
        dict.set("auth_status", [{
            code: "0", caption: "未认证", enabled: true
        }, {
            code: "3", caption: "已认证", enabled: true}]);
    });

})();
