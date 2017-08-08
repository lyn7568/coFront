/**
 * Created by TT on 2017/8/3.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_professornew_data");
                var form = fb.build(root.find(".newForm"));
                var saveBtn = root.find(".opt-save"),
                    save = function () {
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

                        form.doPost("../ajax/sys/professor/updateBusinessData", closeThis, {});

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
            }
        }
    });
});
