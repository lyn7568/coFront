/**
 * Created by TT on 2017/7/11.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_userinfo_edu");
                var form = fb.build(root.find(".newForm"));
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (form.val().eduSchool) {
                            var eduSchool = trim(form.val().eduSchool);
                            if (eduSchool.length > 50) {
                                util.alert("学校名称不得超过50个字");
                                return;
                            }
                            data.data.eduSchool = eduSchool;
                        } else {
                            util.alert("请填写学校名称");
                            return;
                        }
                        if (form.val().eduCollege) {
                            var eduCollege = trim(form.val().eduCollege);
                            if (eduCollege.length > 20) {
                                util.alert("院系名称不得超过20个字");
                                return;
                            }
                            data.data.eduCollege = eduCollege;
                        } else {
                            data.data.eduCollege = "";
                        }
                        if (form.val().eduMajor) {
                            var eduMajor = trim(form.val().eduMajor);
                            if (eduMajor.length > 20) {
                                util.alert("专业名称不得超过20个字");
                                return;
                            }
                            data.data.eduMajor = eduMajor;
                        } else {
                            data.data.eduMajor = ""
                        }
                        if (form.val().eduYear) {
                            data.data.eduYear = form.val().eduYear.substring(0, 4);
                        } else {
                            data.data.eduYear = "";
                        }
                        data.data.eduDegree = form.val().eduDegree;
                        data.hand();
                        spa.closeModal();
                    };
                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                saveBtn.on("click", save);
                form.val(data.data);
                function trim(str) { //删除左右两端的空格			　　
                    return str.replace(/(^\s*)|(\s*$)/g, "");
                }
            }
        }
    });
});