/**
 * Created by TT on 2018/1/26.
 */
;
spa_define(function () {
    return $.use(["spa", "pagedatagrid", "util"], function (spa, pdgf, util) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_answer_index");
                var pdg = pdgf.build(root);
                pdg.code.shell("showDay", function (env) {
                    if (env.cd && env.cd[this.k]) {
                        var day = env.cd[this.k];
                        return day.substring(0, 4) + "年" + day.substring(4, 6) + "月" + day.substring(6, 8) + "日  " + day.substring(8, 10) + ":" + day.substring(10, 12);
                    }
                    return "";
                });
                pdg.code.listen($.dict.doTransfer);
                pdg.code.listen(function(){
                    root.find(".hand-lm").each(function() {
                        var $e = $(this);
                        var aId = $e.attr("aId");
                        if (aId) {
                            util.get("http://www.ekexiu.com/ajax/leavemsg/count", {sid: aId,stype:4}, function (data) {
                                $e.text(data);
                            }, {});
                            $e.removeClass("hand-lm");
                        }
                    });
                    root.find(".hand-col").each(function() {
                        var $e = $(this);
                        var aId = $e.attr("aId");
                        util.get("/ajax/content/countProfessor",{id:aId,type:9},function(data){
                            $e.text(data);
                        },{});
                        $e.removeClass("hand-col");
                    });
                    root.find(".table-opt a.name").on("click",function () {
                        var aId = $(this).parent().attr("aId");
                        var qId = $(this).parent().attr("qId");
                        // window.open('http://www.ekexiu.com/articalShow.html?articleId=' + articleId);
                        window.open('http://www.ekexiu.com/qa-show.html?id='+aId+'&topid=' + qId);
                    });
                    root.find("a.author").on("click",function () {
                        var professorId = $(this).parent().attr("professorId");
                        if(professorId){
                            window.open('http://www.ekexiu.com/userInforShow.html?professorId='+professorId);
                        }
                    })
                });

                root.find(".opt-query").on("click", function () {
                    pdg.load();
                });
                pdg.load();
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
                root.find(".opt-del").on("click", function() {
                    var $answer = root.find("td.opt-check>i.checked");
                    if($answer.length) {
                        if($answer.length > 1) {
                            util.alert("只能选择一篇回答");
                        } else {
                            util.boxMsg({
                                title: "删除回答",
                                content: "您是否要删除选中的回答！删除后不可恢复",
                                btns: [{
                                    caption: "确认",
                                    hand: function() {
                                        util.del("../ajax/qa/deleteAnswer", { id: $answer.attr("aId") }, function() { pdg.reload() }, {});
                                    }
                                },
                                    { caption: "取消" }
                                ]
                            });
                        }
                    } else {
                        util.alert("请选择一篇回答");
                    }
                });
                root.find(".opt-edit").on("click", function() {
                    var $answer = root.find("td.opt-check>i.checked");
                    if ($answer.length) {
                        if ($answer.length>1) {
                            util.alert("只能选择一篇回答");
                        }else {
                            spa.showModal("sys_answer_edit", {
                                id: $answer.attr("aId"),
                                hand: function () {
                                    pdg.reload();
                                }
                            });
                        }
                    }else {
                        util.alert("请选择一篇文章");
                    }
                });
                root.find(".opt-view").on("click", function () {
                    var $answer = root.find("td.opt-check>i.checked");
                    if ($answer.length) {
                        if ($answer.length > 1) {
                            util.alert("只能选择一篇回答");
                        } else {
                            var aId = $answer.attr("aId");
                            var qId = $answer.attr("qId");
                            window.open('http://www.ekexiu.com/qa-show.html?id='+aId+'&topid=' + qId);
                        }
                    } else {
                        util.alert("请选择一篇回答");
                    }
                });
                root.find(".opt-count").on("click", function () {
                    var $answer = root.find("td.opt-check>i.checked");
                    if ($answer.length) {
                        if ($answer.length>1) {
                            util.alert("只能选择一篇回答");
                        }else {
                            spa.showModal("sys_answer_count", {
                                id: $answer.attr("aId"),
                                hand: function () {
                                    pdg.reload();
                                }
                            });
                        }
                    }else {
                        util.alert("请选择一篇回答");
                    }
                });


            }, mainDestory: function () {

            }
        };
    });
});