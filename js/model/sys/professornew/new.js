/**
 * Created by TT on 2017/8/4.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_professornew_new");
                var form = fb.build(root.find(".newForm"));
                var trim = function (str) { //删除左右两端的空格			　　
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
                            var gunf = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                            if (!gunf.test(email)) {
                                util.alert("注册邮箱格式有误，请检查后重新填写");
                                return;
                            }
                        }
                        if (form.val().name) {
                            var name = trim(form.val().name);
                            if (name.length > 10) {
                                util.alert("姓名最长为10个字");
                                return;
                            }
                        }else {
                            util.alert("请填写用户名称");
                            return;
                        }
                        if (form.val().mobile || form.val().email) {
                            util.get("../ajax/userinfo/reviewCheck", {
                                mobile: form.val().mobile,
                                email: form.val().email
                            },function (success) {
                                if (success){
                                    form.val({pMobile: form.val().mobile});
                                    form.val({pEmail: form.val().email});
                                    form.doPut("../ajax/sys/professor/insert", function () {
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
