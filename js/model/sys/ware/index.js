/**
 * Created by TT on 2018/3/22.
 */
;
spa_define(function () {
    return $.use(["spa", "pagedatagrid", "util"], function (spa, pdgf, util) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_ware_index");
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
                    root.find(".hand-collectionid").each(function() {
                        var $e = $(this);
                        var collectionid = $e.attr("collectionid");
                        util.get("/ajax/content/countProfessor",{id:collectionid,type:2},function(data){
                            $e.text(data);
                        },{});
                        $e.removeClass("hand-collectionid");
                    });
                    root.find(".table-opt a.name").on("click",function () {
                        var wareId = $(this).parent().attr("wareId");
                        window.open('http://www.ekexiu.com/sevriceShow.html?sevriceId=' + wareId);
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
                    var $ware = root.find("td.opt-check>i.checked");
                    if ($ware.length) {
                        var ret = [];
                        $ware.each(function() {
                            ret.push($(this).attr("wareId"));
                        });
                        util.boxMsg({
                            title: "确认删除",
                            content: "您是否要删除选中的服务？",
                            btns: [{
                                caption: "删除",
                                hand: function () {
                                    util.post("../ajax/ware/deleteWare", {ids:ret}, function () {
                                        pdg.reload()
                                    }, {});
                                }
                            },
                                {caption: "取消"}
                            ]
                        });
                    } else {
                        util.alert("请选择一个服务");
                    }
                });
                root.find(".opt-sort").on("click", function() {
                    var $ware = root.find("td.opt-check>i.checked");
                    if($ware.length) {
                        if($ware.length > 1) {
                            util.alert("只能选择一个服务");
                        } else {
                            $.util.get("../ajax/ware/id/"+$ware.attr("wareId"),null,function(rd){
                                if(rd){
                                    spa.showModal("sys_ware_sort", { data:rd, hand: function() { pdg.reload() } })
                                }else{
                                    util.alertMsg("服务不存在", function(){pdg.reload();});
                                }
                            },{});
                        }
                    } else {
                        util.alert("请选择一个服务");
                    }
                });
                root.find(".opt-keywords").on("click", function() {
                    var $ware = root.find("td.opt-check>i.checked");
                    if($ware.length) {
                        if($ware.length > 1) {
                            util.alert("只能选择一个服务");
                        } else {
                            $.util.get("../ajax/ware/id/"+$ware.attr("wareId"),null,function(rd){
                                if(rd){
                                    spa.showModal("sys_ware_keywords", { data:rd, hand: function() { pdg.reload() } })
                                }else{
                                    util.alertMsg("服务不存在", function(){pdg.reload();});
                                }
                            },{});
                        }
                    } else {
                        util.alert("请选择一个服务");
                    }
                });
                root.find(".opt-view").on("click", function () {
                    var $ware = root.find("td.opt-check>i.checked");
                    if ($ware.length) {
                        if ($ware.length > 1) {
                            util.alert("只能选择一个服务");
                        } else {
                            window.open('http://www.ekexiu.com/sevriceShow.html?sevriceId=' + $ware.attr("resourceId"));
                        }
                    } else {
                        util.alert("请选择一个服务");
                    }
                });

                // root.find(".opt-edit").on("click", function() {
                //     var $ware = root.find("td.opt-check>i.checked");
                //     if($ware.length) {
                //         if($ware.length > 1) {
                //             util.alert("只能选择一个服务");
                //         } else {
                //             window.open('http://'+window.location.host+'/html/model/sys/resourceinfo/resourceIssue.html?resourceId=' + $ware.attr("wareId"));
                //         }
                //     } else {
                //         util.alert("请选择一个服务");
                //     }
                // });


            }, mainDestory: function () {

            }
        };
    });
});

