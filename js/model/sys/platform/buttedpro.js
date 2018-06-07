/**
 * Created by TT on 2018/5/25.
 */
;
spa_define(function () {
    return $.use(["spa", "pagedatagrid", "util","form"], function (spa, pdgf, util,form) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_buttedpro_index");
                var pdg = pdgf.build(root);
                pdg.code.shell("showDay", function (env) {
                    if (env.cd && env.cd[this.k]) {
                        var day = env.cd[this.k];
                        return day.substring(0, 4) + "年" + day.substring(4, 6) + "月" + day.substring(6, 8) + "日  " + day.substring(8, 10) + ":" + day.substring(10, 12);
                    }
                    return "";
                });
                pdg.code.listen($.dict.doTransfer);
                root.find(".opt-query").on("click", function () {
                    if(pdg.form.val().pid == null){
                        util.alert("请先选择一个平台");
                        return;
                    }
                    pdg.load();
                });
                if (pdg.form.val().pid == null) {
                    root.find(".ifempty").hide();
                }
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
                    var pid = pdg.form.val().pid;
                    if(pid==null) {
                        util.alert("请先选择一个平台");
                        return;
                    }
                    spa.showModal("sys_buttedpro_new", {
                        data:pid,
                        hand: function() {
                            pdg.reload()
                        }
                    })
                });

                root.find(".opt-del").on("click", function () {
                    var $proId = root.find("td.opt-check>i.checked");
                    if ($proId.length) {
                        if ($proId.length > 1) {
                            util.alert("只能选择一个专家");
                        } else {
                            var proId = $proId.attr("proId");
                            var platformId = pdg.form.val().pid;
                            util.boxMsg({
                                title: "确认删除",
                                content: "您是否要删除选中的对接专家？",
                                btns: [{
                                    caption: "删除",
                                    hand: function () {
                                        util.post(baseUrl + "/ajax/platform/buttedProfessor/delete", {
                                            uid: proId,
                                            pid: platformId
                                        }, function () {
                                            pdg.reload()
                                        }, {});
                                    }
                                },
                                    {caption: "取消"}
                                ]
                            });
                        }
                    } else {
                        util.alert("请选择一个专家");
                    }
                });
                root.on("click", "div .select-item", function() {
                    pdg.load();
                });

            }, mainDestory: function () {

            }
        };
    });
});
