/**
 * Created by TT on 2017/4/19.
 */
/**
 * Created by TT on 2017/4/6.
 */
;
spa_define(function () {
    return $.use(["spa", "code", "form", "util", "dict"], function (spa, code, form, util, dict) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_chart_index");
                var qf = form.build(root.find(".queryForm"));
                var cr = code.parseCode(root.find(".dt-tpl"));
                var cr2 = code.parseCode(root.find(".dt-tpl-2"));
                var queryBtn = root.find(".queryForm .icon-search");
                var myChart1 = echarts.init(document.getElementById('type'));
                var tableData = {data: []}, tableData2 = {data: []},
                    allData = [];

                cr.shell("userType", function (env) {
                    var v = env.cd[this.k];
                    return v === 1 ? "专家用户" : (v === 0 ? "普通用户" : "");
                });
                cr2.shell("userRole",function (env) {
                    var v = env.cd[this.k];
                    if (v === 1) {
                        return "科研工作者";
                    }
                    if (v === 2) {
                        return "在企人员";
                    }
                    if (v === 3) {
                        return "在校生";
                    }
                    return "其他身份";
                });
                var query = function () {
                    var val = qf.item("qn").get();
                    if (val) {
                        var td = tableData.data = [];
                        if (allData.byType != null) {
                            for (var i = 0; i < allData.byType.length; ++i) {
                                var item = allData.byType[i];
                                if (item && item.name && item.name.indexOf(val) >= 0) {
                                    td.push(item);
                                }
                            }
                        }
                    } else {
                        tableData.data = allData.byType;
                    }
                    cr.val(tableData.data);
                };
                var query2 = function () {
                    var val = qf.item("qn2").get();
                    if (val) {
                        var td = tableData2.data = [];
                        if (allData.byRole != null) {
                            for (var i = 0; i < allData.byRole.length; ++i) {
                                var item = allData.byRole[i];
                                if (item && item.name && item.name.indexOf(val) >= 0) {
                                    td.push(item);
                                }
                            }
                        }
                    } else {
                        tableData2.data = allData.byRole;
                    }
                    cr2.val(tableData2.data);
                };
                var load = function () {
                    util.get("../ajax/operation/statist/user", null, function (data) {
                        allData = data || [];
                        query();
                        query2();
                        var option = {

                            color: colors,
                            title: {
                                text: '用户流量统计',
                                subtext: '最近7天'
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['新增用户', '新增激活用户']
                            },
                            xAxis: {
                                data: allData.map(function (item) {
                                    return item.createTime;
                                }),
                                boundaryGap: false
                            },
                            yAxis: {
                                splitLine: {
                                    show: false
                                },
                                boundaryGap: false,
                                type: "value",
                                interval: 1,
                                min: 0
                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    dataZoom: {
                                        yAxisIndex: 'none'
                                    },
                                    dataView: {readOnly: true},
                                    magicType: {type: ['line', 'bar']},
                                    restore: {},
                                    saveAsImage: {}
                                }
                            },
                            dataZoom: [{
                                startValue: ""
                            }, {
                                type: 'inside'
                            }],
                            visualMap: {
                                top: 10,
                                right: 10,
                            },
                            series: [{
                                name: '新增用户',
                                type: 'line',
                                data: allData.map(function (item) {
                                    return item.znum;
                                }),
                            }, {
                                name: '新增激活用户',
                                type: 'line',
                                data: allData.map(function (item) {
                                    return item.jnum;
                                })
                            }
                            ]
                        };
                        myChart1.setOption(option1);
                    }, {});
                };
                queryBtn.on("click", query());
                cr.listen(dict.doTransfer);
                root.on("click",".opt-new",function () {
                    load();
                });
            },
            mainDestory: function () {

            }
        };
    });
});
