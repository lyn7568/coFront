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
                pdg.code.listen($.dict.doTransfer);
                root.find(".opt-query").on("click", function () {
                    pdg.load();
                });
                pdg.load();
                root.find(".dt-tpl").on("click", "th.opt-check>i.icon-st-check", function () {
                    var $this = $(this);
                    $this.toggleClass("checked");
                    if ($this.hasClass("checked")) {
                        root.find(".dt-tpl td.opt-check>i.icon-st-check").addClass("checked");
                    } else {
                        root.find(".dt-tpl td.opt-check>i.icon-st-check").removeClass("checked");
                    }
                });
                root.find(".dt-tpl").on("click", "td.opt-check>i.icon-st-check", function () {
                    var $this = $(this);
                    $this.toggleClass("checked");
                });
                root.on("click", ".opt-auth", function () {
                    var demandId = $(this).parent().attr("demandId");
                    if (demandId) {
                        util.boxMsg({
                            title: "确认关闭",
                            content: "您是否要关闭选中的需求！！！！！！！！！！！！！！！！！！",
                            btns: [{
                                caption: "关闭", hand: function () {
                                    util.post("../ajax/demand/close", {
                                        id: demandId
                                    }, function () {
                                        pdg.reload();
                                    });
                                }
                            },
                                {caption: "取消"}
                            ]
                        });
                    }
                });
                root.find(".opt-edit").on("click", function () {
                    var $demand = root.find("td.opt-check>i.checked");
                    if ($demand.length) {
                        if ($demand.length > 1) {
                            util.alert("只能选择一篇需求");
                        } else {
                            util.get("../ajax/demand/id/" + $demand.attr("demandId"), null, function (rd) {
                                if (rd) {
                                    spa.showModal("sys_demand_edit", {
                                        data: rd,
                                        hand: function () {
                                            pdg.load();
                                        }
                                    })
                                }else{util.alertMsg("需求不存在",function () {
                                    pdg.load();
                                })}
                            })
                        }
                    } else {
                        util.alert("请选择一个需求");
                    }
                });
                var bindDataEvent = function () {
                    root.find(".table-opt a.title").on("click", function () {
                        var demandId = $(this).parent().attr("demandId");
                        window.open('http://www.ekexiu.com/demandShow.html?demandId=' + demandId);
                    });
                };
                pdg.code.listen(bindDataEvent);
            }
        };
    });
});