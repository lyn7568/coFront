/**
 * Created by TT on 2017/10/10.
 */
;
spa_define(function () {
    return $.use(["spa", "pagedatagrid", "util"], function (spa, pdgf, util) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_consult_msgidx");
                var pdg = pdgf.build(root);
                pdg.code.shell("showDay", function (env) {
                    if (env.cd && env.cd[this.k]) {
                        var date = new Date(env.cd[this.k]);
                        var day = date.format("yyyyMMdd");
                        return day.substring(0, 4) + "-" + day.substring(4, 6) + "-" + day.substring(6, 8);
                    }
                    return "";
                });
                pdg.code.listen($.dict.doTransfer);
                root.find(".opt-query").on("click", function () {
                    pdg.load();
                });
                pdg.load();
                root.on("click", ".icon-edit", function () {
                    var $this = $(this);
                    var owner = $this.parent().attr("owner"),
                        ownerName = $this.parent().attr("ownerName"),
                        actor = $this.parent().attr("actor"),
                        actorName = $this.parent().attr("actorName");
                    spa.showModal("sys_consult_msgcnt", {
                        data: {owner: owner, ownerName: ownerName, actor: actor, actorName: actorName},
                        hand: function () {
                            pdg.load()
                        }
                    })
                });
            }
        };
    });
});
