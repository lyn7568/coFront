/**
 * Created by TT on 2017/8/3.
 */
;
spa_define(function () {
    return $.use(["spa", "pagedatagrid", "util"], function (spa, pdgf, util) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_article_index");
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
                    root.find(".hand-articleid").each(function() {
                        var $e = $(this);
                        var articleid = $e.attr("articleid");
                        if (articleid) {
                            util.get("/ajax/content/lwCount", {articleId: articleid}, function (data) {
                                $e.text(data);
                            }, {});
                            $e.removeClass("hand-articleid");
                        }
                    });
                    root.find(".hand-collectionid").each(function() {
                        var $e = $(this);
                        var collectionid = $e.attr("collectionid");
                        util.get("/ajax/content/countProfessor",{id:collectionid,type:3},function(data){
                            $e.text(data);
                        },{});
                        $e.removeClass("hand-collectionid");
                    });
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
                    var $org = root.find("td.opt-check>i.checked");
                    if($org.length) {
                        var ret = [];
                        $org.each(function() {
                            ret.push($(this).attr("articleId"));
                        });
                        util.boxMsg({
                            title: "确认删除",
                            content: "您是否要删除选中的文章？",
                            btns: [{
                                caption: "删除",
                                hand: function () {
                                    util.post("../ajax/article/deleteArticle", {articleIds: ret}, function () {
                                        pdg.reload()
                                    }, {});
                                }
                            },
                                {caption: "取消"}
                            ]
                        });
                    } else {
                        util.alert("请选择一个用户");
                    }
                });
                root.find(".opt-sort-num").on("click", function() {
                    var $article = root.find("td.opt-check>i.checked");
                    if($article.length) {
                        if($article.length > 1) {
                            util.alert("只能选择一篇文章");
                        } else {
                            $.util.get("../ajax/article/id/"+$article.attr("articleId"),null,function(rd){
                                if(rd){
                                    spa.showModal("sys_article_sort", { data:rd, hand: function() { pdg.reload() } })
                                }else{
                                    util.alertMsg("文章不存在", function(){pdg.load();});
                                }
                            },{});
                        }
                    } else {
                        util.alert("请选择一篇文章");
                    }
                });
                root.find(".opt-col-num").on("click", function () {
                    var $article = root.find("td.opt-check>i.checked");
                    if ($article.length) {
                        var articles = [];
                        $article.each(function () {
                            articles.push($(this).attr("articleId"));
                        });
                        if (articles) {
                            spa.showModal("sys_article_colnum", {
                                data: articles, hand: function () {
                                    pdg.reload();
                                }
                            });
                        } else {
                            util.alertMsg("文章不存在", function () {
                                pdg.load();
                            });
                        }
                    } else {
                        util.alert("请选择一篇文章");
                    }
                });
                root.find(".opt-subject").on("click", function() {
                    var $article = root.find("td.opt-check>i.checked");
                    if($article.length) {
                        if($article.length > 1) {
                            util.alert("只能选择一篇文章");
                        } else {
                            $.util.get("../ajax/article/id/"+$article.attr("articleId"),null,function(rd){
                                if(rd){
                                    spa.showModal("sys_article_subject", { data:rd, hand: function() { pdg.reload() } })
                                }else{
                                    util.alertMsg("文章不存在", function(){pdg.load();});
                                }
                            },{});
                        }
                    } else {
                        util.alert("请选择一篇文章");
                    }
                });
                root.find(".opt-edit").on("click", function() {
                    var $article = root.find("td.opt-check>i.checked");
                    if($article.length) {
                        if($article.length > 1) {
                            util.alert("只能选择一篇文章");
                        } else {
                            // $.util.get("../ajax/article/id/"+$article.attr("articleId"),null,function(rd){
                            //     if(rd){
                                    window.open('http://www.ekexiu.com:81/html/model/sys/article/articleModify.html?articleId=' + $article.attr("articleId"));
                            //     }else{
                            //         util.alertMsg("文章不存在", function(){pdg.reload();});
                            //     }
                            // },{});
                        }
                    } else {
                        util.alert("请选择一篇文章");
                    }
                });

                root.find(".opt-relate").on("click", function() {
                    var $article = root.find("td.opt-check>i.checked");
                    if($article.length) {
                        if($article.length > 1) {
                            util.alert("只能选择一篇文章");
                        } else {
                            $.util.get("../ajax/article/id/" + $article.attr("articleId"), null, function (rd) {
                                if (rd) {
                                    spa.showModal("sys_article_relate", {
                                        data: rd, hand: function () {
                                            pdg.reload()
                                        }
                                    })
                                } else {
                                    util.alertMsg("文章不存在", function () {
                                        pdg.reload();
                                    });
                                }
                            }, {});
                        }
                    } else {
                        util.alert("请选择一篇文章");
                    }
                });
                root.find(".opt-view").on("click", function () {
                    var $org = root.find("td.opt-check>i.checked");
                    if ($org.length) {
                        if ($org.length > 1) {
                            util.alert("只能选择一篇文章");
                        } else {
                            window.open('http://www.ekexiu.com/articalShow.html?articleId=' + $org.attr("articleId"));
                        }
                    } else {
                        util.alert("请选择一篇文章");
                    }
                });
                root.find(".opt-count").on("click", function () {
                    var $article = root.find("td.opt-check>i.checked");
                    if ($article.length) {
                        if ($article.length>1) {
                            util.alert("只能选择一篇文章");
                        }else {
                            spa.showModal("sys_article_count", {
                                id: $article.attr("articleId"),
                                hand: function () {
                                    pdg.reload();
                                }
                            });
                        }
                    }else {
                        util.alert("请选择一篇文章");
                    }
                });


            }, mainDestory: function () {

            }
        };
    });
});

