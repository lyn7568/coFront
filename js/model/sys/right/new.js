;
spa_define(function() {
	return $.use(["spa","form"], function(spa,fb) {
		return {
			modal: function(data) {
				var root = spa.findInModal(".sys_right_new");
				var form = fb.build(root.find(".newForm"));
				root.find(".modal-ctrl .icon-times").on("click", function() {
					spa.closeModal();
				});

				root.find(".opt-save").on("click", function() {
					form.doPost("../ajax/sys/right", function() {
						spa.closeModal();
						if(data) {
							data();
						}
					}, {});
				});

			}
		};
	});

});