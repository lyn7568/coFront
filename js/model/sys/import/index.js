/**
 * Created by TT on 2017/6/7.
 */
;
spa_define(function () {
    return $.use(["spa", "code", "form", "util", "dict"], function (spa, code, form, util, dict) {
        return {
            main: function () {
                var root = spa.findInMain(".sys_import_index");
                // var cr = code.parseCode(root.find(".dt-tpl"));
                var path = form.build(root.find(".dt-form"));

                root.find(".opt-count").on("click", function () {
                    if(path.val().path){
                        path.doPost("../ajax/resourceTmp/file",function (data) {
                            util.alert("文件夹下共有" + data + "个文件");
                        });
                    }else {
                        util.alert("请输入资源文件夹路径");
                    }
                });

                root.find(".opt-import").on("click", function () {
                    if(path.val().path){
                        util.boxMsg({
                            title: "确认",
                            content: "您是否要录入此文件夹中的信息,信息录入成功后文件将被删除，请确认路径是否正确或做好备份！！！！！！",
                            btns: [{
                                caption: "开始录入",
                                hand: function() {
                                    path.doPost("../ajax/resourceTmp/importRes",function (data) {
                                        util.alert("本次录入成功"+data+"条信息");
                                    });
                                }
                            },
                                { caption: "取消" }
                            ]
                        });
                    }else {
                        util.alert("请输入资源文件夹路径");
                    }
                });
            }
        }
    });
});


