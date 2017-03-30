;
spa_define(function() {
	return $.use(["spa","form"], function(spa,fb) {
		return {
			modal: function(data) {
				var root = spa.findInModal(".sys_right_display");
				var form = fb.build(root.find(".newForm"));
				root.find(".modal-ctrl .icon-times").on("click", function() {
					spa.closeModal();
				});
				form.val(data);
			}
		};
	});

});