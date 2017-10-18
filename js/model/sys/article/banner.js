/**
 * Created by TT on 2017/10/16.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_disbanner_insert");
                $(".sys_disbanner_insert .opt-search").hide();
                $(".sys_disbanner_insert .trim").addClass("readOnly");
                var form = fb.build(root.find(".newForm"));
                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                form.val({id:data.id});

                util.get("../ajax/article/id/" + data.id, null, function (article) {
                    if (article) {
                        form.val({title: article.articleTitle, banner: article.colNum});
                        var pics = root.find(".pics");
                        pics.append($("<img src='http://www.ekexiu.com/data/article/" + article.articleImg + "' width='210px' height='120px'/>"));
                        // pics.append($("<img src='../data/images/"+ article.articleImg +"' width='210px' height='120px'/>"));
                    } else {
                        util.alert("此文章不存在");
                    }
                });

                root.find(".opt-save").on("click", function () {
                    util.post("../ajax/disBanner", {
                        title: form.val().title,
                        descp: form.val().descp,
                        articleId: form.val().id,
                        banner:form.val().banner
                    }, function () {
                        spa.closeModal();
                        if (data.hand) {
                            data.hand();
                        }
                    }, {});
                });
            }
        }
    });
});
