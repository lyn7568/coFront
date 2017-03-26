;spa_define(function() {
	return  $.use(["spa","pagedatagrid","util","dict"],function(spa,pdgf,util,dict){
		return {
			main:function(){
				var root = spa.findInMain(".sys_dict_index");
				root.find(".opt-new").on("click", function() {
					spa.showModal("sys_dict_add", function() { pdg.load() });
				});
				var pdg = pdgf.build(root);
				var bindDataEvent =function(){
					root.find(".table-opt i.icon-edit").on("click", function() {
						var $this = $(this);
						var code = $this.parent().attr("dictCode");
						if(code) {
							util.get("../ajax/sys/dict/info/" + code, null, function(data) {
								if(data.readonly) {
									util.alert("只读的");
								} else {
									spa.showModal("sys_dict_edit", {
										data: data,
										hand: function() {
											pdg.load();
										}
									});
								}
							});
						}
					});
					root.find(".table-opt i.icon-list-ul").on("click",function(){
						var $this = $(this);
						var code = $this.parent().attr("dictCode");
						if(code) {
							util.get("../ajax/sys/dict/item/" + code, null, function(data) {
								spa.showModal("sys_dict_itemlist", {
									data: data,
									hand: function() {
										pdg.load();
									}
								});
							});
						}
					});
					root.find(".table-opt i.icon-tasks").on("click",function(){
						var $this = $(this);
						var code = $this.parent().attr("dictCode");
						if(code) {
							util.get("../ajax/sys/dict/editItem/" + code, null, function(data) {
								spa.showModal("sys_dict_itemedit", {
									data: data,
									hand: function() {
										pdg.load();
									}
								});
							});
						}
					});
				};
				pdg.code.listen(dict.doTransfer);
				pdg.code.listen(bindDataEvent);
				pdg.code.shell("bool",function(env){
					var v = env.cd[this.k];
					return v===true?"是":(v===false?"否":"");
				});
				root.find(".opt-query").on("click", function() {
					pdg.load();
				});
				pdg.load();


			}
		};
	});
});