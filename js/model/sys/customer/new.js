;
spa_define(function() {
	return $.use(["spa", "util", "form"], function(spa, util, fb) {
		return {
			modal: function(data) {
				var root = spa.findInModal(".sys_customer_new");
				var form = fb.build(root.find(".newForm"));
				var id = util.data("loginUser").id;
				form.val({
					cuserId: id,
					professorId: data.data,
					powType: 0
				}); //加入表单意外的值
				root.find(".modal-ctrl .icon-times").on("click", function() {
					spa.closeModal();
				});

				root.find(".opt-save").on("click", function() {

					var content = $("textarea").val();
					if (content != "" || content == null) {
						form.doPost("../ajax/sys/cpow", function() {
							spa.closeModal();
							if (data.hand) {
								data.hand();
							}
						}, {});
					} else {
						alert("请填写认证说明！");

					}
				});

			}
		};
	});
});