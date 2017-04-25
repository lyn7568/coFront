;
spa_define(function() {
	return $.use(["spa", "pagedatagrid", "util"], function(spa, pdgf, util) {
		return {
			main: function() {
				var root = spa.findInMain(".sys_customer_myindex");
				var pdg = pdgf.build(root);
				pdg.code.shell("showDay", function(env) {
					if (env.cd && env.cd[this.k]) {
						var day = env.cd[this.k];
						return day.substring(0, 4) + "-" + day.substring(4, 6) + "-" + day.substring(6, 8);
					}
					return "";
				});
				pdg.code.listen($.dict.doTransfer);
				root.find(".opt-query").on("click", function() {
					pdg.load();
				});
				pdg.load();
				root.on("click", ".icon-edit", function() {
					var $this = $(this);
					var powerId = $this.parent().attr("powerId");
					util.get("../ajax/sys/mycustomer/id/" + powerId, null, function(rd) {
						if (rd) {
							spa.showModal("sys_customer_myedit", {
								data: rd,
								hand: function() {
									pdg.load()
								}
							})
						} else {
							util.alert("客户选择有误", function() {
								pdg.load();
							});
						}
					}, {});
				});
                root.on("click",".table-opt a.name", function () {
                    var professorId = $(this).parent().attr("professorId");
                    window.open('http://www.ekexiu.com/information-brow.html?professorId=' + professorId);
                });
			}
		};
	});
});