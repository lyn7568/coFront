;
spa_define(function () {
    return $.use(["spa", "pagedatagrid", "util"], function (spa, pdgf, util) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_org_index");
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
                    root.find(".table-opt a.name").on("click", function () {
                        var orgId = $(this).parent().attr("orgId");
                        window.open('http://www.ekexiu.com/cmpInforShow.html?orgId=' + orgId);
                    })
                });
                root.find(".opt-query").on("click", function () {
                    pdg.load();
                });
                pdg.load();
                root.find(".opt-new").on("click", function () {
                    spa.showModal("sys_org_new", function () {
                        pdg.load()
                    });
                });
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
                root.find(".opt-edit").on("click", function () {
                    var $org = root.find("td.opt-check>i.checked");
                    if ($org.length) {
                        if ($org.length > 1) {
                            util.alert("只能选择一个用户");
                        } else {
                            util.get("../ajax/sys/org/queryAccount/" + $org.attr("orgId"), null, function (data) {
                                if (data) {
                                    spa.showModal("sys_org_edit", {
                                        data: data,
                                        hand: function () {
                                            pdg.reload()
                                        }
                                    })
                                } else {
                                    util.alert("用户不存在了", function () {
                                        pdg.reload();
                                    });
                                }
                            }, {});
                        }
                    } else {
                        util.alert("请选择一个用户");
                    }
                });
                root.find(".opt-details").on("click", function () {
                    var $org = root.find("td.opt-check>i.checked");
                    if ($org.length) {
                        if ($org.length > 1) {
                            util.alert("只能选择一个用户");
                        } else {
                            util.get("../ajax/sys/org/id/" + $org.attr("orgId"), null, function (data) {
                                if (data) {
                                    spa.showModal("sys_org_details", {
                                        data: data, hand: function () {
                                            pdg.reload()
                                        }
                                    })
                                } else {
                                    util.alert("用户不存在了", function () {
                                        pdg.reload();
                                    });
                                }
                            }, {});
                        }
                    } else {
                        util.alert("请选择一个用户");
                    }
                });
                root.find(".opt-data").on("click", function () {
                    var $org = root.find("td.opt-check>i.checked");
                    if ($org.length) {
                        if ($org.length > 1) {
                            util.alert("只能选择一个用户");
                        } else {
                            util.get("../ajax/sys/org/id/" + $org.attr("orgId"), null, function (data) {
                                if (data) {
                                    spa.showModal("sys_org_data", {
                                        data: data, hand: function () {
                                            pdg.reload()
                                        }
                                    })
                                } else {
                                    util.alert("用户不存在了", function () {
                                        pdg.reload();
                                    });
                                }
                            }, {});
                        }
                    } else {
                        util.alert("请选择一个用户");
                    }
                });
                root.find(".opt-view").on("click", function () {
                    var $org = root.find("td.opt-check>i.checked");
                    if ($org.length) {
                        if ($org.length > 1) {
                            util.alert("只能选择一个用户");
                        } else {
                            window.open('http://www.ekexiu.com/cmpInforShow.html?orgId=' + $org.attr("orgId"));
                        }
                    } else {
                        util.alert("请选择一个用户");
                    }
                });

            }, mainDestory: function () {

            }
        };
    });
});