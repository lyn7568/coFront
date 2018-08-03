/**
 * Created by TT on 2018/7/23.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_product_sort");
                var form = fb.build(root.find(".newForm"));
                form.val({sortFirst: data.data.sortFirst, id: data.data.id});

                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (form.val().sortFirst) {
                            var sortFirst = form.val().sortFirst;
                            var reg = new RegExp("^(\\d|[1-9]\\d|100)$");
                            if (!reg.test(sortFirst)) {
                                util.alert("权重值必须是0-100的正整数");
                                return;
                            }
                        } else {
                            form.val({sortFirst: 0});
                        }
                        util.post("../ajax/product/sortFirst", {
                            id: data.data.id,
                            sortFirst: form.val().sortFirst
                        }, function () {
                            spa.closeModal();
                            if (data.hand) {
                                data.hand();
                            }
                        }, {});
                    };

                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });

                saveBtn.on("click", save);
            }
        }
    });
});