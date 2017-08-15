/**
 * Created by TT on 2017/8/14.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_professornew_edu");
                var form = fb.build(root.find(".newForm"));
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (form.val().school) {
                            var school = trim(form.val().school);
                            if (school.length > 50) {
                                util.alert("学校名称不得超过50个字");
                                return;
                            }
                        } else {
                            util.alert("请填写学校名称");
                            return;
                        }
                        if (form.val().college) {
                            var college = trim(form.val().college);
                            if (college.length > 20) {
                                util.alert("院系名称不得超过20个字");
                                return;
                            }
                        }
                        if (form.val().major) {
                            var major = trim(form.val().major);
                            if (major.length > 20) {
                                util.alert("专业名称不得超过20个字");
                                return;
                            }
                        }
                        form.doPut("../ajax/edu",function () {
                            spa.closeModal();
                            if (data.hand){
                                data.hand();
                            }
                        },function (data) {
                            util.alert(data.msg);
                        })
                    };
                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                saveBtn.on("click", save);
                form.val(data.data);
                if (data.data.year) {
                    if (trim(data.data.year) == "至今") {
                        form.val({year: "至今"});
                    }
                }
                function trim(str) { //删除左右两端的空格			　　
                    return str.replace(/(^\s*)|(\s*$)/g, "");
                }
            }
        }
    });
});