/**
 * Created by TT on 2018/5/23.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_platform_new");
                var form = fb.build(root.find(".newForm"));
                var trim = function (str) { //删除左右两端的空格			　　
                    return str.replace(/(^\s*)|(\s*$)/g, "");
                };
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (form.val().email) {
                            var email = trim(form.val().email);
                            if (email.trim().indexOf("@") === -1) {
                                util.alert("注册邮箱格式有误，请检查后重新填写");
                                return;
                            }
                        } else {
                            util.alert("请输入邮箱");
                            return;
                        }
                        if (form.val().name) {
                            var name = trim(form.val().name);
                            if (name.length > 50) {
                                util.alert("平台名称最长为50个字");
                                return;
                            }
                        } else {
                            util.alert("请填写平台名称");
                            return;
                        }
                        if (form.val().name && form.val().email) {
                            util.get(baseUrl+"/ajax/platformConsole/createCheck", {
                                name: form.val().name,
                                email: form.val().email
                            }, function (code) {
                                if (code == 1) {
                                    form.doPost(baseUrl+"/ajax/platformConsole/createAccount", function () {
                                        spa.closeModal();
                                        if (data) {
                                            data();
                                        }
                                    }, {});
                                } else if (code == 2) {
                                    util.alert("该邮箱已被注册");
                                } else if (code == 3) {
                                    util.alert("该平台帐号已注册");
                                }
                            });
                        } else {
                            util.alert("邮箱和平台名称都必须输入");
                        }
                    };

                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                saveBtn.on("click", save);
            }
        }
    });
});