/**
 * Created by TT on 2017/10/20.
 */
;
spa_define(function () {
    return $.use(["spa", "pagedatagrid", "util"], function (spa, pdgf, util) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_result_index");
                var pdg = pdgf.build(root);
                pdg.code.shell("showDay", function (env) {
                    if (env.cd && env.cd[this.k]) {
                        var day = env.cd[this.k];
                        return day.substring(0, 4) + "年" + day.substring(4, 6) + "月" + day.substring(6, 8) + "日  " + day.substring(8, 10) + ":" + day.substring(10, 12);
                    }
                    return "";
                });
                pdg.code.listen($.dict.doTransfer);
                pdg.code.listen(function(){
                    root.find(".hand-resultId").each(function() {
                        var $e = $(this);
                        var resultId = $e.attr("resultId");
                        if (resultId) {
                            util.get("/ajax/resResult/queryResearcher", {id: resultId}, function (data) {
                                $e.text(oString(data));
                            }, {});
                            $e.removeClass("hand-resultId");
                        }
                    });
                });

                function oString(data) {
                    var arry = new Array();
                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            arry.push(data[i].name);
                        }
                    }
                    return arry.join(",");
                }

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
                root.find(".opt-new").on("click", function() {
                    spa.showModal("sys_result_new", function () {
                        pdg.load();
                    });
                });
                root.find(".opt-edit").on("click", function() {
                    var $resultId = root.find("td.opt-check>i.checked");
                    if($resultId.length) {
                        if($resultId.length > 1) {
                            util.alert("只能选择一篇科研成果");
                        } else {
                            $.util.get("../ajax/resResult/id/"+$resultId.attr("resultId"),null,function(rd){
                                if(rd){
                                    spa.showModal("sys_result_edit", {
                                        data: rd, hand: function () {
                                            pdg.reload()
                                        }
                                    })
                                }else{
                                    util.alertMsg("科研成果不存在", function(){pdg.reload();});
                                }
                            },{});
                        }
                    } else {
                        util.alert("请选择一篇科研成果");
                    }
                });
                root.find(".opt-del").on("click", function() {
                    var $resultId = root.find("td.opt-check>i.checked");
                    if($resultId.length) {
                        if($resultId.length > 1) {
                            util.alert("只能选择一个科研成果");
                        } else {
                            util.boxMsg({
                                title: "确认删除",
                                content: "您是否要删除选中的科研成果？",
                                btns: [{
                                    caption: "删除",
                                    hand: function () {
                                        util.post("../ajax/resResult/delete", {id: $resultId.attr("resultId")}, function () {
                                            pdg.reload()
                                        }, {});
                                    }
                                },
                                    {caption: "取消"}
                                ]
                            });
                        }
                    } else {
                        util.alert("请选择一个科研成果");
                    }
                });


            }, mainDestory: function () {

            }
        };
    });
});


