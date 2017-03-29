;
spa_define(function() {
	return $.use(["spa", "pagedatagrid", "util"], function(spa, pdgf, util) {
		return {
			main: function() {
				var root = spa.findInMain(".sys_user_index");
				var pdg = pdgf.build(root);
				root.find(".opt-query").on("click", function() {
					pdg.load();
				});
				root.find(".opt-new").on("click", function() {
					spa.showModal("sys_user_new", function() { pdg.load() });
				});
				root.find(".dt-tpl").on("click", "th.opt-check>i.icon-st-check", function() {
					var $this = $(this);
					$this.toggleClass("checked");
					if($this.hasClass("checked")) {
						root.find(".dt-tpl td.opt-check>i.icon-st-check").addClass("checked");
					} else {
						root.find(".dt-tpl td.opt-check>i.icon-st-check").removeClass("checked");
					}
				});
				root.find(".dt-tpl").on("click", "td.opt-check>i.icon-st-check", function() {
					var $this = $(this);
					$this.toggleClass("checked");
				});
				root.find(".opt-edit").on("click", function() {
					var $org = root.find("td.opt-check>i.checked");
					if($org.length) {
						if($org.length > 1) {
							util.alertMsg("只能选择一个用户");
						} else {
							$.util.get("../ajax/sys/user/id/" + $org.attr("userId"), null, function(rd) {
								if(rd) {
									spa.showModal("sys_user_edit", { data: rd, hand: function() { pdg.load() } })
								} else {
									util.alertMsg("机构已不存在", function() { pdg.load(); });
								}
							}, {});
						}
					} else {
						util.alert("请选择一个用户");
					}
				});
				root.find(".opt-del").on("click", function() {
					var $org = root.find("td.opt-check>i.checked");
					if($org.length) {
						var ret = [];
						$org.each(function() {
							ret.push($(this).attr("userId"));
						});
						util.boxMsg({
							title: "确认删除",
							content: "您是否要删除选中的用户信息,机构信息删除后不可恢复！！！！！！！！！！！！！！！！！！",
							btns: [{
									caption: "删除",
									hand: function() {
										util.post("../ajax/sys/user/del", { ids: ret }, function() { pdg.load() }, {});
									}
								},
								{ caption: "取消" }
							]
						});
					} else {
						util.alert("请选择一个用户");
					}
				});
				pdg.load();

			},
			mainDestory: function() {

			},
		};
	});
});