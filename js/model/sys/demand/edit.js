;
spa_define(function () {
    return $.use(["spa", "code", "util", "form"], function (spa, code, util, form) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_demand_edit");
                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                var ef = form.build(root.find(".opt-form"));

                var day = data.data.createTime;
                data.data.day = day.substring(0, 4) + "年" + day.substring(4, 6) + "月" + day.substring(6, 8) + "日";
                ef.val(data.data);
                var cr = code.parseCode(root.find(".dt-tpl"));
                cr.shell("showDay", function (env) {
                    if (env.cd && env.cd[this.k]) {
                        var day = env.cd[this.k];
                        return day.substring(0, 4) + "-" + day.substring(4, 6) + "-" + day.substring(6, 8);
                    }
                    return "";
                });
                cr.shell("struts", function (env) {
                    var v = env.cd[this.k];
                    if (v === 1) {
                        return "已完成";
                    }
                    if (v === 2) {
                        return "待回复";
                    }
                    if (v === 3) {
                        return "已谢绝";
                    }
                    return "进行中";
                });
                var allData;
                util.get("../ajax/demand/demandId/" + data.data.demandId, null, function (data) {
                    allData = data || [];
                    cr.val(data);
                }, {});
                root.on("click", ".table-opt", function () {
                    var id = $(".id").attr("consultId");
                    window.open('http://www.ekexiu.com/diloags.html?attrParams=consultId&consultId=' + id);
                });

            }
        };
    });
});