/**
 * Created by TT on 2017/8/3.
 */
;
spa_define(function () {
    return $.use(["spa", "pagedatagrid", "util","win"], function (spa, pdgf, util,win) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_professornew_index");
                var pdg = pdgf.build(root);
                pdg.code.shell("showDay", function (env) {
                    if (env.cd && env.cd[this.k]) {
                        var day = env.cd[this.k];
                        return day.substring(0, 4) + "年" + day.substring(4, 6) + "月" + day.substring(6, 8) + "日";
                    }
                    return "";
                });
                pdg.code.shell("bool", function (env) {
                    var v = env.cd[this.k];
                    return v === 1 ? "是" : (v === 0 ? "否" : "");
                });
                pdg.code.listen($.dict.doTransfer);
                pdg.code.listen(function () {
                    root.find(".hand-fans").each(function () {
                        var $e = $(this);
                        var collectionid = $e.attr("id");
                        util.get("/ajax/content/countProfessor", {id: collectionid, type: 1}, function (data) {
                            $e.text(data);
                        }, {});
                        $e.removeClass("hand-fans");
                    });
                    root.find(".table-opt a.name").on("click", function () {
                        var professorId = $(this).parent().attr("professorId");
                        win.open('http://www.ekexiu.com/userInforShow.html?professorId=' + professorId);
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
                    spa.showModal("sys_professornew_new", function () {
                        pdg.load()
                    });
                });
                root.find(".opt-edit").on("click", function () {
                    var $org = root.find("td.opt-check>i.checked");
                    if ($org.length) {
                        if ($org.length > 1) {
                            util.alert("只能选择一个用户");
                        } else {
                            util.get("../ajax/sys/professor/luserId/" + $org.attr("professorId"), null, function (data) {
                                if (data) {
                                    spa.showModal("sys_professornew_edit", {
                                        data: data, name: $org.attr("na"), hand: function () {
                                            pdg.reload()
                                        }
                                    })
                                } else {
                                    util.alert("用户不存在了", function () {
                                        pdg.load();
                                    });
                                }
                            }, {});
                        }
                    } else {
                        util.alert("请选择一个用户");
                    }
                });
                root.find(".opt-details").on("click", function () {
                    var $professor = root.find("td.opt-check>i.checked");
                    if ($professor.length) {
                        if ($professor.length > 1) {
                            util.alert("只能选择一个用户");
                        } else {
                            util.get("../ajax/sys/professor/detail/" + $professor.attr("professorId"), null, function (data) {
                                if (data) {
                                    // if (data.activeStatus != "1") {
                                    spa.showModal("sys_professornew_details", {
                                        data: data, hand: function () {
                                            pdg.reload()
                                        }
                                    });
                                    // }else {
                                    //     util.alert("只能修改未激活的用户");
                                    // }
                                } else {
                                    util.alert("用户不存在了", function () {
                                        pdg.load();
                                    });
                                }
                            }, {});
                        }
                    } else {
                        util.alert("请选择一个用户");
                    }
                });
                root.find(".opt-data").on("click", function () {
                    var $professor = root.find("td.opt-check>i.checked");
                    if ($professor.length) {
                        if ($professor.length > 1) {
                            util.alert("只能选择一个用户");
                        } else {
                            util.get("../ajax/sys/professor/id/" + $professor.attr("professorid"), null, function (data) {
                                if (data) {
                                    spa.showModal("sys_professornew_data", {
                                        data: data, hand: function () {
                                            pdg.load()
                                        }
                                    })
                                } else {
                                    util.alert("用户不存在了", function () {
                                        pdg.load();
                                    });
                                }
                            }, {});
                        }
                    } else {
                        util.alert("请选择一个用户");
                    }
                });
                root.find(".opt-view").on("click", function () {
                    var $professor = root.find("td.opt-check>i.checked");
                    if ($professor.length) {
                        if ($professor.length > 1) {
                            util.alert("只能选择一个用户");
                        } else {
                            win.open('http://www.ekexiu.com/userInforShow.html?professorId=' + $professor.attr("professorid"));
                        }
                    } else {
                        util.alert("请选择一个用户");
                    }
                });

                root.find(".opt-photo").on("click", function () {
                    var $professor = root.find("td.opt-check>i.checked");
                    if ($professor.length) {
                        if ($professor.length > 1) {
                            util.alert("只能选择一个用户");
                        } else {
                            win.open('/html/model/sys/professornew/photo/photo-set.html?id=' + $professor.attr("professorid"));
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