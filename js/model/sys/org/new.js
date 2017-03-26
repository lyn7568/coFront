;
spa_define(function() {
	return $.use(["spa","util","form"], function(spa,util,fb) {
		return {
			modal : function(data) {
				var root = spa.findInModal(".sys_resource_new");
				var form =fb(root.find(".newForm"));
				root.find(".modal-ctrl .icon-times").on("click", function() {
					spa.closeModal();
				});

				root.find(".opt-save").on("click", function() {
					form.doPost("../ajax/sys/org", function() {
						spa.closeModal();
						if (data) {
							data();
						}
					}, {});
				});
			}
		}
	});
});