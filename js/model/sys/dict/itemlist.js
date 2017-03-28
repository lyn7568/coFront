;
spa_define(function() {
	return $.use(["code", "util", "spa", "doc"], function(code, util, spa, doc) {
		return {
			modal: function(data) {
				var root = spa.findInModal(".sys_dict_itemlist");
				root.find(".modal-ctrl .icon-times").on("click", function() {
					spa.closeModal();
				});

				var ul = root.find(".ld-items");
				var codeHand = code.parse(ul[0]);
				codeHand.shell("itemE", function(env) {
					var val = env.cd[this.k];
					return val === true ? "有效的" : (val === false ? "无效的" : "");
				});
				codeHand.shell("itemS", function(env) {
					var val = env.cd[this.k];
					return val === true ? "系统保留的": (val === false ? "非系统保留的" : "");
				});
				var fill = function(e, items) {
					items.forEach(function(item) {
						codeHand.fill(e, item);
						if(item.children && item.children.length) {
							var cul = doc.createElement("ul");
							e.lastElementChild.appendChild(cul);
							fill(cul, item.children);
						}
					});
				};
				ul.empty();
				var docf = doc.createDocumentFragment();
				fill(docf, data.data);
				ul[0].appendChild(docf);
				docf = null;
			}
		};
	});

});