/**
 * Created by TT on 2017/5/31.
 */
;
spa_define(function(){
    return $.use(["spa","pagedatagrid","util","form"],function(spa,pdgf,util,form){
        return{
            main: function() {
                var root = spa.findInMain(".sys_professor_check");
                var pdg = pdgf.build(root);

                root.find(".opt-query").on("click", function() {
                    pdg.load();
                });

                pdg.code.shell("showDay", function(env) {
                    if(env.cd && env.cd[this.k]) {
                        var day = env.cd[this.k];
                        return day.substring(0, 4) + "年" + day.substring(4, 6) + "月" + day.substring(6, 8) + "日";
                    }
                    return "";
                });
                pdg.code.listen($.dict.doTransfer);
                pdg.load();
                // root.find(".opt-new").on("click", function() {
                //     spa.showModal("sys_professor_new", function() { pdg.load() });
                // });
                root.find(".dt-tpl").on("click", "th.opt-check>i.icon-st-check", function() {
                    var $this = $(this);
                    $this.toggleClass("checked");
                    if($this.hasClass("checked")) {
                        root.find(".dt-tpl td.opt-check>i.icon-st-check").addClass("checked");
                    } else {
                        root.find(".dt-tpl td.opt-check>i.icon-st-check").removeClass("checked");
                    }
                });
                root.find(".dt-tpl").on("click", "td.opt-check>i.icon-st-check", function() {
                    var $this = $(this);
                    $this.toggleClass("checked");
                });
                root.find(".opt-check").on("click", function() {
                    var $check = root.find("td.opt-check>i.checked");
                    if($check.length) {
                        var ret =[];
                        $check.each(function(){
                            ret.push($(this).attr("id"));
                        });
                        util.boxMsg({
                            title: "审核确认",
                            content: "请确认审核结果！！！！",
                            btns: [{ caption: "审核通过", hand: function() {
                                util.post("../ajax/sys/professor/check",{ids:ret,professorState:0},function(){pdg.load()},{});
                            } },{ caption: "审核失败", hand: function() {
                                util.post("../ajax/sys/professor/check",{ids:ret,professorState:1},function(){pdg.load()},{});
                            } },
                                { caption: "取消" }
                            ]
                        });
                    } else {
                        util.alert("请选择一名专家");
                    }
                });
                root.on("click", ".opt-auth", function () {
                    var id = $(this).parent().attr("pId");
                    window.open('http://www.ekexiu.com/information-console.html?professorId=' + id);
                });
                root.on("click",".table-opt a.name", function () {
                    var professorId = $(this).parent().attr("professorId");
                    window.open('http://www.ekexiu.com/information-brow.html?professorId=' + professorId);
                });
            },mainDestory: function() {

            },
        };
    });
});