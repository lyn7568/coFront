/**
 * Created by TT on 2017/7/12.
 */
;
spa_define(function () {
    return $.use(["spa", "pagedatagrid", "util"], function (spa, pdgf, util) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_userinfo_check");
                var pdg = pdgf.build(root);
                root.find(".opt-query").on("click", function () {
                    pdg.load();
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
                root.find(".opt-examine").on("click", function () {
                    var $org = root.find("td.opt-check>i.checked");
                    if ($org.length) {
                        if ($org.length > 1) {
                            util.alert("只能选择一个用户");
                        } else {
                            util.get("../ajax/userinfo/id/" + $org.attr("userId"), null, function (data) {
                                if (data) {
                                        spa.showModal("sys_userinfo_examine", {
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
                root.find(".opt-review").on("click", function () {
                    var $check = root.find("td.opt-check>i.checked");
                    if ($check.length) {
                        if ($check.length > 1) {
                            util.alert("只能选择一个用户")
                        } else {
                            util.get("../ajax/userinfo/id/" + $check.attr("userId"), null, function (data) {
                                if (data) {
                                    if (data.state == "2") {
                                        spa.showModal("sys_userinfo_review", {
                                            data: data, hand: function () {
                                                pdg.reload();
                                            }
                                        })
                                    } else {
                                        util.alert("只有待审核的可以点击");
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