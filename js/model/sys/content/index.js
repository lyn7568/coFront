/**
 * Created by TT on 2017/7/27.
 */
;
spa_define(function () {
    return $.use(["spa", "pagedatagrid", "util"], function (spa, pdgf, util) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_content_index");
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
                    var type = pdg.queryParam().contentType;
                    root.find(".hand-objid").each(function() {
                        var $e = $(this);
                        var objid = $e.attr("objid");
                        if (objid) {
                            if(type == 3) {
                                util.get("/ajax/content/lwCount", {articleId: objid}, function (data) {
                                    $e.text(data);
                                }, {});
                                $e.removeClass("hand-objid");
                            }
                            if (type == 4 ) {
                                util.get("/ajax/content/lwCount/patent", {patentId: objid}, function (data) {
                                    $e.text(data);
                                }, {});
                                $e.removeClass("hand-objid");
                            }
                            if (type == 5 ) {
                                util.get("/ajax/content/lwCount/paper", {paperId: objid}, function (data) {
                                    $e.text(data);
                                }, {});
                                $e.removeClass("hand-objid");
                            }
                        }
                    });
                    root.find(".hand-collectionid").each(function() {
                        var $e = $(this);
                        var collectionid = $e.attr("collectionid");
                        util.get("/ajax/content/countProfessor",{id:collectionid,type:type},function(data){
                                $e.text(data);
                        },{});
                        $e.removeClass("hand-collectionid");
                    });
                    root.find(".hand-agreeid").each(function() {
                        var $e = $(this);
                        var agreeid = $e.attr("agreeid");
                        if (type == 4) {
                            util.get("/ajax/patent/agreeCount",{id:agreeid},function(data){
                                $e.text(data);
                            },{});
                            $e.removeClass("hand-agreeid");
                        }
                        if (type == 5) {
                            util.get("/ajax/paper/agreeCount",{id:agreeid},function(data){
                                $e.text(data);
                            },{});
                            $e.removeClass("hand-agreeid");
                        }
                    });
                    if (type == 3 || type==2 ) {
                        $(".create").hide();
                    } else {
                        $(".publish").hide();
                    }
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

                root.find(".opt-view").on("click", function () {
                    var $org = root.find("td.opt-check>i.checked");
                    var time = $org.attr("createTime").substring(0,8);
                    var shareId = $org.attr("shareId");
                    var contentType = pdg.queryParam().contentType;
                    if ($org.length) {
                        if ($org.length > 1) {
                            util.alert("只能选择一个用户");
                        } else {
                            if ( contentType==3){//文章
                                // window.open('http://www.ekexiu.com/articalShow.html?articleId=' + $org.attr("contentId"));
                                window.open('http://192.168.3.233:81/shtml/a/'+time+'/' + shareId+'.html');
                            }else if ( contentType== 2){//资源
                                window.open('http://www.ekexiu.com/resourceShow.html?resourceId=' + $org.attr("contentId"));
                            }else if ( contentType==4){//专利
                                // window.open('http://www.ekexiu.com/patentShow.html?patentId=' + $org.attr("contentId"));
                                window.open('http://192.168.3.233:81/shtml/pt/'+time+'/' + shareId+'.html');
                            }else if ( contentType==5){//论文
                                // window.open('http://www.ekexiu.com/paperShow.html?paperId=' + $org.attr("contentId"));
                                window.open('http://192.168.3.233:81/shtml/pp/'+time+'/' + shareId+'.html');
                            }
                        }
                    } else {
                        util.alert("请选择一个用户");
                    }
                });


            }, mainDestory: function () {

            }
        };
    });
});
