/**
 * Created by TT on 2017/4/6.
 */
;
spa_define(function () {
    return $.use(["spa", "code", "form", "util", "dict"], function (spa, code, form, util, dict) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_chart_index");
                var cr = code.parseCode(root.find(".dt-tpl"));
                var cr2 = code.parseCode(root.find(".dt-tpl-2"));
                var cr3 = form.build(root.find(".newForm"));
                var myChart = echarts.init(document.getElementById('type'));
                var tableData = {data: []}, tableData2 = {data: []},tableData3 = {data: []}
                    allData = [];

                cr.shell("userType", function (env) {
                    var v = env.cd[this.k];
                    return v === 1 ? "专家用户" : (v === 0 ? "普通用户" : "");
                });
                cr2.shell("userRole", function (env) {
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
                    if (allData.byType != null) {
                        tableData.data = allData.byType;
                    }
                    cr.val(tableData.data);
                };
                var query2 = function () {
                    if (allData.byRole != null) {
                        tableData2.data = allData.byRole;
                    }
                    cr2.val(tableData2.data);
                };
                var query3 = function () {
                    if (allData!=null) {
                        tableData3.data = allData;
                    }
                    cr3.val(tableData3.data);
                };
                var load = function () {
                    util.get("../ajax/operation/statist/user", null, function (data) {
                        allData = data || [];
                        query();
                        query2();
                        query3();
                        var option = {
                            title: {
                                text: '用户角色统计',
                                // subtext: '纯属虚构',
                                x: 'center'
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c} ({d}%)"
                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    mark: {show: true},
                                    dataView: {show: true, readOnly: false},
                                    magicType: {
                                        show: true,
                                        type: ['pie']
                                    },
                                    restore: {show: true},
                                    saveAsImage: {show: true}
                                }
                            },
                            calculable: true,
                            series: [
                                {
                                    name: '用户类型',
                                    type: 'pie',
                                    radius: '55%',
                                    center: ['25%', '60%'],
                                    data: [
                                        {value: 56, name: '在企人员'},
                                        {value: 1465, name: '科研工作者'},
                                    ]
                                },
                                {
                                    name: '用户角色',
                                    type: 'pie',
                                    radius: '55%',
                                    center: ['75%', '60%'],
                                    data: [
                                        {value: 56, name: '在企人员'},
                                        {value: 1465, name: '科研工作者'},
                                        {value: 10, name: '在校生'},
                                        {value: 19, name: '其他'},
                                    ]

                                }
                            ]
                        };
                        var showType = function (data) {
                            if (data.code === 1) {
                                return "专家用户";
                            }
                            return "普通用户";
                        };
                        var showRole = function (data) {
                            if (data.code === 1) {
                                return "科研工作者";
                            }
                            if (data.code === 2) {
                                return "在企人员";
                            }
                            if (data.code === 3) {
                                return "在校生";
                            }
                            return "其他身份";
                        }
                        for (var i = 0; i < allData.byType.length; i++) {
                            option.series[0].data[i].value = allData.byType[i].num;
                            option.series[0].data[i].name = showType(allData.byType[i]);
                        }
                        for (var i = 0; i < allData.byRole.length; i++) {
                            option.series[1].data[i].value = allData.byRole[i].num;
                            option.series[1].data[i].name = showRole(allData.byRole[i]);
                        }
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
