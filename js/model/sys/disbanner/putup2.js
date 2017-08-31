/**
 * Created by TT on 2017/8/28.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form", "code"], function (spa, util, fb, code) {
        return {
            modal: function () {
                var root = spa.findInModal(".sys_disbanner_putup2");
                var form = fb.build(root.find(".newForm"));
                var cr = code.parseCode(root.find(".dt-tpl"));
                var allData = [];
                allData.push({location: 1});
                allData.push({location: 2});
                allData.push({location: 3});
                allData.push({location: 4});
                allData.push({location: 5});
                cr.val(allData);
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        var $banner = root.find("td");
                        if ($banner.length) {
                            var ret = [];
                            $banner.forEach(function () {
                                ret.push($(".xmtt").val());
                            });
                        }
                    };
                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                root.on("focusout", ".xmtt", function () {
                    var $e = $(this);
                    if ($e.val()) {
                        util.get("../ajax/disBanner/id/" + $e.val(), null, function (banner) {
                            if (banner) {
                                $e.parent().parent().parent().find("td").eq(2).text(banner.title);
                                $e.parent().parent().parent().find("td").eq(3).text(dictBanner(banner.banner));
                            }
                        });
                    }
                });

                var dictBanner = function (i) {
                    if (i == 0) return "未设置";
                    if (i == 1) return "个人原创";
                    if (i == 2) return "企业原创";
                    if (i == 3) return "前沿动态";
                    if (i == 4) return "学术经验";
                    if (i == 5) return "分析检测";
                    if (i == 6) return "会议培训";
                    if (i == 7) return "科袖访谈";
                    if (i == 8) return "招聘招生";
                    if (i == 9) return "重大新闻";
                };
                saveBtn.on("click", function () {
                    save();
                });
            }
        }
    });
});
