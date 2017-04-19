;
spa_define(function () {

    return $.use(["spa", "form", "util"], function (spa, fb, util) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_expert_edit");
                var form = fb.build(root.find(".newForm"));
                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                // data.data.authApplyId1=data.data.authApplyId;
                form.val(data.data);
                form.val({authApplyId1:data.data.authApplyId});
                root.find(".opt-save").on("click", function () {
                    form.doPost("../ajax/authApply/state",function () {
                        spa.closeModal();
                        if (data.hand) {
                            data.hand()
                        }
                    }, {});
                });
                util.get("../ajax/authImage/byApply/" + data.data.authApplyId, null, function (src) {
                    var pics = root.find(".pics");
                    pics.empty();
                    if (src && src.length) {
                        for (var i = 0; i < src.length; ++i) {
                            pics.append($("<img src='../data/" + src[i].authSrc + "'/>"));
                        }

                    }
                });
            }
        }
    });
});