/**
 * Created by TT on 2017/8/14.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_professornew_honor");
                var form = fb.build(root.find(".newForm"));
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (form.val().name) {
                            var name = trim(form.val().name);
                            if (name.length > 50) {
                                util.alert("奖项名称不得超过50个字");
                                return;
                            }
                        } else {
                            util.alert("请填写奖项名称");
                            return;
                        }
                        if (form.val().descp) {
                            var descp = trim(form.val().descp);
                            if (descp.length > 200) {
                                util.alert("项目描述不得超过200个字");
                                return;
                            }
                        }
                        if (form.val().year) {
                            form.val().year = form.val().year.substring(0, 4);
                        }
                        form.doPut("../ajax/honor", function () {
                            spa.closeModal();
                            if (data.hand) {
                                data.hand();
                            }
                        },function (data) {
                            util.alert(data.msg);
                        });
                    };
                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                saveBtn.on("click", save);
                form.val(data.data);
                function trim(str) { //删除左右两端的空格			　　
                    return str.replace(/(^\s*)|(\s*$)/g, "");
                }
            }
        }
    });
});
