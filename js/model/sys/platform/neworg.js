/**
 * Created by TT on 2018/5/28.
 * 新增对接机构
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_buttedorg_new");
                var form = fb.build(root.find(".newForm"));
                var trim = function (str) { //删除左右两端的空格			　　
                    return str.replace(/(^\s*)|(\s*$)/g, "");
                };
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if(trim(form.val().id).length!=32) {
                            util.alert("请检查机构是否存在");
                            return;
                        }
                        util.post(baseUrl + "/ajax/platform/buttedOrg", {pid: data.data, oid: form.val().id},function () {
                            spa.closeModal();
                            if (data) {
                                data.hand();
                            }
                        },function (msg) {
                            if(msg.msg.search("unique constraint")!=-1&&msg.msg.search("already exists")!=-1){
                                util.alert("该平台已对接");
                                return;
                            }
                        });
                    };

                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                saveBtn.on("click", save);
            }
        }
    });
});
