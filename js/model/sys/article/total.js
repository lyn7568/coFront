/**
 * Created by TT on 2017/11/24.
 */
;
spa_define(function () {
    return $.use(["spa", "code", "form", "util", "dict"], function (spa, code, form, util, dict) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_article_total");;
                var myChart = echarts.init(document.getElementById('type'));
                var tableData = {data: []},
                    allData = [];
                // var $data = {tn: "article", id:data.id};
                /*
                 用户流量统计表格 时间倒序
                 */
                // var query = function () {
                //     if(allData != null) {
                //         var td = tableData.data = [];
                //         for(var i = allData.length; i >= allData.length-7; --i) {
                //             var item = allData[i];
                //             if(item) {
                //                 td.push(item);
                //             }
                //         }
                //     } else {
                //         tableData.data = allData;
                //     }
                //     cr.val(tableData.data);
                // };
                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });


                var dayList = function () {
                    var dayList = [];
                    var now = new Date();
                    var day1 = new Date();
                    day1.setMonth(now.getMonth() - 1);
                    day1.setDate(1);
                    var day2 = new Date();
                    day2.setDate(day2.getDate());
//                    var s1 = day1.format("yyyy-MM-dd");
//                    var s2 = day2.format("yyyy-MM-dd");
//                    console.log(s1, s2);
                    var days = (day2 - day1) / (24 * 60 * 60 * 1000);
                    dayList[0] = {time: day1.format("yyyy-MM-dd")};
                    for (var i = 1; i < days + 1; i++) {
                        day1.setDate(day1.getDate() + 1);
                        dayList[i] = {time: day1.format("yyyy-MM-dd")};
                    }
                    return dayList;
                };
                var load = function () {
                    $.ajax({
                        type: "GET",
                        url: "/ajax/operation/statist/total",
                        success: function (data) {
                            allData = dayList();
                            console.log(allData)
                            allData.forEach(function (day) {
                                var time = (JSON.stringify(day.time)).replace(/\-|^\"|\"$/g, "");
                                day.pc = 0;
                                day.app = 0;
                                day.h5 = 0;
                                data.data.forEach(function (log) {
                                    if (time == log.day) {
                                        if (log.source == 1) {
                                            day.pc = log.pv;
                                        }
                                        if (log.source == 2) {
                                            day.app = log.pv;
                                        }
                                        if (log.source == 3) {
                                            day.h5 = log.pv;
                                        }
                                    }
                                    day.num = day.pc + day.app + day.h5;
                                })
                            });
                            var colors = ['#003366', "#660099", '#c23531', "#c23531"];
                            var option = {

                                // color: colors,
                                title: {
                                    text: '文章总浏览量',
                                    subtext: '分渠道'
                                },
                                tooltip: {
                                    trigger: 'axis',
                                    // formatter:function (params) {
                                    //     // return params[0].name + '<br/>'
                                    //     //     + params[3].seriesName + ' : ' + (params[2].value + params[1].value + params[0].value)+ '<br/>'
                                    //     //     + params[2].seriesName + ' : ' + params[2].value + '<br/>'
                                    //     //     + params[1].seriesName + ' : ' + params[1].value + '<br/>'
                                    //     //     + params[0].seriesName + ' : ' + params[0].value + '<br/>';
                                    //     console.log(params);
                                    // },
                                    "axisPointer": {
                                        "type": "shadow",
                                        textStyle: {
                                            color: "#fff"
                                        }

                                    }
                                },
                                legend: {
                                    // selectedMode:false,
                                    data: ['PC端', '移动端APP', '移动端H5','合计']
                                },
                                xAxis: {
                                    "type": "category",
                                    "axisLine": {
                                        lineStyle: {
                                            color: '#90979c'
                                        }
                                    },
                                    "splitLine": {
                                        "show": false
                                    },
                                    "axisTick": {
                                        "show": false
                                    },
                                    "splitArea": {
                                        "show": false
                                    },
                                    axisLabel: {
                                        showMinLabel:true,
                                        showMaxLabel:true
                                    },
                                    "data": allData.map(function (item) {
                                        return item.time;
                                    })
                                },
                                yAxis: {
                                    "type": "value",
                                    "splitLine": {
                                        "show": false
                                    },
                                    "axisLine": {
                                        lineStyle: {
                                            color: '#90979c'
                                        }
                                    },
                                    "axisTick": {
                                        "show": false
                                    },
                                    "axisLabel": {
                                        showMinLabel:true,
                                        showMaxLabel:true
                                    },
                                    "splitArea": {
                                        "show": false
                                    }
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
                                    startValue: allData[allData.length - 7].time
                                }, {
                                    type: 'inside'
                                }],
                                visualMap: {
                                    top: 10,
                                    right: 10
                                },
                                series: [
                                    {
                                        name: '移动端H5',
                                        type: 'bar',
                                        stack: '总量',
                                        "barMaxWidth": 35,
                                        "barGap": "10%",
                                        "itemStyle": {
                                            "normal": {
                                                "color": "#dd4444",
                                                "label": {
                                                    "show": false,
                                                    "textStyle": {
                                                        "color": "#fff"
                                                    },
                                                    "position": "insideTop",
                                                    formatter: function(p) {
                                                        return p.value > 0 ? (p.value) : '';
                                                    }
                                                }
                                            }
                                        },
                                        data: allData.map(function (item) {
                                            return item.h5;
                                        })
                                    },
                                    {
                                        name: 'PC端',
                                        type: 'bar',
                                        stack: '总量',
                                        "barMaxWidth": 35,
                                        "barGap": "10%",
                                        "itemStyle": {
                                            "normal": {
                                                "color": "#80F1BE",
                                                "label": {
                                                    "show": false,
                                                    "textStyle": {
                                                        "color": "#fff"
                                                    },
                                                    "position": "insideTop",
                                                    formatter: function(p) {
                                                        return p.value > 0 ? (p.value) : '';
                                                    }
                                                }
                                            }
                                        },
                                        data: allData.map(function (item) {
                                            return item.pc;
                                        })
                                    }, {
                                        name: '移动端APP',
                                        type: 'bar',
                                        stack: '总量',
                                        "barMaxWidth": 35,
                                        "barGap": "10%",
                                        "itemStyle": {
                                            "normal": {
                                                "color": "#fec42c",
                                                "label": {
                                                    "show": false,
                                                    "textStyle": {
                                                        "color": "#fff"
                                                    },
                                                    "position": "insideTop",
                                                    formatter: function(p) {
                                                        return p.value > 0 ? (p.value) : '';
                                                    }
                                                }
                                            }
                                        },
                                        data: allData.map(function (item) {
                                            return item.app;
                                        })
                                    },
                                    {
                                        name: '合计',
                                        type: 'line',
                                        stack: '总量',
                                        symbolSize:7,
                                        symbol:'circle',
                                        // areaStyle: {normal: {}},
                                        // label: {
                                        //     normal: {
                                        //         show: true,
                                        //         position: 'top',
                                        //         formatter: function (params) {
                                        //             for (var i = 0, l = option.xAxis.data.length; i < l; i++) {
                                        //                 if (option.xAxis.data[i] == params.name) {
                                        //                     // option.series[0].data[i];
                                        //                     var num = option.series[0].data[i]+option.series[1].data[i]+option.series[2].data[i];
                                        //                     return '合计：' + num;
                                        //                 }
                                        //             }
                                        //         }
                                        //
                                        //     }
                                        // },
                                        itemStyle:{
                                            normal:{
                                                color:"#dd4444",
                                                barBorderRadius:0,
                                                label:{
                                                    show:true,
                                                    position:"top",
                                                    formatter:function (params) {
                                                        return params.val;
                                                    }
                                                }
                                            }
                                        },
                                        data: allData.map(function (item) {
                                            return item.num;
                                        })
                                    }
                                ]
                            };
                            myChart.setOption(option);
                        }
                    });
                };
                load();
            }
        };
    });
});



