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
							util.get("../ajax/sys/user/id/" + $org.attr("userId"), null, function(rd) {
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
				root.find(".opt-role").on("click", function() {
					var $user = root.find("td.opt-check>i.checked");
					if($user.length) {
						if($user.length > 1) {
							util.alert("只能选择一个用户");
						} else {
							var ud = {
									id: $user.attr("userId"),
									name: $user.parent().parent().children(".data-name").text(),
									mobile: $user.parent().parent().children(".data-mobile").text(),
									email: $user.parent().parent().children(".data-email").text(),
									userRoles: null,
									roles: null
								},
								sm = function() {
									if(ud.userRoles && ud.roles) {
										spa.showModal("sys_user_role", ud);
									}
								};
							util.get("../ajax/sys/role/all", null, function(rd) {
								ud.roles = rd;
								sm();
							});
							util.get("../ajax/sys/userRole/user/" + ud.id, null, function(rd) {
								if(rd) {
									ud.userRoles = rd;
									sm();
								} else {
									util.alert("用户不存在了");
								}
							});
						}
					} else {
						util.alert("请选择一个用户");
					}
				});
				root.find(".opt-right").on("click", function() {
					var $user = root.find("td.opt-check>i.checked");
					if($user.length) {
						if($user.length > 1) {
							util.alert("只能选择一个用户");
						} else {
							var ud = {
									id: $user.attr("userId"),
									name: $user.parent().parent().children(".data-name").text(),
									mobile: $user.parent().parent().children(".data-mobile").text(),
									email: $user.parent().parent().children(".data-email").text(),
									userRights: null,
									rights: null
								},
								sm = function() {
									if(ud.userRights && ud.rights) {
										spa.showModal("sys_user_right", ud);
									}
								};
							util.get("../ajax/sys/right/all", null, function(rd) {
								ud.rights = rd;
								sm();
							});
							util.get("../ajax/sys/user/right/" + ud.id, null, function(rd) {
								if(rd) {
									ud.userRights = rd;
									sm();
								} else {
									util.alert("用户不存在了");
								}
							});
						}
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