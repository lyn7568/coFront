/**
 * Created by TT on 2017/9/20.
 */
;
spa_define(function () {
    return $.use(["spa", "code", "form", "util", "dict"], function (spa, code, form, util, dict) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_article_count");
                // var cr = code.parseCode(root.find(".dt-tpl"));
                var myChart = echarts.init(document.getElementById('type'));
                var tableData = {data: []},
                    allData = [];
                var $data = {tn: "article", id:data.id};

                // cr.shell("count", function (env) {
                //     var v = env.cd[this.k];
                //     if (v === 0) {
                //         return 0;
                //     }
                //     return v;
                // });

                // var query = function () {
                //     if(allData != null) {
                //         var td = tableData.data = [];
                //         for(var i = allData.length-7; i < allData.length; ++i) {
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

                Date.prototype.format = function (fmt) {
                    var o = {
                        "M+": this.getMonth() + 1, //月份
                        "d+": this.getDate(), //日
                        "h+": this.getHours(), //小时
                        "m+": this.getMinutes(), //分
                        "s+": this.getSeconds(), //秒
                        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                        "S": this.getMilliseconds() //毫秒
                    };
                    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
                };

                var dayList = function () {
                    var dayList = [];
                    var now = new Date();
                    var day1 = new Date();
                    day1.setMonth(now.getMonth() - 1);
                    day1.setDate(1);
                    var day2 = new Date();
                    day2.setDate(day2.getDate() - 1);
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
                        url: "http://www.ekexiu.com:8082/log/jsonp/qm",
                        data:$data,
                        dataType: "jsonp",
                        success: function (data) {
                            allData = dayList();
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
                            var colors = ['#003366', "#660099", '#c23531', "#91C7AE"];
                            var option = {

                                color: colors,
                                title: {
                                    text: '文章流量分析',
                                    subtext: '分渠道'
                                },
                                tooltip: {
                                    trigger: 'axis'
                                },
                                legend: {
                                    data: ['合计', 'PC端', '移动端APP', '移动端H5']
                                },
                                xAxis: {
                                    data: allData.map(function (item) {
                                        return item.time;
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
                                        name: '合计',
                                        type: 'line',
                                        label: {
                                            normal: {
                                                show: true,
                                                position: 'top'
                                            }
                                        },
                                        data: allData.map(function (item) {
                                            return item.num;
                                        })
                                    },
                                    {
                                        name: 'PC端',
                                        type: 'line',
                                        data: allData.map(function (item) {
                                            return item.pc;
                                        })
                                    }, {
                                        name: '移动端APP',
                                        type: 'line',
                                        data: allData.map(function (item) {
                                            return item.app;
                                        })
                                    }, {
                                        name: '移动端H5',
                                        type: 'line',
                                        data: allData.map(function (item) {
                                            return item.h5;
                                        })
                                    }
                                ]
                            };
                            myChart.setOption(option);
                        }
                    });
                };
                // cr.listen(dict.doTransfer);
                load();
            }
        };
    });
});

