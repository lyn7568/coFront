/**
 * Created by TT on 2017/4/19.
 */
;
spa_define(function () {
    return $.use(["spa", "code", "form", "util", "dict"], function (spa, code, form, util, dict) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_chart_index");
                var qf = form.build(root.find(".queryForm"));
                var queryBtn = root.find(".queryForm .icon-search");
                var myChart1 = echarts.init(document.getElementById('type'));
                var tableData = {data: []}, tableData2 = {data: []},
                    allData = [];

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
            },
            mainDestory: function () {

            }
        };
    });
});
