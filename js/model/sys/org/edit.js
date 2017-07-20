/**
 * Created by TT on 2017/5/23.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_org_edit");
                var form = fb.build(root.find(".newForm"));
                var trim = function (str) { //删除左右两端的空格			　　
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
                            if (form.val().mobile != data.data.mobile || form.val().email != data.data.email) {
                                util.get("../ajax/sys/org/entryCheck", {
                                    name: form.val().name,
                                    email: form.val().email
                                }, function (success) {
                                    if (success) {
                                        form.val({pMobile: form.val().mobile});
                                        form.val({pEmail: form.val().email});
                                        form.doPost("../ajax/sys/org/updateAccount",closeThis(), {});
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
                form.val({name:"li",email:"www"});
                saveBtn.on("click", save);
            }
        }
    });
});