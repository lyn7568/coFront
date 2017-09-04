;
spa_define(function () {

    return $.use(["spa", "form", "util"], function (spa, fb, util) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_realname_edit");
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
                            pics.append($("<div class='col-6'> <img src='http://www.ekexiu.com/data/authImg/" + src[i].authSrc + "' width='98%'/> </div>"));
                            // pics.append($("<div class='col-6'> <img src='../data/16DD37B7ADC046E8A4B1552A55D948A0.jpg' width='98%' /> </div>"));
                        }

                    }
                });
            }
        }
    });
});