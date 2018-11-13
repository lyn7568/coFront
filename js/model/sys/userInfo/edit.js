/**
 * Created by TT on 2017/7/7.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_userinfo_edit");
                var form = fb.build(root.find(".newForm"));
                var trim = function (str) {
                    return str.replace(/(^\s*)|(\s*$)/g, "");
                };
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (form.val().mobile) {
                            var mobile = trim(form.val().mobile);
                            var hunPhone = /^1[3|4|5|7|8]\d{9}$/;
                            if (!hunPhone.test(mobile)) {
                                util.alert("注册电话格式有误，请检查后重新填写");
                                return;
                            }
                        }
                        if (form.val().email) {
                            var email = trim(form.val().email);
                            if (email.trim().indexOf("@") === -1) {
                                util.alert("联系邮箱格式有误，请检查后重新填写");
                                return;
                            }
                        }
                        if (form.val().name) {
                            var name = trim(form.val().name);
                            if (name.length > 10) {
                                util.alert("姓名最长为10个字");
                                return;
                            }
                        } else {
                            util.alert("请填写用户名");
                            return;
                        }
                        if (form.val().mobile || form.val().email) {
                            if (form.val().mobile != data.data.mobile || form.val().email != data.data.email) {
                                util.get("../ajax/userinfo/editCheck", {
                                    mobile: form.val().mobile,
                                    email: form.val().email,
                                    id:form.val().id
                                }, function (success) {
                                    if (success) {
                                        form.doPut("../ajax/userinfo/update", function () {
                                            spa.closeModal();
                                            if (data.hand) {
                                                data.hand();
                                            }
                                        }, {});
                                    } else {
                                        util.alert("该账号已存在");
                                    }
                                });
                            } else {
                                form.doPut("../ajax/userinfo/update", closeThis, {});
                            }
                        } else {
                            util.alert("手机或邮箱至少输入一项");
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