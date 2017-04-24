/**
 * Created by TT on 2017/4/24.
 */
;
spa_define(function() {
    return $.use(["spa","util","form"],function (spa,util,fb) {
        return {
            modal: function() {
                var root = spa.findInModal(".sys_user_cp");
                var form = fb.build(root.find(".newForm"));
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (form.val().pw != null || form.val().pw1 != null) {
                            if (form.val().pw === form.val().pw1) {
                                form.doPost("../ajax/sys/user/cp", function() {
                                    spa.closeModal();
                                }, {});
                            } else {
                                alert("两次输入的密码不同");
                            }
                        }
                    };
                root.find(".modal-ctrl .icon-times").on("click", function() {
                    spa.closeModal();
                });
                saveBtn.on("click", save);
            }
        };
    })
});
