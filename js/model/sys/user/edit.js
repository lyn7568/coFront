;
spa_define(function() {
	return $.use(["spa","util","form","upload"],function (spa,util,fb,upload) {
        return {
            modal: function(data) {
                var root = spa.findInModal(".sys_user_edit");
                var form = fb.build(root.find(".newForm"));
                var saveBtn = root.find(".opt-save"),
                    headArea = root.find(".head-ctn"),
                    save = function () {
                        form.doPut("../ajax/sys/user", closeThis, {});
                    };
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
                upload.build({
                    render: root.find(".upload-btn"),
                    accept: "image/gif, image/jpeg",
                    fail: function(errType, errData) {
						/*this ={id,name,size,type,abort=function}*/
                        util.errMsg(this.name + "上传文件错误：" + errType);
                        this.ele.remove();
                        saveBtn.on("click", save);
                    },
                    async: false,
                    maxSize: 1024 * 1024 * 10,
                    done: function(data) {
						/*this ={id,name,size,type,abort=function}*/
                        this.ele.remove();
                        headArea.find("img").remove();
                        $("<img></img>").attr("src", "../data/" + data.uri).appendTo(headArea);
                        form.val({"head":data.uri});
                        saveBtn.on("click", save);
                    },
                    start: function() {
						/*this ={id,name,size,type,abort=function}*/
                        this.ele = $("<div class='upload-item'><div class='progress'></div><span>" + this.name + "</span><div>");
                        this.ele.appendTo(headArea);
                        this.progress = this.ele.find(".progress");
                        saveBtn.off("click");
                    },
                    notity: function(total, loaded) {
						/*this ={id,name,size,type,abort=function}*/
                        var vv =  ""+Math.ceil(loaded * 100 / total) + "%;"
                        this.progress.attr("style", "width:" +vv);
                        this.progress.text(vv);
                    },
                    uri: "../ajax/sys/user/head"
                });
                saveBtn.on("click", save);
            }
        };
    })
});