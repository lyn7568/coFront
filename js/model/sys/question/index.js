/**
 * Created by TT on 2018/1/29.
 */
;
spa_define(function () {
    return $.use(["spa", "pagedatagrid", "util"], function (spa, pdgf, util) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_question_index");
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
                    root.find(".hand-col").each(function() {
                        var $e = $(this);
                        var qId = $e.attr("qId");
                        util.get("/ajax/content/countProfessor",{id:qId,type:8},function(data){
                            $e.text(data);
                        },{});
                        $e.removeClass("hand-col");
                    });
                    root.find(".table-opt a.name").on("click",function () {
                        var qId = $(this).parent().attr("qId");
                        // window.open('http://www.ekexiu.com/articalShow.html?articleId=' + articleId);
                        window.open('http://www.ekexiu.com/qa-show.html?id='+qId);
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
                    var $question = root.find("td.opt-check>i.checked");
                    if($question.length) {
                        if($question.length > 1) {
                            util.alert("只能选择一个问题");
                        } else {
                            util.boxMsg({
                                title: "删除问题",
                                content: "您是否要删除选中的问题！删除后不可恢复",
                                btns: [{
                                    caption: "确认",
                                    hand: function() {
                                        util.del("../ajax/qa/deleteQuestion", { id: $question.attr("qId") }, function() { pdg.reload() }, {});
                                    }
                                },
                                    { caption: "取消" }
                                ]
                            });
                        }
                    } else {
                        util.alert("请选择一个问题");
                    }
                });
                root.find(".opt-edit").on("click", function() {
                    var $question = root.find("td.opt-check>i.checked");
                    if ($question.length) {
                        if ($question.length>1) {
                            util.alert("只能选择一个问题");
                        }else {
                            $.util.get("../ajax/qa/question?id="+$question.attr("qId"),null,function(rd){
                                if(rd){
                                    spa.showModal("sys_question_edit", {
                                        data:rd,
                                        hand: function () {
                                            pdg.reload();
                                        }
                                    });
                                }else{
                                    util.alert("问题不存在");
                                }
                            },{});
                        }
                    }else {
                        util.alert("请选择一个问题");
                    }
                });
                root.find(".opt-edit2").on("click", function() {
                    var $question = root.find("td.opt-check>i.checked");
                    if ($question.length) {
                        if ($question.length>1) {
                            util.alert("只能选择一个问题");
                        }else {
                            $.util.get("../ajax/qa/question?id="+$question.attr("qId"),null,function(rd){
                                if(rd){
                                    spa.showModal("sys_question_edit2", {
                                        data:rd,
                                        hand: function () {
                                            pdg.reload();
                                        }
                                    });
                                }else{
                                    util.alert("问题不存在");
                                }
                            },{});
                        }
                    }else {
                        util.alert("请选择一个问题");
                    }
                });
                root.find(".opt-view").on("click", function () {
                    var $question = root.find("td.opt-check>i.checked");
                    if ($question.length) {
                        if ($question.length > 1) {
                            util.alert("只能选择一个问题");
                        } else {
                            var qId = $question.attr("qId");
                            window.open('http://www.ekexiu.com/qa-show.html?id='+qId);
                        }
                    } else {
                        util.alert("请选择一个问题");
                    }
                });
                root.find(".opt-keys").on("click", function () {
                    var $question = root.find("td.opt-check>i.checked");
                    if ($question.length) {
                        if ($question.length>1) {
                            util.alert("只能选择一个问题");
                        }else {
                            spa.showModal("sys_question_keys", {
                                id: $question.attr("qId"),
                                hand: function () {
                                    pdg.reload();
                                }
                            });
                        }
                    }else {
                        util.alert("请选择一个问题");
                    }
                });
                root.find(".opt-count").on("click", function () {
                    var $question = root.find("td.opt-check>i.checked");
                    if ($question.length) {
                        if ($question.length>1) {
                            util.alert("只能选择一篇问题");
                        }else {
                            spa.showModal("sys_question_count", {
                                id: $question.attr("qId"),
                                hand: function () {
                                    pdg.reload();
                                }
                            });
                        }
                    }else {
                        util.alert("请选择一篇问题");
                    }
                });

            }, mainDestory: function () {

            }
        };
    });
});