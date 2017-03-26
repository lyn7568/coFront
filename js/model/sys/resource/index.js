;
spa_define(function() {
	return $.use(["spa","code","form","util"],function(spa,code,form,util){
		return {
			main: function() {
				var root = spa.findInMain(".sys_resource_index");
				var qf = form.build(root.find(".queryForm"));
				var cr = code.parseCode(root.find(".dt-tpl"));
				var queryBtn = root.find(".queryForm .icon-search");
				var newBtn = root.find(".opt-new");
				root.on("click",".opt-del",function(){
					var resId = $(this).parent().attr("resourceId");
					if(resId){
						util.boxMsg({
							title: "确认删除",
							content: "您是否要删除选中的资源信息,资源信息删除后不可恢复！！！！！！！！！！！！！！！！！！",
							btns: [{ caption: "删除", hand: function() {
								util.del("../ajax/sys/resource/id/"+resId,load,{});							
							} },
								{ caption: "取消" }
							]
						});
					}
				});
				root.on("click",".opt-edit",function(){
					var resId = $(this).parent().attr("resourceId");
					if(resId){
						var resource = allData.find(function(item){return item.id===resId});
						if(resource){
							spa.showModal("sys_resource_edit",{data:resource,hand:load});
						}
					}
				});
				cr.shell("bool",function(env){
					var v = env.cd[this.k];
					return v===true?"是":(v===false?"否":"");
				});
				newBtn.on("click", function() {
					spa.showModal("sys_resource_new",load);
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
					util.get("../ajax/sys/resource/all", null, function(data) {
						allData = data || [];
						query();
					}, {});
				};
	
				queryBtn.on("click", query);
				load();	
			},
			mainDestory: function() {
	
			}
		};
	});
});