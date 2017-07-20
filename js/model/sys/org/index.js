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
                // root.find(".opt-del").on("click", function() {
                // 	var $org = root.find("td.opt-check>i.checked");
                // 	if($org.length) {
                // 		var ret =[];
                // 		$org.each(function(){
                // 			ret.push($(this).attr("orgId"));
                // 		});
                // 		util.boxMsg({
                // 			title: "确认删除",
                // 			content: "您是否要删除选中的机构信息,机构信息删除后不可恢复！！！！！！！！！！！！！！！！！！",
                // 			btns: [{ caption: "删除", hand: function() {
                // 				util.post("../ajax/sys/org/del",{ids:ret},function(){pdg.load()},{});
                // 			} },
                // 				{ caption: "取消" }
                // 			]
                // 		});
                // 	} else {
                // 		util.alert("请选择一个机构");
                // 	}
                // });
            }, mainDestory: function () {

            },
        };
    });
});