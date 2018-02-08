/**
 * Created by TT on 2018/1/29.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_answer_edit");
                var form = fb.build(root.find(".newForm"));
                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                util.get("../ajax/qa/answer?id=" + data.id, null, function (answer) {
                    if (answer) {
                        form.val({cnt: answer.cnt});
                    } else {
                        util.alert("此回答不存在");
                    }
                });

                root.find(".opt-save").on("click", function () {
                    util.post("../ajax/qa/answer/modify", {
                        cnt:form.val().cnt,
                        id:data.id
                    }, function () {
                        spa.closeModal();
                        if (data.hand) {
                            data.hand();
                        }
                    }, {});
                });
            }
        }
    });
});
