/**
 * Created by TT on 2017/9/11.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_article_edit");
                var form = fb.build(root.find(".newForm"));
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (form.val().sortNum) {
                            var sortNum = form.val().sortNum;
                            var reg = new RegExp("^(\\d|[1-9]\\d|100)$");
                            if (!reg.test(sortNum)) {
                                util.alert("权重值必须是0-100的正整数");
                                return;
                            }
                        } else {
                            form.val({sortNum: 0});
                        }
                        util.post("../ajax/article/sortNum", {
                            articleId: data.data.articleId,
                            sortNum: form.val().sortNum
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