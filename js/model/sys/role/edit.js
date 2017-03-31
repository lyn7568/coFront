;
spa_define(function() {
	return $.use(["spa", "form", "code"], function(spa, fb, code) {
		return {
			modal: function(data) {
				var root = spa.findInModal(".sys_role_edit");
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
					form.val({ "auths": ret });
					form.doPut("../ajax/sys/role", function() {
						spa.closeModal();
						if(data.hand) {
							data.hand();
						}
					});

				});
				data.rights.forEach(function(item) {
					item.checked = (data.data.auths.indexOf(item.id) >= 0) ? "checked" : "";
				});
				cr.val(data.rights);
				form.val(data.data);
			}
		};
	});

});