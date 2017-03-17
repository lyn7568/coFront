;
spa_define(function(spa) {

	return {
		modal: function(data) {
			var modalCtn = spa.getLastModalCtn();
			var root = modalCtn = modalCtn.children();
			var form = root.find(".newForm").form();
			root.find(".modal-ctrl .icon-times").on("click", function() {
				spa.closeModal();
			});
			var handler = data.hand;
			var closeThis = function() {
				spa.closeModal();
				if(handler) {
					handler();
				}
			};
			form.val(data.data);
			root.find(".opt-save").on("click", function() {
				form.doPut("../ajax/sys/org", closeThis, {});
			});
		}
	};
});