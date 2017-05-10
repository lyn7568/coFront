/**
 * Created by TT on 2017/5/8.
 */
;
spa_define(function () {
    return $.use(["spa", "pagedatagrid", "util"], function (spa, pdgf, util) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_demand_index");
                var pdg = pdgf.build(root);
                pdg.code.shell("showDay", function (env) {
                    if (env.cd && env.cd[this.k]) {
                        var day = env.cd[this.k];
                        return day.substring(0, 4) + "-" + day.substring(4, 6) + "-" + day.substring(6, 8);
                    }
                    return "";
                });
                pdg.code.shell("status", function (env) {
                    var v = env.cd[this.k];
                    return v === "1" ? "关闭需求" : (v === "0" ? "打开需求" : "");
                });
                pdg.code.shell("status2", function (env) {
                    var v = env.cd[this.k];
                    return v === "1" ? "发布中" : (v === "0" ? "已关闭" : "");
                });
                pdg.code.listen($.dict.doTransfer);
                root.find(".opt-query").on("click", function () {
                    pdg.load();
                });
                pdg.load();
                root.on("click", ".icon-eye-open", function () {
                    var $this = $(this);
                    var demandId = $this.parent().attr("demandId");
                    util.get("../ajax/demand/id/" + demandId, null, function (rd) {
                        if (rd) {
                            spa.showModal("sys_demand_edit", {
                                data: rd,
                                hand: function () {
                                    pdg.load()
                                }
                            })
                        } else {
                            util.alert("客户选择有误", function () {
                                pdg.load();
                            });
                        }
                    }, {});
                });
                root.on("click", ".opt-auth", function () {
                    var demandId = $(this).parent().attr("demandId");
                    var demandStatus = $(this).parent().attr("demandStatus");
                    if (demandId) {
                        if (demandStatus == "1") {
                            util.boxMsg({
                                title: "确认关闭",
                                content: "您是否要关闭选中的需求！！！！！！！！！！！！！！！！！！",
                                btns: [{
                                    caption: "关闭", hand: function () {
                                        util.post("../ajax/demand/close", {
                                            demandId: demandId,
                                            demandStatus: demandStatus
                                        }, function () {
                                            pdg.load();
                                        });
                                    }
                                },
                                    {caption: "取消"}
                                ]
                            });
                        }if (demandStatus == "0"){
                            util.boxMsg({
                                title: "确认打开",
                                content: "您是否要打开选中的需求",
                                btns: [{
                                    caption: "打开", hand: function () {
                                        util.post("../ajax/demand/close", {
                                            demandId: demandId,
                                            demandStatus: demandStatus
                                        }, function () {
                                            pdg.load();
                                        });
                                    }
                                },
                                    {caption: "取消"}
                                ]
                            });
                        }
                    }
                });
            }
        };
    });
});