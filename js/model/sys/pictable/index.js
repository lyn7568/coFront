;
spa_define(function () {
    return $.use(["spa", "code", "form", "util", "dict"], function (spa, code, form, util, dict) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_pictable_index");
                var cr = code.parseCode(root.find(".dt-tpl-2"));
                var myChart = echarts.init(document.getElementById('type'));

                var dynUser = {ready: true};

                util.get("../ajax/sys/user/all",null,function(data){
                    var items =dynUser.items = [];
                    data.forEach(function(item){
                        items.push({code:item.id,caption:item.name});
                    });
                    root.find(".dyn-select").attr("defVal",util.data("loginUser").id);
                    dynUser.formRef = form.build(root.find(".dt-form"),{name:dynUser});
                });

                cr.shell("count", function (env) {
                    var v = env.cd[this.k];
                    if (v === 0) {
                        return 0;
                    }
                    return v;
                });

                var loadChart = function () {
                    util.get("../ajax/sys/user/pictable/"+util.data("loginUser").id,null,function (data) {
                        var colors = ['#c23531', '#82C8FA'];
                        var option = {
                            color: colors,
                            title: {
                                text: '个人业绩统计',
                                subtext: '最近7天'
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['新增用户', '新增激活用户']
                            },
                            xAxis: {
                                data: data.map(function (item) {
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
                                data: data.map(function (item) {
                                    return item.znum;
                                }),
                            }, {
                                name: '新增激活用户',
                                type: 'line',
                                data: data.map(function (item) {
                                    return item.jnum;
                                })
                            }
                            ]
                        };
                        cr.val(data);
                        myChart.setOption(option);
                    })
                };
                root.find(".opt-query").on("click", function () {
                    $.util.get("../ajax/sys/user/pictable/" + dynUser.formRef.val().name, null, function (data) {
                        var colors = ['#c23531', '#82C8FA'];
                        var option = {
                            color: colors,
                            title: {
                                text: '个人业绩统计',
                                subtext: '最近7天'
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['新增用户', '新增激活用户']
                            },
                            xAxis: {
                                data: data.map(function (item) {
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
                                data: data.map(function (item) {
                                    return item.znum;
                                }),
                            }, {
                                name: '新增激活用户',
                                type: 'line',
                                data: data.map(function (item) {
                                    return item.jnum;
                                })
                            }
                            ]
                        };
                        myChart.setOption(option);
                        cr.val(data);
                    });
                });
                cr.listen(dict.doTransfer);
                loadChart();


            }
        }
    });
});
