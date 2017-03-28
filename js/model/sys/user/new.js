;
spa_define(function() {
	return $.use(["spa", "util", "form", "upload"], function(spa, util, fb, upload) {
		return {
			modal: function(data) {
				var root = spa.findInModal(".sys_user_new");
				var form = fb.build(root.find(".newForm"));
				root.find(".modal-ctrl .icon-times").on("click", function() {
					spa.closeModal();
				});
				upload.build({
					render: root.find(".upload-btn"),
					accept: "image/gif, image/jpeg",
					fail: function(errType, errData) { /*this ={id,name,size,type,abort=function}*/ },
					async: false,
					maxSize: 1024 * 1024 * 10,
					done: function(data) { /*this ={id,name,size,type,abort=function}*/ },
					start: function() { /*this ={id,name,size,type,abort=function}*/ },
					notity: function(total, loaded) { /*this ={id,name,size,type,abort=function}*/ },
					uri: "../ajax/sys/user/head"
				});

				root.find(".opt-save").on("click", function() {
					form.doPost("../ajax/sys/user", function() {
						spa.closeModal();
						if(data) {
							data();
						}
					}, {});
				});
			}
		}
	});
});