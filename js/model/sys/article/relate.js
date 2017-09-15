/**
 * Created by TT on 2017/9/11.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_article_relate");
                var form = fb.build(root.find(".newForm"));
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                            var professors = [];
                            var resources = [];
                            var orgs = [];
                            for (var i = 1; i<6;i++) {
                                if (form.val()["id"+i]){
                                    professors.push(form.val()["id" + i]);
                                }
                                if (form.val()["resourceId"+i]){
                                    resources.push(form.val()["resourceId" + i]);
                                }
                                if (form.val()["orgId"+i]){
                                    orgs.push(form.val()["orgId" + i]);
                                }
                            }
                            util.post("../ajax/article/relateSave", {
                                articleId: data.data.articleId,
                                professors: professors,
                                resources: resources,
                                orgs: orgs
                            },function () {
                                spa.closeModal();
                                if (data.hand) {
                                    data.hand();
                                }
                            },{"6001":"关联专家不可重复","6002":"关联资源不可重复","6003":"关联企业不可重复"});
                    };

                util.post("../ajax/article/relatePro", {articleId: data.data.articleId},function (professors) {
                    for (var i = 1; i<=professors.length;i++) {
                        var obj = {};
                        obj["id" + i.toString()] = professors[i - 1].id;
                        obj["name"+i.toString()] = professors[i-1].name;
                        obj["orgName"+i.toString()] = professors[i-1].orgName;
                        obj["title"+i.toString()] = professors[i-1].title;
                        form.val(obj);
                    }
                });

                util.post("../ajax/article/relateRes", {articleId: data.data.articleId},function (resources) {
                    for (var i = 1; i<=resources.length;i++) {
                        var obj = {};
                        obj["resourceId" + i.toString()] = resources[i - 1].resourceId;
                        obj["resourceName"+i.toString()] = resources[i-1].resourceName;
                        obj["publish"+i.toString()] = resources[i-1].organizationName || resources[i-1].professorName;
                        form.val(obj);
                    }
                });

                util.post("../ajax/article/relateOrg", {articleId: data.data.articleId}, function (orgs) {
                    for (var i = 1; i <= orgs.length; i++) {
                        var obj = {};
                        obj["orgId" + i.toString()] = orgs[i - 1].id;
                        obj["organization" + i.toString()] = orgs[i - 1].name;
                        form.val(obj);
                    }
                });

                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });

                root.find(".pro").on("focusout", function () {
                    var idx = $(this).attr("name").substring(2);
                    if (form.val()["id" + idx]) {
                        util.get("../ajax/sys/professor/id/" + form.val()["id" + idx], null, function (professor) {
                            if (professor) {
                                var obj = {};
                                obj["name" + idx] = professor.name;
                                obj["orgName" + idx] = professor.orgName;
                                obj["title" + idx] = professor.title;
                                form.val(obj);
                            }else {
                                var obj = {};
                                obj["id" + idx] = null;
                                obj["name" + idx] = null;
                                obj["orgName" + idx] = null;
                                obj["title" + idx] = null;
                                form.val(obj);
                                util.alert("此编号下没有数据，请重新输入");
                            }
                        })
                    }else{
                        var obj = {};
                        obj["name" + idx] = null;
                        obj["orgName" + idx] = null;
                        obj["title" + idx] = null;
                        form.val(obj);
                    }
                });

                root.find(".res").on("focusout", function () {
                    var idx = $(this).attr("name").substring(10);
                    if (form.val()["resourceId" + idx]) {
                        util.get("../ajax/resource/resourceInfo",{id:form.val()["resourceId" + idx]}, function (resource) {
                            if (resource) {
                                var obj = {};
                                obj["resourceName" + idx] = resource.resourceName;
                                obj["publish" + idx] = resource.organizationName || resource.professorName;
                                form.val(obj);
                            }else {
                                var obj = {};
                                obj["resourceId" + idx] = null;
                                obj["resourceName" + idx] = null;
                                obj["publish" + idx] = null;
                                form.val(obj);
                                util.alert("此编号下没有数据，请重新输入");
                            }
                        })
                    }else{
                        var obj = {};
                        obj["resourceName" + idx] = null;
                        obj["publish" + idx] = null;
                        form.val(obj);
                    }
                });

                root.find(".org").on("focusout", function () {
                    var idx = $(this).attr("name").substring(5);
                    if (form.val()["orgId" + idx]) {
                        util.get("../ajax/sys/org/id/" + form.val()["orgId" + idx], null, function (org) {
                            if (org) {
                                var obj = {};
                                obj["organization" + idx] = org.name;
                                form.val(obj);
                            }else {
                                var obj = {};
                                obj["orgId" + idx] = null;
                                obj["organization" + idx] = null;
                                form.val(obj);
                                util.alert("此编号下没有数据，请重新输入");
                            }
                        })
                    }else{
                        var obj = {};
                        obj["organization" + idx] = null;
                        form.val(obj);
                    }
                });

                saveBtn.on("click", save);
            }
        }
    });
});