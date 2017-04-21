;
spa_define(function(){
	return $.use(["spa","pagedatagrid","util"],function(spa,pdgf,util){
		return{
			main: function() {				
				var root = spa.findInMain(".sys_customer_allindex");
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
			}
		};
	});
});