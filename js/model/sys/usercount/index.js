/**
 * Created by TT on 2017/4/6.
 */
;
spa_define(function () {
    return $.use(["spa", "code", "form", "util", "dict"], function (spa, code, form, util, dict) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_usercount_index");
                var cr = code.parseCode(root.find(".dt-tpl"));
                var myChart = echarts.init(document.getElementById('type'));
                var tableData = {data: []},
                    allData = [];

                cr.shell("count", function (env) {
                    var v = env.cd[this.k];
                    if (v === 0) {
                        return 0;
                    }
                    return v;
                });

                var query = function () {
                    if(allData != null) {
                        var td = tableData.data = [];
                        for(var i = 24; i < allData.length; ++i) {
                            var item = allData[i];
                            if(item) {
                                td.push(item);
                            }
                        }
                    } else {
                        tableData.data = allData;
                    }
                    cr.val(tableData.data);
                };

                var load = function () {
                    util.get("../ajax/operation/statist/userCount", null, function (data) {
                        allData = data || [];
                        query();
                        var colors = ['#c23531', '#82C8FA'];
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
                                // interval: 1,
                                min: 0
                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    dataZoom: {
                                        yAxisIndex: 'none'
                                    },
                                    dataView: {readOnly: false},
                                    magicType: {type: ['line', 'bar']},
                                    restore: {},
                                    saveAsImage: {}
                                }
                            },
                            dataZoom: [{
                                start: "80"
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
                        myChart.setOption(option);
                    }, {});
                };
                cr.listen(dict.doTransfer);
                load();
            },
            mainDestory: function () {

            }
        };
    });
});
