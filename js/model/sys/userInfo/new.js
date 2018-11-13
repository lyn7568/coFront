/**
 * Created by TT on 2017/7/7.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_userinfo_new");
                var form = fb.build(root.find(".newForm"));
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (form.val().mobile) {
                            var mobile = form.val().mobile;
                            var hunPhone = /^1[3|4|5|7|8]\d{9}$/;
                            if (!hunPhone.test(mobile)) {
                                util.alert("注册电话格式有误，请检查后重新填写");
                                return;
                            }
                        }
                        if (form.val().email) {
                            var email = form.val().email;
                            if (email.trim().indexOf("@") === -1) {
                                util.alert("注册邮箱格式有误，请检查后重新填写");
                                return;
                            }
                        }
                        if (form.val().name) {
                            var name = form.val().name;
                            if (name.length > 10) {
                                util.alert("姓名最长为10个字");
                                return;
                            }
                        }else {
                            util.alert("请填写用户名称");
                            return;
                        }
                        if (form.val().mobile || form.val().email) {
                            util.get("../ajax/userinfo/entryCheck", {
                                mobile: form.val().mobile,
                                email: form.val().email
                            },function (success) {
                                if (success){
                                    form.val({pMobile: form.val().mobile});
                                    form.val({pEmail: form.val().email});
                                    form.doPut("../ajax/userinfo/insert", function () {
                                        spa.closeModal();
                                        if (data) {
                                            data();
                                        }
                                    }, {});
                                }else {
                                    util.alert("该账号已存在");
                                }
                            });
                        } else {
                            util.alert("手机或邮箱至少输入一项");
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