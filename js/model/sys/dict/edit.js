;spa_define(function() {
	return $.use(["spa","form"], function(spa,fb) {
		return {
			modal : function(data) {
				var root = spa.findInModal(".sys_dict_edit")
				var form = fb.build(root.find(".newForm"));
				root.find(".modal-ctrl .icon-times").on("click", function() {
					spa.closeModal();
				});
				form.val(data.data);
				root.find(".opt-save").on("click", function() {
					form.doPut("../ajax/sys/dict/info", function() {
						spa.closeModal();
						if (data.hand) {
							data.hand();
						}
					}, {});
				});
			}
		};
	});
});