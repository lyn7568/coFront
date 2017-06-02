;
spa_define(function(){
	return $.use(["spa","pagedatagrid","util"],function(spa,pdgf,util){
		return{
			main: function() {
				var root = spa.findInMain(".sys_professor_index");
				var pdg = pdgf.build(root);
				pdg.code.shell("showDay", function(env) {
					if(env.cd && env.cd[this.k]) {
						var day = env.cd[this.k];
						return day.substring(0, 4) + "年" + day.substring(4, 6) + "月" + day.substring(6, 8) + "日";
					}
					return "";
				});
				pdg.code.listen($.dict.doTransfer);
				root.find(".opt-query").on("click", function() {
					pdg.load();
				});
				pdg.load();
				root.find(".opt-new").on("click", function() {
					spa.showModal("sys_professor_new", function() { pdg.load() });
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
							util.alertMsg("只能选择一个机构");
						} else {
                            window.open('http://www.ekexiu.com/information-console.html?professorId=' + $org.attr("id"));
						}
					} else {
						util.alert("请选择一个机构");
					}
				});
                root.on("click", ".opt-auth", function () {
                    var id = $(this).parent().attr("pId");
                    window.open('http://www.ekexiu.com/information-console.html?professorId=' + id);
                });
                root.on("click",".table-opt a.name", function () {
                    var professorId = $(this).parent().attr("professorId");
                    window.open('http://www.ekexiu.com/information-brow.html?professorId=' + professorId);
                });
			},mainDestory: function() {

			},
		};
	});
});