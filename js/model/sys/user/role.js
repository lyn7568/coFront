;
spa_define(function() {
	return $.use(["spa", "form", "code","util"], function(spa, fb, code,util) {
		return {
			modal: function(data) {
				var userid = data.id;
				var root = spa.findInModal(".sys_user_role");
				var form = fb.build(root.find(".newForm"));
				var cr = code.parseCode(root.find(".role-ctn"));
				root.find(".modal-ctrl .icon-times").on("click", function() {
					spa.closeModal();
				});
				root.on("click", ".icon-st-check", function() {
					$(this).toggleClass("checked");
				});

				root.find(".opt-save").on("click", function() {
					var ret = [];
					root.find(".role-ctn i.checked").each(function() {
						ret.push($(this).attr("roleid"));
					});
					util.post("../ajax/sys/userRole",{userid:userid,role:ret},function(){
						spa.closeModal();
					});
				});
				data.roles.forEach(function(item){
					item.checked = (data.userRoles.find(function(role){return role.roleid==item.id})?"checked":"");
					
				});
				cr.val(data.roles);
				form.val({name:data.name,mobile:data.mobile,email:data.email});
				
			}
		};
	});

});