/**
 * Created by TT on 2017/8/14.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_professornew_job");
                var form = fb.build(root.find(".newForm"));
                var date = new Date(),
                    month = date.getMonth() + 1,
                    myDate = "" + date.getFullYear() + (month > 9 ? month : ("0" + month));
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (form.val().company) {
                            var company = trim(form.val().company);
                            if (company.length > 50) {
                                util.alert("机构名称不得超过50个字");
                                return;
                            }
                        } else {
                            util.alert("请填写机构名称");
                            return;
                        }
                        if (form.val().title) {
                            var title = trim(form.val().title);
                            if (title.length > 50) {
                                util.alert("职位不得超过50个字");
                                return;
                            }
                        } else {
                            util.alert("请填写职位");
                            return;
                        }
                        if (form.val().department) {
                            var department = trim(form.val().department);
                            if (department.length > 50) {
                                util.alert("部门名称不得超过50个字");
                                return;
                            }
                        }
                        if (!form.val().startMonth && form.val().stopMonth) {
                            util.alert("没有选择开始时间");
                            return;
                        }
                        if (form.val().startMonth && form.val().stopMonth) {
                            form.val().startMonth = form.val().startMonth.substring(0, 6);
                            form.val().stopMonth = form.val().stopMonth.substring(0, 6);
                        }
                        form.doPut("../ajax/job",function () {
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
                if (data.data.stopMonth) {
                    if (trim(data.data.stopMonth) == "至今") {
                        form.val({stopMonth: ""});
                    }
                }
                function trim(str) {
                    return str.replace(/(^\s*)|(\s*$)/g, "");
                }
            }
        }
    });
});
