/**
 * Created by TT on 2017/8/15.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_professornew_project");
                var form = fb.build(root.find(".newForm"));
                var date = new Date(),
                    month = date.getMonth() + 1,
                    myDate = "" + date.getFullYear() + (month > 9 ? month : ("0" + month));
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (form.val().name) {
                            var name = trim(form.val().name);
                            if (name.length > 50) {
                                util.alert("项目名称不得超过50个字");
                                return;
                            }
                        } else {
                            util.alert("请填写项目名称");
                            return;
                        }
                        if (form.val().descp) {
                            var descp = trim(form.val().descp);
                            if (descp.length > 200) {
                                util.alert("项目描述不得超过200个字");
                                return;
                            }
                        }
                        if (!form.val().startMonth && form.val().stopMonth) {
                            util.alert("没有选择开始时间");
                            return;
                        }
                        if(form.val().stopMonth == "至今"){
                            form.val().stopMonth = "";
                        }
                        form.val({professorId:data.data})
                        form.doPost("../ajax/project",function () {
                            spa.closeModal();
                            if (data.hand){
                                data.hand();
                            }
                        })
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