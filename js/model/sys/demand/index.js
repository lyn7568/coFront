/**
 * Created by TT on 2017/5/8.
 */
;
spa_define(function(){
    return $.use(["spa","pagedatagrid","util"],function(spa,pdgf,util){
        return{
            main: function() {
                var root = spa.findInMain(".sys_demand_index");
                var pdg = pdgf.build(root);
                pdg.code.shell("showDay", function(env) {
                    if(env.cd && env.cd[this.k]) {
                        var day = env.cd[this.k];
                        return day.substring(0, 4) + "-" + day.substring(4, 6) + "-" + day.substring(6, 8);
                    }
                    return "";
                });
                pdg.code.listen($.dict.doTransfer);
                root.find(".opt-query").on("click", function() {
                    pdg.load();
                });
                pdg.load();
                root.on("click", ".icon-edit", function() {
                    var $this = $(this);
                    var demandId = $this.parent().attr("demandId");
                    util.get("../ajax/demand/id/" + demandId, null, function(rd) {
                        if (rd) {
                            spa.showModal("sys_demand_edit", {
                                data: rd,
                                hand: function() {
                                    pdg.load()
                                }
                            })
                        } else {
                            util.alert("客户选择有误", function() {
                                pdg.load();
                            });
                        }
                    }, {});
                });
            }
        };
    });
});