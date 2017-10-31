/**
 * Created by TT on 2017/9/25.
 */
;
spa_define(function () {
    return $.use(["spa", "code", "form", "util", "dict"], function (spa, code, form, util, dict) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_searchword_index");
                var qf = form.build(root.find(".queryForm"));
                var cr = code.parseCode(root.find(".dt-tpl"));
                var queryBtn = root.find(".queryForm .opt-query");
                var tableData = {data: []},
                    allData = [],
                    $data = {tn: "kw"};

                var now = new Date(),
                    nbt = new Date();
                nbt.setDate(now.getDate() - 7);
                var et1 = now.format("yyyyMMdd"),
                    bt1 = nbt.format("yyyyMMdd");
                qf.val({bt: bt1, et: et1});
                $data.bt = bt1;
                $data.et = et1;

                var load = function () {
                        $.ajax({
                            type: "GET",
                            url: "http://www.ekexiu.com:8082/log/jsonp/qs",
                            data: $data,
                            dataType: "jsonp",
                            success: function (data) {
                                allData = data.data || [];
                                tableData.data = allData;
                                cr.val(tableData.data);
                            }
                        });
                    },
                    query = function () {
                        // if (qf.val().bt && qf.val().et) {
                        $data.bt = qf.val().bt;
                        $data.et = qf.val().et;
                        // }else {
                        //     $data.bt = "";
                        //     $data.et = "";
                        // }
                        load();
                    };


                queryBtn.on("click", query);
                load();

            },
            mainDestory: function () {
            }
        };
    });
});
