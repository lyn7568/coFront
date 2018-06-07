/**
 * Created by TT on 2018/5/25.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_buttedpro_new");
                var form = fb.build(root.find(".newForm"));
                var trim = function (str) { //删除左右两端的空格			　　
                    return str.replace(/(^\s*)|(\s*$)/g, "");
                };
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if(trim(form.val().id).length!=32) {
                            util.alert("请检查专家是否存在");
                            return;
                        }
                        util.post(baseUrl + "/ajax/platform/buttedProfessor", {pid: data.data, uid: form.val().id},function () {
                            spa.closeModal();
                            if (data) {
                                data.hand();
                            }
                        },{});
                    };

                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                saveBtn.on("click", save);
            }
        }
    });
});