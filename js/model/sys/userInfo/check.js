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
                // root.find(".dt-tpl").on("click", "th.opt-check>i.icon-st-check", function () {
                //     var $this = $(this);
                //     $this.toggleClass("checked");
                //     if ($this.hasClass("checked")) {
                //         root.find(".dt-tpl td.opt-check>i.icon-st-check").addClass("checked");
                //     } else {
                //         root.find(".dt-tpl td.opt-check>i.icon-st-check").removeClass("checked");
                //     }
                // });
                // root.find(".dt-tpl").on("click", "td.opt-check>i.icon-st-check", function () {
                //     var $this = $(this);
                //     $this.toggleClass("checked");
                // });

                root.on("click", ".opt-examine", function () {
                    var $this = $(this);
                    var $id = $this.parent().attr("userId");
                    util.get("../ajax/userinfo/id/" + $id, null, function (data) {
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
                });
                root.on("click", ".opt-review", function () {
                    var $this = $(this);
                    var $id = $this.parent().attr("userId");
                    util.get("../ajax/userinfo/id/" + $id, null, function (data) {
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
                });
                pdg.code.listen($.dict.doTransfer);
                pdg.load();

            },
            mainDestory: function () {

            },
        };
    });
});