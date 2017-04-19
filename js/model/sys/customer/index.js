;
spa_define(function(){
	return $.use(["spa","pagedatagrid","util"],function(spa,pdgf,util){
		return{
			main: function() {				
				var root = spa.findInMain(".sys_customer_index");
				var pdg = pdgf.build(root);
				pdg.code.shell("showDay", function(env) {
					if(env.cd && env.cd[this.k]) {
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
				var bindDataEvent = function() {
		        	root.find(".table-opt i.icon-edit").on("click", function() {
                        var $this = $(this);
						var professorId = $this.parent().attr("professorId");
//						var orgname = $this.parent().attr("orgName");
						spa.showModal("sys_customer_new", {
//							data:{id:professorId,name:orgname},			
							data:professorId,
							hand: function() {
								pdg.load();
							}
						});

					});
             	};
             	pdg.code.listen(bindDataEvent);
			}
		};
	});
});