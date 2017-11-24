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
                        var cp =  dict.getCap(items, code.toString());
                        if (cp) {
                            return cp;
                        }else {
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
                                util.get("../ajax/article/id",{id:articleId}, function (data) {
                                    if (data) {
                                        $e.parent().find(".articleTitle").text(data.articleTitle);
                                        $e.parent().find(".professorName").text(data.professorName || data.organizationName);
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
                })
            },
            mainDestory: function () {
            }
        };
    });
});