/**
 * Created by TT on 2017/5/12.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_customer_myindex_mail");
                var form = fb.build(root.find(".newForm"));
                form.val({
                    emails: data.emails,
                    mobilePhones: data.phones,
                    inviteCodes: data.inviteCodes,
                    name: data.names,
                    names:data.names
                });
                var send = root.find(".opt-send"),
                    save = function () {
                        var boolean = false;
                        var empty = 0;
                        for (var i = 0; i < form.val().emails.length; i++) {
                            var item = form.val().emails[i];
                            if (item != "") {
                                boolean = true
                            }else empty++;
                        }
                        if (boolean) {
                            form.doPost("../ajax/sendmail", function (data) {
                                var fail = form.val().emails.length - data.count - empty;
                                for (var i = 0; i < form.val().emails.length; i++) {
                                    var item = form.val().emails[i];
                                    if (item == "") {
                                        data.names += "，"+form.val().names[i];
                                    }
                                }
                                util.alert("您发送成功" + data.count + "封邮件！" + empty + "个用户邮箱为空。" + fail + "封邮件发送失败；失败用户：" + data.names + "；失败邮箱：" + data.emails);
                            }, {});
                        } else {
                            util.alert("请选择收件人（收件人邮箱和邀请码不能为空）！");
                        }
                    };
                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                send.on("click", save);
            }
        };
    })
});