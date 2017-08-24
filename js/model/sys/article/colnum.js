/**
 * Created by TT on 2017/8/23.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_article_colnum");
                var form = fb.build(root.find(".newForm"));
                form.val({colNum: data.data.colNum, id: data.data.id});
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        util.post("../ajax/article/colNum", {
                            articleId: data.data.articleId,
                            colNum: form.val().colNum
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
