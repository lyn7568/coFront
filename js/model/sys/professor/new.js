/**
 * Created by TT on 2017/5/18.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_professor_new");
                var form = fb.build(root.find(".newForm"));
                var id = util.data("loginUser").id;
                var saveBtn = root.find(".opt-save"),
                    gotoBtn = root.find(".opt-goto"),
                    save = function (boolean) {
                        form.val({cuserId: id, professorState: 2, authentication: 1});
                        if (form.val().orgType == null) {
                            form.val({orgType: 1});
                        }
                        if (form.val().name == null) {
                            util.alert("请输入专家姓名");
                        } else if (form.val().orgName == null) {
                            util.alert("请输入所在机构名称")
                        } else
                            form.doPost("../ajax/sys/professor", function (id) {
                                spa.closeModal();
                                if (data) {
                                    data();
                                }
                                if (boolean) {
                                    window.open('http://www.ekexiu.com/information-console.html?professorId=' + id);
                                }
                            }, function (data) {
                                util.alert(data.msg);
                            });
                    };
                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                $.fn.citySelect();
                $(document).on("click", "#City li a", function () {
                    var aVal = $(this).text();
                    $(this).parent().parent().parent().find('.mr_show').text(aVal);
                    $(this).parent().parent().parent().find('input[name=cho_City]').val(aVal);
                    if ($("#ocity").text() == "请选择城市") {
                        $("#ocity").removeClass("mr_select");
                    } else {
                        $("#ocity").addClass("mr_select");
                    }
                    if ($("#oprovince").text() != "请选择省份") {
                        form.val({province: $("#oprovince").text()});
                    }
                    if ($("#ocity").text() != "请选择城市") {
                        from.val({address: $("#ocity").text()});
                    }

                });
                saveBtn.on("click", function () {
                    save();
                });
                gotoBtn.on("click", function () {
                    save(true);
                });
            }
        }
    });
});