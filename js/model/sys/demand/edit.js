/**
 * Created by TT on 2017/5/23.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form", "upload"], function (spa, util, fb, upload) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_demand_edit");
                var form = fb.build(root.find(".newForm"));
                var saveBtn = root.find(".opt-save"),
                    headArea = root.find(".head-ctn"),
                    save = function () {
                        console.log(form.val());
                    form.doPost("../ajax/demand/modify",function () {
                        spa.closeModal();
                        if (data.hand) {
                            data.hand();
                        }
                    },{})
                    };

                form.val(data.data);

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
                    // console.log($("#ocity").text(),$("#oprovince").text())
                    form.val({province: $("#oprovince").text(), city: $("#ocity").text()});
                });
                if (data.data.province) {
                    $("#oprovince").text(data.data.province);
                }
                if (data.data.city) {
                    $("#ocity").text(data.data.city);
                }

                saveBtn.on("click", save);
            }
        }
    });
});