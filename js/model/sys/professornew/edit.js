/**
 * Created by TT on 2017/8/8.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_professornew_new");
                $(".sys_professornew_new .pname").addClass("showOnly");
                $(".sys_professornew_new .me").after('<div class="row me"> ' +
                    '<div class="col-2 item-caption">邀请码</div> ' +
                    '<div class="col-4"> ' +
                    '<div class="form-item text showOnly" name="inviteCode"></div> ' +
                    '</div> ');
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
                                util.alert("注册邮箱格式有误，请检查后重新填写");
                                return;
                            }
                        }
                        if (form.val().mobile || form.val().email) {
                            if (form.val().mobile != data.data.mobile || form.val().email != data.data.email) {
                                util.get("../ajax/sys/professor/updateCheck", {
                                    mobile: form.val().mobile,
                                    email: form.val().email,
                                    id:data.data.id
                                }, function (code) {
                                    if (code == 1) {
                                        util.post("../ajax/sys/professor/updateAccount", {
                                            mobile: form.val().mobile,
                                            email: form.val().email,
                                            id:data.data.id
                                        },closeThis,{"40001":"该邮箱已被注册","40002":"该电话已被注册"});
                                    } else if (code == 2){
                                        util.alert("该邮箱已被注册");
                                    }else if (code == 3){
                                        util.alert("该手机已被注册");
                                    }
                                });
                            } else {
                                closeThis();
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
                form.val({mobile:data.data.mobilePhone,email:data.data.email,name:data.name,inviteCode:data.data.inviteCode});
                saveBtn.on("click", save);
            }
        };
    })
});
