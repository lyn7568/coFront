/**
 * Created by TT on 2017/7/10.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_userinfo_project");
                var form = fb.build(root.find(".newForm"));
                var date = new Date(),
                    month = date.getMonth() + 1,
                    myDate = "" + date.getFullYear() + (month > 9 ? month : ("0" + month));
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (form.val().projectName) {
                            var projectName = trim(form.val().projectName);
                            if (projectName.length > 50) {
                                util.alert("项目名称不得超过50个字");
                                return;
                            }
                            data.data.projectName = projectName;
                        } else {
                            util.alert("请填写项目名称");
                            return;
                        }
                        if (form.val().projectDescp) {
                            var projectDescp = trim(form.val().projectDescp);
                            if (projectDescp.length > 200) {
                                util.alert("项目描述不得超过200个字");
                                return;
                            }
                            data.data.projectDescp = projectDescp;
                        } else {
                            data.data.projectDescp = ""
                        }
                        if (!form.val().projectStart && form.val().projectStop) {
                            util.alert("没有选择开始时间");
                            return;
                        }
                        if (form.val().projectStart && !form.val().projectStop) {
                            util.alert("没有选择结束时间，则结束时间为“至今”");
                            data.data.projectStart = form.val().projectStart.substring(0, 6);
                            data.data.projectStop = "至今";
                            form.val({projectStop: "至今"});
                            return;
                        }
                        if (form.val().projectStart && form.val().projectStop) {
                            // if (form.val().projectStart.substring(0, 6) <= form.val().projectStop.substring(0, 6) && form.val().projectStart.substring(0, 6) <= myDate) {
                                data.data.projectStart = form.val().projectStart.substring(0, 6);
                                data.data.projectStop = form.val().projectStop.substring(0, 6);
                            // } else {
                            //     util.alert("日期输入不正确，开始时间不能晚于结束时间");
                            //     return;
                            // }
                        }
                        if (!form.val().projectStart && !form.val().projectStop) {
                            data.data.projectStart = "";
                            data.data.projectStop = "";
                        }
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
