/**
 * Created by TT on 2017/8/9.
 */
;
spa_define(function () {
    return $.use(["spa", "pagedatagrid", "util"], function (spa, pdgf, util) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_resourceinfo_index");
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

                    root.find(".hand-contacts").each(function () {
                        var $e = $(this);
                        var resourceId = $e.attr("resourceId");
                        util.get("../ajax/resource/pro", {id: resourceId}, function (data) {
                            var proName = [];
                            data.forEach(function (item) {
                                util.get("../ajax/sys/professor/getName/" + item.professorId, null, function (data) {
                                    // proName = proName + data;
                                    proName.push(data);
                                    $e.text(proName);
                                })
                            });
                        });
                        $e.removeClass("hand-contacts");
                    });

                    root.find(".hand-collectionid").each(function() {
                        var $e = $(this);
                        var collectionid = $e.attr("collectionid");
                        util.get("/ajax/content/countProfessor",{id:collectionid,type:2},function(data){
                            $e.text(data);
                        },{});
                        $e.removeClass("hand-collectionid");
                    });
                    root.find(".table-opt a.name").on("click",function () {
                        var resourceId = $(this).parent().attr("resourceId");
                        window.open('http://www.ekexiu.com/resourceShow.html?resourceId=' + resourceId);
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
                    var $resource = root.find("td.opt-check>i.checked");
                    if ($resource.length) {
                        var ret = [];
                        $resource.each(function() {
                            ret.push($(this).attr("resourceId"));
                        });
                        util.boxMsg({
                            title: "确认删除",
                            content: "您是否要删除选中的资源？",
                            btns: [{
                                caption: "删除",
                                hand: function () {
                                    util.post("../ajax/resource/deleteResource", {resourceIds:ret}, function () {
                                        pdg.reload()
                                    }, {});
                                }
                            },
                                {caption: "取消"}
                            ]
                        });
                    } else {
                        util.alert("请选择一个资源");
                    }
                });
                root.find(".opt-sort-num").on("click", function() {
                    var $resource = root.find("td.opt-check>i.checked");
                    if($resource.length) {
                        if($resource.length > 1) {
                            util.alert("只能选择一个资源");
                        } else {
                            $.util.get("../ajax/resource/id/"+$resource.attr("resourceId"),null,function(rd){
                                if(rd){
                                    spa.showModal("sys_resourceinfo_sort", { data:rd, hand: function() { pdg.reload() } })
                                }else{
                                    util.alertMsg("资源不存在", function(){pdg.reload();});
                                }
                            },{});
                        }
                    } else {
                        util.alert("请选择一个资源");
                    }
                });
                root.find(".opt-subject").on("click", function() {
                    var $resource = root.find("td.opt-check>i.checked");
                    if($resource.length) {
                        if($resource.length > 1) {
                            util.alert("只能选择一个资源");
                        } else {
                            $.util.get("../ajax/resource/id/"+$resource.attr("resourceId"),null,function(rd){
                                if(rd){
                                    spa.showModal("sys_resourceinfo_subject", { data:rd, hand: function() { pdg.reload() } })
                                }else{
                                    util.alertMsg("资源不存在", function(){pdg.reload();});
                                }
                            },{});
                        }
                    } else {
                        util.alert("请选择一个资源");
                    }
                });
                root.find(".opt-view").on("click", function () {
                    var $resource = root.find("td.opt-check>i.checked");
                    if ($resource.length) {
                        if ($resource.length > 1) {
                            util.alert("只能选择一个资源");
                        } else {
                            window.open('http://www.ekexiu.com/resourceShow.html?resourceId=' + $resource.attr("resourceId"));
                        }
                    } else {
                        util.alert("请选择一个资源");
                    }
                });

                root.find(".opt-edit").on("click", function() {
                    var $resource = root.find("td.opt-check>i.checked");
                    if($resource.length) {
                        if($resource.length > 1) {
                            util.alert("只能选择一个资源");
                        } else {
                            // $.util.get("../ajax/article/id/"+$resource.attr("articleId"),null,function(rd){
                            //     if(rd){
                            //         window.open('http://www.ekexiu.com:81/html/model/resourceinfo/resourceIssue.html?resourceId=' + $resource.attr("resourceId"));
                            window.open('http://'+window.location.host+'/html/model/sys/resourceinfo/resourceIssue.html?resourceId=' + $resource.attr("resourceId"));
                            //     }else{
                            //         util.alertMsg("文章不存在", function(){pdg.reload();});
                            //     }
                            // },{});
                        }
                    } else {
                        util.alert("请选择一个资源");
                    }
                });

                root.find(".opt-contacts").on("click", function() {
                    var $resource = root.find("td.opt-check>i.checked");
                    if ($resource.length) {
                        var ret = {ids:[],orgIds:[],category:[]};
                        $resource.each(function() {
                            ret.ids.push($(this).attr("resourceId"));
                            ret.orgIds.push($(this).attr("owner"));
                            ret.category.push($(this).attr("category"));
                        });
                        var nary=ret.orgIds.sort();
                        var narc=ret.category;
                        for(var j=0;j<ret.category.length;j++){
                            if (narc[j]!="2"){
                                util.alert("列表中有非企业发布的资源");
                                return;
                            }
                        }
                        if(ret.orgIds.length>1) {
                            for (var i = 0; i < ret.orgIds.length-1; i++) {
                                if (nary[i] != nary[i + 1]) {
                                    util.alert("列表中的企业不一致");
                                    return;
                                }
                            }
                        }
                        spa.showModal("sys_resourceinfo_contacts", {
                            data: {orgId:ret.orgIds[0],ids:ret.ids}, hand: function () {
                                pdg.reload()
                            }
                        });

                    } else {
                        util.alert("请选择一个资源");
                    }
                });


            }, mainDestory: function () {

            }
        };
    });
});

