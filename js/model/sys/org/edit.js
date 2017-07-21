/**
 * Created by TT on 2017/5/23.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_org_new");
                var form = fb.build(root.find(".newForm"));
                var trim = function (str) {
                    return str.replace(/(^\s*)|(\s*$)/g, "");
                };
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (form.val().email) {
                            var email = trim(form.val().email);
                            var gunf = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                            if (!gunf.test(email)) {
                                util.alert("注册邮箱格式有误，请检查后重新填写");
                                return;
                            }
                        } else {
                            util.alert("请输入邮箱")
                            return;
                        }
                        if (form.val().name) {
                            var name = trim(form.val().name);
                            if (name.length > 50) {
                                util.alert("企业名称最长为50个字");
                                return;
                            }
                        } else {
                            util.alert("请填写企业名称");
                            return;
                        }
                        if (form.val().name && form.val().email) {
                            if (form.val().name != data.data.name || form.val().email != data.data.email) {
                                util.get("../ajax/sys/org/entryCheck", {
                                    name: form.val().name,
                                    email: form.val().email
                                }, function (success) {
                                    if (success) {
                                        form.doPost("../ajax/sys/org/updateAccount",closeThis(), function (data) {
                                            util.alert(data);
                                        });
                                    } else {
                                        util.alert("该账号已存在");
                                    }
                                });
                            } else {
                                closeThis();
                            }
                        } else {
                            util.alert("邮箱和企业名称都必须输入");
                        }
                    };

                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                var handler = data.hand;
                var closeThis = function () {
                    spa.closeModal();
                    if (handler) {
                        handler();
                    }
                };
                form.val(data.data);
                saveBtn.on("click", save);
            }
        };
    })
});