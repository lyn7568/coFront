/**
 * Created by TT on 2017/7/11.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_userinfo_honor");
                var form = fb.build(root.find(".newForm"));
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (form.val().honorName) {
                            var honorName = trim(form.val().honorName);
                            if (honorName.length > 50) {
                                util.alert("奖项名称不得超过50个字");
                                return;
                            }
                            data.data.honorName = honorName;
                        } else {
                            util.alert("请填写奖项名称");
                            return;
                        }
                        if (form.val().honorDescp) {
                            var honorDescp = trim(form.val().honorDescp);
                            if (honorDescp.length > 200) {
                                util.alert("项目描述不得超过200个字");
                                return;
                            }
                            data.data.honorDescp = honorDescp;
                        } else {
                            data.data.honorDescp = "";
                        }
                        if (form.val().honorYear) {
                            data.data.honorYear = form.val().honorYear.substring(0, 4);
                        } else {
                            data.data.honorYear = "";
                        }
                        data.hand();
                        spa.closeModal();
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
