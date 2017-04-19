;
spa_define(function () {
    return $.use(["spa", "code", "form", "util", "dict"], function (spa, code, form, util, dict) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_orgapply_index");
                var qf = form.build(root.find(".queryForm"));
                var cr = code.parseCode(root.find(".dt-tpl"));
                var queryBtn = root.find(".query-from .icon-search");
                // var authBtn = root.find(".opt-auth");

                cr.shell("showDay", function (env) {
                    if (env.cd && env.cd[this.k]) {
                        var day = env.cd[this.k];
                        return day.substring(0, 4) + "年" + day.substring(4, 6) + "月" + day.substring(6, 8) + "日";
                    }
                    return "";
                });

                root.on("click",".opt-auth",function () {
                    $.util.get("../ajax/authApply/orgInfo/"+$(this).parent().attr("authApplyId"),null,function(rd){
                        if(rd){
                            spa.showModal("sys_orgapply_edit", { data:rd, hand: function() { load() } })
                        }else{
                            util.alertMsg("请求不存在", function(){load();});
                        }
                    });
                });

                var tableData = {data: []},
                    allData = [];
                var query = function () {
                    var val = qf.item("qn").get();
                    if (val) {
                        var td = tableData.data = [];
                        for (var i = 0; i < allData.length; ++i) {
                            var item = allData[i];
                            if (item && item.name && item.name.indexOf(val) >= 0) {
                                td.push(item);
                            }
                        }
                    } else {
                        tableData.data = allData;
                    }
                    cr.val(tableData.data);
                };
                var load = function () {
                    util.get("../ajax/authApply/qaOrg", null, function (data) {
                        allData = data || [];
                        query();
                    }, {});
                };
                queryBtn.on("click", query);
                cr.listen(dict.doTransfer);
                load();
            }, mainDestory: function () {

            }
        };
    });
});