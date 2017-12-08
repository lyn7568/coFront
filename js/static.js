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
            code: "4", caption: "审核失败", enabled: true
        }]);
        dict.set("user_degree", [{code: "博士", caption: "博士", enabled: true}, {
            code: "硕士", caption: "硕士", enabled: true
        }, {
            code: "学士", caption: "学士", enabled: true
        }, {
            code: "大专", caption: "大专", enabled: true
        }, {
            code: "其他", caption: "其他", enabled: true
        }]);
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
            code: "8", caption: "咨询顾问", enabled: true
        }]);
        dict.set("user_info_state_review", [{
            code: "3", caption: "审核通过", enabled: true
        }, {
            code: "4", caption: "审核失败", enabled: true
        }]);
        dict.set("user_info_state_check", [{
            code: "2", caption: "待审核", enabled: true
        }, {
            code: "3", caption: "审核通过", enabled: true
        }, {
            code: "4", caption: "审核失败", enabled: true
        }]);
        dict.set("auth_status", [{
            code: "0", caption: "未认证", enabled: true
        }, {
            code: "3", caption: "已认证", enabled: true
        }]);

        //region Description 日期数据字典
        var y = new Date().getFullYear();
        var eduYear = [];
        eduYear.push({code: "至今", caption: "至今", enabled: true});
        for (var i = y; i > y - 60; i--) {
            eduYear.push({code: String(i), caption: String(i), enabled: true});
        }
        dict.set("edu_year", eduYear);

        var honorYear = [];
        for (var i = y; i > y - 60; i--) {
            honorYear.push({code: String(i), caption: String(i), enabled: true});
        }
        dict.set("honor_year", honorYear);

        var dateStart = [];
        for (var i = y; i > y - 60; i--) {
            dateStart.push({
                code: String(i),
                caption: String(i),
                enabled: true,
                children: [{
                    code: String(i) + "01",
                    caption: String(i) + "年1月",
                    "enabled": true
                }, {code: String(i) + "02", caption: String(i) + "年2月", "enabled": true}, {
                    code: String(i) + "03",
                    caption: String(i) + "年3月",
                    "enabled": true
                }, {code: String(i) + "04", caption: String(i) + "年4月", "enabled": true}, {
                    code: String(i) + "05",
                    caption: String(i) + "年5月",
                    "enabled": true
                }, {code: String(i) + "06", caption: String(i) + "年6月", "enabled": true}, {
                    code: String(i) + "07",
                    caption: String(i) + "年7月",
                    "enabled": true
                }, {code: String(i) + "08", caption: String(i) + "年8月", "enabled": true}, {
                    code: String(i) + "09",
                    caption: String(i) + "年9月",
                    "enabled": true
                }, {code: String(i) + "10", caption: String(i) + "年10月", "enabled": true}, {
                    code: String(i) + "11",
                    caption: String(i) + "年11月",
                    "enabled": true
                }, {code: String(i) + "12", caption: String(i) + "年12月", "enabled": true}]
            });
        }
        dict.set("date_start", dateStart);

        var dateStop = [];
        dateStop.push({code: "至今", caption: "至今", enabled: true});
        for (var i = y; i > y - 60; i--) {
            dateStop.push({
                code: String(i),
                caption: String(i),
                enabled: true,
                children: [{
                    code: String(i) + "01",
                    caption: String(i) + "年1月",
                    "enabled": true
                }, {code: String(i) + "02", caption: String(i) + "年2月", "enabled": true}, {
                    code: String(i) + "03",
                    caption: String(i) + "年3月",
                    "enabled": true
                }, {code: String(i) + "04", caption: String(i) + "年4月", "enabled": true}, {
                    code: String(i) + "05",
                    caption: String(i) + "年5月",
                    "enabled": true
                }, {code: String(i) + "06", caption: String(i) + "年6月", "enabled": true}, {
                    code: String(i) + "07",
                    caption: String(i) + "年7月",
                    "enabled": true
                }, {code: String(i) + "08", caption: String(i) + "年8月", "enabled": true}, {
                    code: String(i) + "09",
                    caption: String(i) + "年9月",
                    "enabled": true
                }, {code: String(i) + "10", caption: String(i) + "年10月", "enabled": true}, {
                    code: String(i) + "11",
                    caption: String(i) + "年11月",
                    "enabled": true
                }, {code: String(i) + "12", caption: String(i) + "年12月", "enabled": true}]
            });
        }
        dict.set("date_stop", dateStop);
        //endregion

        dict.set("org_auth_status", [{
            code: "-1", caption: "认证失败", enabled: true
        }, {
            code: "0", caption: "未认证", enabled: true
        }, {
            code: "1", caption: "待认证", enabled: true
        }, {
            code: "3", caption: "已认证", enabled: true
        }]);

        dict.set("sort_rule",[{
            code:"1",caption:"按创建时间由新到旧排序",enabled:true
        },{
            code:"2",caption:"按浏览量由高到低排序",enabled:true
        }]);

        dict.set("feedback_schema",[{
            code:"1",caption:"论文",enabled:true
        },{
            code:"2",caption:"专利",enabled:true
        },{
            code:"3",caption:"专家",enabled:true
        },{
            code:"4",caption:"机构",enabled:true
        },{
            code:"5",caption:"资源",enabled:true
        },{
            code:"6",caption:"文章",enabled:true
        }]);

        dict.set("feedback_state",[{
            code:"0",caption:"待处理",enabled:true
        },{
            code:"1",caption:"已处理",enabled:true
        }]);

        dict.set("content_type",[{
            code:"3",caption:"文章",enabled:true
        },{
            code:"2",caption:"资源",enabled:true
        },{
            code:"4",caption:"专利",enabled:true
        },{
            code:"5",caption:"论文",enabled:true
        }]);

        dict.set("active_status", [{
            code: "0", caption: "未激活", enabled: true
        }, {
            code: "1", caption: "已激活", enabled: true
        }]);

        dict.set("banner", [{
            code: "0", caption: "未设置", enabled: true
        }, {
            code: "1", caption: "个人原创", enabled: true
        }, {
            code: "2", caption: "企业原创", enabled: true
        }, {
            // code: "3", caption: "前沿动态", enabled: true
            code: "3", caption: "科研", enabled: true
        }, {
            // code: "4", caption: "学术经验", enabled: true
            code: "4", caption: "智库", enabled: true
        }, {
            // code: "5", caption: "分析检测", enabled: true
            code: "5", caption: "检测", enabled: true
        }, {
            // code: "6", caption: "会议培训", enabled: true
            code: "6", caption: "会议", enabled: true
        }, {
            // code: "7", caption: "科袖访谈", enabled: true
            code: "7", caption: "企业", enabled: true
        }, {
            // code: "8", caption: "招聘招生", enabled: true
            code: "8", caption: "招聘", enabled: true
        }, {
            // code: "9", caption: "重大新闻", enabled: true
            code: "9", caption: "新闻", enabled: true
        }]);

        dict.set("cost", [{
            code: "0", caption: "未选择", enabled: true
        },{
            code: "1", caption: "1万元以内", enabled: true
        }, {
            code: "2", caption: "1-5万元", enabled: true
        }, {
            code: "3", caption: "5-10万元", enabled: true
        }, {
            code: "4", caption: "10-20万元", enabled: true
        }, {
            code: "5", caption: "20-50万元", enabled: true
        }, {
            code: "6", caption: "50万元以上", enabled: true
        }]);

        dict.set("duration", [{
            code: "0", caption: "未选择", enabled: true
        },{
            code: "1", caption: "1个月内", enabled: true
        }, {
            code: "2", caption: "1-3个月", enabled: true
        }, {
            code: "3", caption: "3-6个月", enabled: true
        }, {
            code: "4", caption: "6-12个月", enabled: true
        }, {
            code: "5", caption: "1年以上", enabled: true
        }]);

        dict.set("demandState", [{
            code: "0", caption: "已过期", enabled: true
        },{
            code: "1", caption: "发布中", enabled: true
        }, {
            code: "2", caption: "已完成", enabled: true
        }, {
            code: "3", caption: "已关闭", enabled: true
        }]);

    });

})();
