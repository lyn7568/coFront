/**
 * Created by TT on 2017/8/28.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_disbanner_putup");
                var form = fb.build(root.find(".newForm"));
                var b = false;
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (b) {
                            var arr = [];
                            for (var i = 1; i <= 5; i++) {
                                if (form.val()["id" + i] == null || form.val()["id" + i] == "") {
                                    util.alert("请填写五个编号ID");
                                    return;
                                }
                                arr.push(form.val()["id" + i]);
                            }

                            // var banner = [];
                            // for (var i = 1; i <= 5; i++) {
                            //     banner.push(form.val()["banner" + i]);
                            // }
                            // if (isRepeat(banner)){
                            //     util.alert("不可以有重复栏目");
                            //     return;
                            // }

                            if (!isRepeat(arr)) {
                                form.doPost("../ajax/disBanner/putUp", function () {
                                    spa.closeModal();
                                    if (data) {
                                        data();
                                    }
                                }, {});
                                console.log(form.val());
                            }else {
                                util.alert("编号ID不可重复");
                            }
                        }else{
                            util.alert("请检查数据是否正确");
                        }
                    };

                var isRepeat = function (arr) {
                    var hash = {};
                    for (var i in arr) {
                        if (hash[arr[i]])
                            return true;
                        hash[arr[i]] = true;
                    }
                    return false;
                };

                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                root.find(".xmtt").on("focusout", function () {
                    var idx = $(this).attr("name").substring(2);
                    if (form.val()["id" + idx]) {
                        util.get("../ajax/disBanner/id/" + form.val()["id" + idx], null, function (banner) {
                            if (banner) {
                                var obj = {};
                                obj["title" + idx] = banner.title;
                                obj["banner" + idx] = banner.banner;
                                form.val(obj);
                                b = true;
                            }else {
                                b = false;
                                util.alert("此编号下没有数据，请更换");
                            }
                        })
                    }
                });
                saveBtn.on("click", function () {
                    save();
                });
            }
        }
    });
});
