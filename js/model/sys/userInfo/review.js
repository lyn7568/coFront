/**
 * Created by TT on 2017/7/12.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_userinfo_review");
                var form = fb.build(root.find(".newForm"));
                var id = util.data("loginUser").id;
                var reviewerName = util.data("loginUser").name;
                var date = new Date(),
                    month = date.getMonth() + 1,
                    day = date.getDate();
                var myDate = "" + date.getFullYear() + (month > 9 ? month : ("0" + month)) + (day > 9 ? day : ("0" + day));
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        form.val({
                            reviewer: id,
                            reviewTime: myDate,
                            reviewerName: reviewerName
                        });
                        if (form.val().sortFirst){
                            var sortFirst = form.val().sortFirst;
                            var reg = new RegExp("^(\\d|[1-9]\\d|100)$");
                            if (!reg.test(sortFirst)){
                                util.alert("权重值必须是0-100的正整数");
                                return;
                            }
                        }else {
                            form.val({sortFirst: 0});
                        }
                        if (form.val().state == 3) {
                            util.get("../ajax/userinfo/reviewCheck", {
                                mobile: form.val().mobile,
                                email: form.val().email
                            }, function (success) {
                                if (success) {
                                    form.doPost("../ajax/userinfo/import", function (code) {
                                        if (code==1) {
                                            closeThis();
                                            alert("审核成功，并已导入正式数据库");
                                        } else if (code == 2){
                                            util.alert("导入失败，只有本次审核通过的可以导入");
                                        }else if(code == 3){
                                            util.alert("导入失败，信息不存在");
                                        }
                                    }, {});
                                } else {
                                    util.alert("该账号已存在");
                                }
                            });
                        } else {
                            form.val({authentication: "", authStatus: "", authStatusExpert: "", sortFirst: ""});
                            form.doPut("../ajax/userinfo/update", closeThis, {});
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
                saveBtn.on("click", save);
                form.val(data.data);
                form.val({state: 3, authentication: 0, authStatus: 3, authStatusExpert: 3});
            }
        }
    });
});