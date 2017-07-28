/**
 * Created by TT on 2017/7/25.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form", "code"], function (spa, util, fb, code) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_feedback_operate");
                var form = fb.build(root.find(".newForm"));
                var trim = function (str) {
                    return str.replace(/(^\s*)|(\s*$)/g, "");
                };
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (form.val().operateDescp) {
                            var operateDescp = trim(form.val().operateDescp);
                            if (operateDescp.length > 500) {
                                util.alert("处理备注不得超过500个字");
                                return;
                            }
                        }
                        util.post("../ajax/feedback/update",{id:data.data.id,state:form.val().state,operateDescp:form.val().operateDescp}, function () {
                            spa.closeModal();
                            if (data.hand) {
                                data.hand();
                            }
                        }, function (data) {
                            util.alert(data.msg);
                        });
                    };

                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                saveBtn.on("click", function () {
                    save();
                });

                if (data.data.createTime) {
                    var day = data.data.createTime;
                    var time = day.substring(0, 4) + "年" + day.substring(4, 6) + "月" + day.substring(6, 8) + "日  " +day.substring(8,10)+":"+day.substring(10,12) ;
                    form.val({time: time});
                }
                form.val(data.data);
            }
        }
    });
});