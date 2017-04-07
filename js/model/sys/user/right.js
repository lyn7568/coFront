;
spa_define(function() {
	return $.use(["spa", "form", "code","util"], function(spa, fb, code,util) {
		return {
			modal: function(data) {
				var userid = data.id;
				var root = spa.findInModal(".sys_user_right");
				var form = fb.build(root.find(".newForm"));
				var cr = code.parseCode(root.find(".right-ctn"));
				root.find(".modal-ctrl .icon-times").on("click", function() {
					spa.closeModal();
				});
				root.on("click", ".icon-st-check", function() {
					$(this).toggleClass("checked");
				});

				root.find(".opt-save").on("click", function() {
					var ret = [];
					root.find(".right-ctn i.checked").each(function() {
						ret.push(parseInt($(this).attr("right")));
					});
					util.post("../ajax/sys/user/right",{userid:userid,right:ret},function(){
						spa.closeModal();
					});
				});
				data.rights.forEach(function(item){
					item.checked = (data.userRights.indexOf(item.id)>=0)?"checked":"";
					
				});
				cr.val(data.rights);
				form.val({name:data.name,mobile:data.mobile,email:data.email});
				
			}
		};
	});

});