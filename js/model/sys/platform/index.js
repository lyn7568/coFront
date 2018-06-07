/**
 * Created by TT on 2018/5/23.
 */
;
spa_define(function () {
    return $.use(["spa", "pagedatagrid", "util"], function (spa, pdgf, util) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_platform_index");
                var pdg = pdgf.build(root);
                pdg.code.shell("showDay", function (env) {
                    if (env.cd && env.cd[this.k]) {
                        var day = env.cd[this.k];
                        return day.substring(0, 4) + "年" + day.substring(4, 6) + "月" + day.substring(6, 8) + "日";
                    }
                    return "";
                });
                pdg.code.listen($.dict.doTransfer);
                pdg.code.listen(function () {
                    // root.find(".table-opt a.name").on("click", function () {
                    //     var platformId = $(this).parent().attr("platformId");
                    //     //todo:点击名字跳转
                    // });
                    root.find(".hand-state").each(function () {
                        var $e = $(this);
                        var platformId = $e.attr("platformId");
                        if (platformId) {
                            util.get(baseUrl+"/ajax/platformConsole/queryAccount/" + platformId, null, function (data) {
                                $e.text(data.state);
                            }, {});
                            $e.removeClass("hand-state");
                        }
                    })
                });
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
                root.find(".opt-new").on("click", function () {
                    spa.showModal("sys_platform_new", function () {
                        pdg.load()
                    });
                });
                root.find(".opt-edit").on("click", function () {
                    var $platform = root.find("td.opt-check>i.checked");
                    if ($platform.length) {
                        if ($platform.length > 1) {
                            util.alert("只能选择一个平台");
                        } else {
                            util.get(baseUrl+"/ajax/platformConsole/queryAccount/" + $platform.attr("platformId"), null, function (data) {
                                if (data) {
                                    spa.showModal("sys_platform_edit", {
                                        data: data,
                                        hand: function () {
                                            pdg.load()
                                        }
                                    })
                                } else {
                                    util.alert("平台不存在了", function () {
                                        pdg.load();
                                    });
                                }
                            }, {});
                        }
                    } else {
                        util.alert("请选择一个平台");
                    }
                });
                root.find(".opt-details").on("click", function () {
                    var $platform = root.find("td.opt-check>i.checked");
                    if ($platform.length) {
                        if ($platform.length > 1) {
                            util.alert("只能选择一个平台");
                        } else {
                            util.get(baseUrl+"/ajax/platform/info", {id: $platform.attr("platformId")}, function (data) {
                                if (data) {
                                    spa.showModal("sys_platform_details", {
                                        data: data, hand: function () {
                                            pdg.load()
                                        }
                                    })
                                } else {
                                    util.alert("平台不存在了", function () {
                                        pdg.load();
                                    });
                                }
                            }, {});
                        }
                    } else {
                        util.alert("请选择一个平台");
                    }
                });
                // root.find(".opt-view").on("click", function () {
                //     var $platform = root.find("td.opt-check>i.checked");
                //     if ($platform.length) {
                //         if ($platform.length > 1) {
                //             util.alert("只能选择一个平台");
                //         } else {
                //             //todo:跳转平台
                //             // window.open(baseUrl+'/cmpInforShow.html?platformId=' + $platform.attr("platformId"));
                //         }
                //     } else {
                //         util.alert("请选择一个平台");
                //     }
                // });

            }, mainDestory: function () {

            }
        };
    });
});