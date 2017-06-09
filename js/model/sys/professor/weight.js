/**
 * Created by TT on 2017/6/8.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_professor_weight");
                var form = fb.build(root.find(".newForm"));
                var sortFirst ;
                if (data.data.sortFirst!=0) {
                    sortFirst = data.data.sortFirst;
                }else if (data.data.activeTime){
                    sortFirst = 20;
                } else {
                    sortFirst = 0;
                }

                form.val({sortFirst: sortFirst,id:data.data.id});

                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (form.val().sortFirst == null) {
                            util.alert("权重码不能为空")
                        }else
                        form.doPost("../ajax/sys/professor/sortFirst", function () {
                                spa.closeModal();
                                if (data.hand) {
                                    data.hand();
                                }
                            }, {});
                    };

                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });

                saveBtn.on("click", save);
            }
        }
    });
});