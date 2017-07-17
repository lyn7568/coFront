/**
 * Created by TT on 2017/7/11.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_userinfo_job");
                var form = fb.build(root.find(".newForm"));
                var date = new Date(),
                    month = date.getMonth() + 1,
                    myDate = "" + date.getFullYear() + (month > 9 ? month : ("0" + month));
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (form.val().jobCompany) {
                            var jobCompany = trim(form.val().jobCompany);
                            if (jobCompany.length > 50) {
                                util.alert("机构名称不得超过50个字");
                                return;
                            }
                        } else {
                            util.alert("请填写机构名称");
                            return;
                        }
                        if (form.val().jobTitle) {
                            var jobTitle = trim(form.val().jobTitle);
                            if (jobTitle.length > 50) {
                                util.alert("职位不得超过50个字");
                                return;
                            }
                        } else {
                            util.alert("请填写职位");
                            return;
                        }
                        if (form.val().jobDepartment) {
                            var jobDepartment = trim(form.val().jobDepartment);
                            if (jobDepartment.length > 50) {
                                util.alert("部门名称不得超过50个字");
                                return;
                            }
                        }
                        if (!form.val().jobStart && form.val().jobStop) {
                            util.alert("没有选择开始时间");
                            return;
                        }
                        if (form.val().jobStart && !form.val().jobStop) {
                            util.alert("没有选择结束时间，则结束时间为“至今”");
                            form.val({
                                jobStart: form.val().jobStart.substring(0, 6),
                                jobStop: "至今"
                            });
                            return;
                        }
                        if (form.val().jobStart && form.val().jobStop) {
                            // if (form.val().jobStart.substring(0, 6) <= form.val().jobStop.substring(0, 6) && form.val().jobStart.substring(0, 6) <= myDate) {
                                form.val({
                                    jobStart: form.val().jobStart.substring(0, 6),
                                    jobStop: form.val().jobStop.substring(0, 6)
                                });
                            // } else {
                            //     util.alert("日期输入不正确，开始时间不能晚于结束时间");
                            //     return;
                            // }
                        }
                        var item = form.val();
                        item.no = data.data.length;
                        data.data.push(item);
                        data.hand();
                        spa.closeModal();
                    };
                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                saveBtn.on("click", save);
                function trim(str) { //删除左右两端的空格			　　
                    return str.replace(/(^\s*)|(\s*$)/g, "");
                }
            }
        }
    });
});