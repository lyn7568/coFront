/**
 * Created by TT on 2017/8/9.
 */
;
spa_define(function () {
    return $.use(["spa", "pagedatagrid", "util"], function (spa, pdgf, util) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_patent_index");
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
                    root.find(".hand-patentid").each(function() {
                        var $e = $(this);
                        var patentid = $e.attr("patentid");
                        if (patentid) {
                            util.get("http://www.ekexiu.com/ajax/leavemsg/count", {sid: patentid,stype:3}, function (data) {
                                $e.text(data);
                            }, {});
                            $e.removeClass("hand-patentid");
                        }
                    });
                    root.find(".hand-collectionid").each(function() {
                        var $e = $(this);
                        var collectionid = $e.attr("collectionid");
                        util.get("/ajax/content/countProfessor",{id:collectionid,type:4},function(data){
                            $e.text(data);
                        },{});
                        $e.removeClass("hand-collectionid");
                    });
                    root.find(".hand-agreeid").each(function() {
                        var $e = $(this);
                        var agreeid = $e.attr("agreeid");
                        util.get("/ajax/patent/agreeCount",{id:agreeid},function(data){
                            $e.text(data);
                        },{});
                        $e.removeClass("hand-agreeid");
                    });
                    root.find(".table-opt a.name").on("click",function () {
                        // var patentId = $(this).parent().attr("patentid");
                        var time = $(this).parent().attr("createTime").substring(0,8);
                        var shareId = $(this).parent().attr("shareId");
                        // window.open('http://www.ekexiu.com/patentShow.html?patentId=' + patentId);
                        window.open('http://www.ekexiu.com/shtml/pt/'+time+'/' + shareId+'.html');
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
                // root.find(".opt-del").on("click", function() {
                //     var $org = root.find("td.opt-check>i.checked");
                //     if($org.length) {
                //         var ret = [];
                //         $org.each(function() {
                //             ret.push($(this).attr("articleId"));
                //         });
                //         util.boxMsg({
                //             title: "确认删除",
                //             content: "您是否要删除选中的文章？",
                //             btns: [{
                //                 caption: "删除",
                //                 hand: function () {
                //                     util.post("../ajax/patent/deleteArticle", {articleIds: ret}, function () {
                //                         pdg.reload()
                //                     }, {});
                //                 }
                //             },
                //                 {caption: "取消"}
                //             ]
                //         });
                //     } else {
                //         util.alert("请选择一个用户");
                //     }
                // });
                root.find(".opt-sort-num").on("click", function() {
                    var $patent = root.find("td.opt-check>i.checked");
                    if($patent.length) {
                        if($patent.length > 1) {
                            util.alert("只能选择一篇资源");
                        } else {
                            $.util.get("../ajax/patent/id/"+$patent.attr("patentId"),null,function(rd){
                                if(rd){
                                    spa.showModal("sys_patent_sort", { data:rd, hand: function() { pdg.reload() } })
                                }else{
                                    util.alertMsg("资源不存在", function(){pdg.reload();});
                                }
                            },{});
                        }
                    } else {
                        util.alert("请选择一篇资源");
                    }
                });
                root.find(".opt-keyword").on("click", function () {
                    var $patent = root.find("td.opt-check>i.checked");
                    if ($patent.length) {
                        if ($patent.length > 1) {
                            util.alert("只能选择一篇资源");
                        } else {
                            $.util.get("../ajax/patent/id/" + $patent.attr("patentId"), null, function (rd) {
                                if (rd) {
                                    spa.showModal("sys_patent_keyword", {
                                        data: rd, hand: function () {
                                            pdg.reload()
                                        }
                                    })
                                } else {
                                    util.alertMsg("资源不存在", function () {
                                        pdg.reload();
                                    });
                                }
                            }, {});
                        }
                    } else {
                        util.alert("请选择一篇资源");
                    }
                });
                root.find(".opt-view").on("click", function () {
                    var $patent = root.find("td.opt-check>i.checked");
                    if ($patent.length) {
                        if ($patent.length > 1) {
                            util.alert("只能选择一篇资源");
                        } else {
                            var time = $patent.attr("createTime").substring(0,8);
                            var shareId = $patent.attr("shareId");
                            // window.open('http://www.ekexiu.com/patentShow.html?patentId=' + $patent.attr("patentId"));
                            window.open('http://www.ekexiu.com/shtml/pt/'+time+'/' + shareId+'.html');
                        }
                    } else {
                        util.alert("请选择一篇资源");
                    }
                });


            }, mainDestory: function () {

            }
        };
    });
});

