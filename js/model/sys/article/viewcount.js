/**
 * Created by TT on 2017/9/22.
 */
;
spa_define(function () {
    return $.use(["spa", "code", "form", "util", "dict"], function (spa, code, form, util, dict) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_article_viewcount");
                var qf = form.build(root.find(".queryForm"));
                var cr = code.parseCode(root.find(".dt-tpl"));
                var queryBtn = root.find(".queryForm .opt-query");
                var tableData = {data: []},
                    allData = [],
                    $data = {tn: "article"};

                var now = new Date(),
                    nbt = new Date();
                nbt.setDate(now.getDate() - 7);
                var et1 = now.format("yyyyMMdd"),
                    bt1 = nbt.format("yyyyMMdd");
                qf.val({bt: bt1, et: et1});
                $data.bt = bt1;
                $data.et = et1;

                var caption = function (dicts, code) {
                        var items = dict.get(dicts);
                        var cp = dict.getCap(items, code.toString());
                        if (cp) {
                            return cp;
                        } else {
                            return "不可翻译的";
                        }
                        // return dict.get(dicts)[code].caption;
                    },
                    showDay = function (day) {
                        if (day) {
                            return day.substring(0, 4) + "年" + day.substring(4, 6) + "月" + day.substring(6, 8) + "日";
                        } else return "";
                    },
                    loadContent = function () {
                        root.find(".hand-id").each(function () {
                            var $e = $(this);
                            var articleId = $e.attr("articleId");
                            if (articleId) {
                                util.get("../ajax/article/base", {id: articleId}, function (data) {
                                    if (data) {
                                        $e.parent().find(".articleTitle .name").text(data.articleTitle).attr('shareId',data.shareId).attr('createTime',data.createTime);
                                        $e.parent().find(".professorName .author").text(data.professorName || data.organizationName).attr('professorId',data.professorId).attr('orgId',data.orgId);
                                        $e.parent().find(".subject").text(data.subject);
                                        $e.parent().find(".colNum").text(caption("banner", data.colNum));
                                        $e.parent().find(".publishTime").text(showDay(data.publishTime));
                                        $e.parent().find(".sortNum").text(data.sortNum);
                                        $e.parent().find(".pageViews").text(data.pageViews);
                                        $e.parent().find(".articleAgree").text(data.articleAgree);
                                    }
                                }, {});
                                //     // $e.removeClass("hand-id");
                            }
                        });
                    },
                    loadLw = function () {
                        root.find(".hand-id").each(function () {
                            var $e = $(this);
                            var articleId = $e.attr("articleId");
                            if (articleId) {
                                util.get("/ajax/content/lwCount", {articleId: articleId}, function (data) {
                                        $e.parent().find(".lw").text(data);
                                }, {});
                            }
                        });
                    },
                    loadCol=function () {
                        root.find(".hand-id").each(function () {
                            var $e = $(this);
                            var articleId = $e.attr("articleId");
                            if (articleId) {
                                util.get("/ajax/content/countProfessor", {id: articleId,type:3}, function (data) {
                                        $e.parent().find(".collection").text(data);
                                }, {});
                            }
                        });
                    },
                    load = function () {
                        // console.log($data);
                        $.ajax({
                            type: "GET",
                            url: "http://www.ekexiu.com:8082/log/jsonp/qs",
                            data: $data,
                            dataType: "jsonp",
                            success: function (data) {
                                // console.log(data);
                                allData = data.data || [];
                                // allData = [{
                                //     id: "8F08D2EB366140BC85A6A4CE344A15A4"
                                // }, {
                                //     id: "8DE678A43FFB4097B3E0DFF9C48CC737"
                                // }];
                                tableData.data = allData;
                                cr.val(tableData.data);
                                loadContent();
                                loadLw();
                                loadCol();
                            }
                        });
                    },
                    query = function () {
                        // if (qf.val().bt || qf.val().et) {
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
                root.find(".dt-tpl").on("click", "th.opt-check>i.icon-st-check", function () {
                    var $this = $(this);
                    $this.toggleClass("checked");
                    if ($this.hasClass("checked")) {
                        root.find(".dt-tpl td.opt-check>i.icon-st-check").addClass("checked");
                    } else {
                        root.find(".dt-tpl td.opt-check>i.icon-st-check").removeClass("checked");
                    }
                });
                root.find(".dt-tpl").on("click", "td.opt-check>i.icon-st-check", function () {
                    var $this = $(this);
                    $this.toggleClass("checked");
                });
                root.find(".opt-total").on("click", function () {
                    spa.showModal("sys_article_total");
                });
                root.on("click",".icon-line-chart",function () {
                    var $this = $(this);
                    var articleId = $this.parent().attr("articleId");
                    spa.showModal("sys_article_count",{
                        id:articleId,
                        hand:function () {
                            pdg.reload();
                        }
                    })
                });
                root.on("click",".articleTitle a.name",function () {
                    var articleId = $(this).attr("articleId");
                    var time = $(this).attr("createTime").substring(0,8);
                    var shareId = $(this).attr("shareId");
                    // window.open('http://www.ekexiu.com/articalShow.html?articleId=' + articleId);
                    window.open('http://www.ekexiu.com/shtml/a/'+time+'/' + shareId+'.html');
                });
                root.on("click",".professorName a.author",function () {
                    var professorId = $(this).attr("professorId");
                    var orgId = $(this).attr("orgId");
                    if(orgId) {
                        window.open('http://www.ekexiu.com/cmpInforShow.html?orgId='+orgId);
                    }else if(professorId){
                        window.open('http://www.ekexiu.com/userInforShow.html?professorId='+professorId);
                    }
                })
                var myChart = echarts.init(document.getElementById('total'));
                var tableData = {data: []},
                    allData = [];
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
                var loadChart = function () {
                    $.ajax({
                        type: "GET",
                        url: "/ajax/operation/statist/total",
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
                loadChart();
            },
            mainDestory: function () {
            }
        };
    });
});