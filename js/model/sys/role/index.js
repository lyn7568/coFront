;
spa_define(function() {
	return $.use(["spa", "code", "form", "util", "dict"], function(spa, code, form, util, dict) {
		return {
			main: function() {
				var root = spa.findInMain(".sys_role_index");
				var qf = form.build(root.find(".queryForm"));
				var cr = code.parseCode(root.find(".dt-tpl"));
				var queryBtn = root.find(".queryForm .icon-search");
				var newBtn = root.find(".opt-new");
				root.on("click", ".opt-del", function() {
					var resId = $(this).parent().attr("roleId");
					if(resId) {
						util.boxMsg({
							title: "确认删除",
							content: "您是否要删除选中的角色信息,角色信息删除后不可恢复！！！！！！！！！！！！！！！！！！",
							btns: [{
									caption: "删除",
									hand: function() {
										util.del("../ajax/sys/role/" + resId, load, {});
									}
								},
								{ caption: "取消" }
							]
						});
					}
				});
				root.on("click", ".opt-display", function() {
					var rId = $(this).parent().attr("roleId");
					if(rId) {
						var role = allData.find(function(item) { return item.id === rId });
						if(role) {
							util.get("../ajax/sys/right/all", null, function(data) {
								spa.showModal("sys_role_edit", { data: role, rights: data, hand: load });
							});
						}
					}
				});
				newBtn.on("click", function() {
					util.get("../ajax/sys/right/all", null, function(data) {
						spa.showModal("sys_role_new", { data: data, hand: load });
					});
				});
				var tableData = { data: [] },
					allData = [];
				var query = function() {
					var val = qf.item("qn").get();
					if(val) {
						var td = tableData.data = [];
						for(var i = 0; i < allData.length; ++i) {
							var item = allData[i];
							if(item && item.name && item.name.indexOf(val) >= 0) {
								td.push(item);
							}
						}
					} else {
						tableData.data = allData;
					}
					cr.val(tableData.data);
				};
				var load = function() {
					util.get("../ajax/sys/role/all", null, function(data) {
						allData = data || [];
						query();
					}, {});
				};

				queryBtn.on("click", query);
				cr.listen(dict.doTransfer)
				load();
			},
			mainDestory: function() {

			}
		};
	});
});