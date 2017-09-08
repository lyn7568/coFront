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
                var bindDataEvent = function() {
                    root.find(".table-opt a.title").on("click", function () {
                        var demandId = $(this).parent().attr("demandId");
                        window.open('http://www.ekexiu.com/information-brow.html?demandId=' + demandId);
                    });
                };
                pdg.code.listen(bindDataEvent);
            }
        };
    });
});