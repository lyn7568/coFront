/**
 * Created by TT on 2017/10/10.
 */
;
spa_define(function () {
    return $.use(["spa", "code", "util", "form"], function (spa, code, util, form) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_consult_msgcnt");
                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                var ef = form.build(root.find(".opt-form"));
                util.get("../ajax/sys/professor/id/" + data.data.owner, null, function (owner) {
                    ef.val({ownerOrg: owner.orgName});
                });
                util.get("../ajax/sys/professor/id/" + data.data.actor, null, function (actor) {
                    ef.val({actorOrg: actor.orgName});
                });
                ef.val(data.data);
                var cr = code.parseCode(root.find(".dt-tpl"));
                cr.shell("showDay", function (env) {
                    if (env.cd && env.cd[this.k]) {
                        var day = env.cd[this.k];
                        return day.substring(0, 4) + "-" + day.substring(4, 6) + "-" + day.substring(6, 8);
                    }
                    return "";
                });
                var allData;
                util.get("../ajax/Msg/cnt", {actor1: data.data.owner, actor2: data.data.actor}, function (cnt) {
                    cnt.forEach(function (item) {
                        if (item.sender == data.data.owner) {
                            item.senderName = data.data.ownerName;
                            item.reciverName = data.data.actorname;
                            item.right = 1;
                        } else {
                            item.senderName = data.data.actorName;
                            item.reciverName = data.data.ownerName;
                            item.right = 2;
                        }
                        // item.sender == data.data.owner ?item.senderName = data.data.ownerName:item.senderName = data.data.actorName;
                        // item.reciver == data.data.actor ?item.reciverName = data.data.actorName:item.reciverName = data.data.ownerName;
                    });
                    allData = cnt || [];
                    cr.val(allData);
                }, {});
            }
        };
    });
});
