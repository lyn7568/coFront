;spa_define(function(){
	return $.use(["spa","util","form"],function(spa,util,form){
		return {
			modal:function(data){
				var root = spa.findInModal(".sys_resource_edit");
				root.find(".modal-ctrl .icon-times").on("click",function(){
					spa.closeModal();
				});
				var ef = form.build(root.find(".opt-form"));
				ef.val(data.data);
				root.find(".opt-save").on("click",function(){
					ef.doPut("../ajax/sys/resource",function(){
						spa.closeModal();
						if(data.hand){
							data.hand();
						}
					},{});
				});
			}
		};
	});
});