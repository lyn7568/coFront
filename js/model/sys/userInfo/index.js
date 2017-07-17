/**
 * Created by TT on 2017/7/7.
 */
;
spa_define(function () {
    return $.use(["spa", "pagedatagrid", "util"], function (spa, pdgf, util) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_userinfo_index");
                var pdg = pdgf.build(root);
//				validate.form(pdg.form, { name: { required: "not null", len: { val: 5, msg: "我的中国心" } } });
                root.find(".opt-query").on("click", function () {
                    pdg.load();
                });
                root.find(".opt-new").on("click", function () {
                    spa.showModal("sys_userinfo_new", function () {
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
                            util.get("../ajax/userinfo/id/" + $org.attr("userId"), null, function (data) {
                                if (data) {
                                    if (data.state == "1" || data.state == "4") {
                                        spa.showModal("sys_userinfo_edit", {
                                            data: data, hand: function () {
                                                pdg.load()
                                            }
                                        })
                                    } else {
                                        util.alert("待审核和审核通过的不可修改。");
                                    }
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
                root.find(".opt-del").on("click", function () {
                    var $org = root.find("td.opt-check>i.checked");
                    if ($org.length) {
                        if ($org.length > 1) {
                            util.alert("只能选择一个用户");
                        } else {
                            util.get("../ajax/userinfo/id/" + $org.attr("userId"), null, function (data) {
                                if (data) {
                                    if (data.state == "1" || data.state == "4") {
                                        util.boxMsg({
                                            title: "确认删除",
                                            content: "您是否要删除选中的用户信息，信息删除后不可恢复。",
                                            btns: [{
                                                caption: "删除",
                                                hand: function () {
                                                    util.del("../ajax/userinfo/del/" + $org.attr("userId"), function (code) {
                                                        if (code != 1) {
                                                            if (code == 2) {
                                                                util.alert("无法删除，请检查状态");
                                                            }
                                                            if (code == 3) {
                                                                util.alert("找不到该账户，请检查");
                                                            }
                                                        }
                                                        pdg.load()
                                                    }, {});
                                                }
                                            },
                                                {caption: "取消"}
                                            ]
                                        });
                                    } else {
                                        util.alert("待审核和审核通过的不可删除。");
                                    }
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
                    var $org = root.find("td.opt-check>i.checked");
                    if ($org.length) {
                        if ($org.length > 1) {
                            util.alert("只能选择一个用户");
                        } else {
                            util.get("../ajax/userinfo/id/" + $org.attr("userId"), null, function (data) {
                                if (data) {
                                    if (data.state == "1" || data.state == "4") {
                                        spa.showModal("sys_userinfo_details", {
                                            data: data, hand: function () {
                                                pdg.load()
                                            }
                                        })
                                    } else {
                                        util.alert("待审核和审核通过的不可修改。");
                                    }
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
                root.find(".opt-check").on("click", function () {
                    var $check = root.find("td.opt-check>i.checked");
                    if ($check.length) {
                        if ($check.length > 1) {
                            util.alert("只能选择一个用户")
                        } else {
                            util.get("../ajax/userinfo/id/" + $check.attr("userId"), null, function (data) {
                                if (data) {
                                    if (data.state == "1" || data.state == "4") {
                                        util.boxMsg({
                                            title: "提交审核",
                                            content: "请确认提交审核，提交审核后不可修改！",
                                            btns: [{
                                                caption: "确认提交", hand: function () {
                                                    util.post("../ajax/userinfo/updateState", {id: $check.attr("userId")}, function () {
                                                        pdg.load()
                                                    }, {});
                                                }
                                            }, {caption: "取消"}
                                            ]
                                        });
                                    } else {
                                        util.alert("只有未提交、审核失败的可以点击");
                                    }
                                } else {
                                    util.alert("用户不存在了", function () {
                                        pdg.load();
                                    });
                                }
                            });
                        }
                    } else {
                        util.alert("请选择一名专家");
                    }
                });
                pdg.code.listen($.dict.doTransfer);
                pdg.load();

            },
            mainDestory: function () {

            },
        };
    });
});