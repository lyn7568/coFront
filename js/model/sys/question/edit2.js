/**
 * Created by TT on 2018/1/31.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form", "upload"], function (spa, util, fb, upload) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_question_edit2");
                var form = fb.build(root.find(".newForm"));
                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                form.val({cnt: data.data.cnt, title: data.data.title});
                var saveBtn = root.find(".opt-save"),
                    headArea = root.find(".head-ctn"),
                    $list = $('#fileList'),
                    save = function () {
                        var img = [];
                        $('#fileList').find('img').each(function () {
                            img.push($(this).attr("name"));
                        });
                        util.post("../ajax/qa/question/modify", {
                            img: img.join(","),
                            title: form.val().title,
                            cnt: form.val().cnt,
                            id: data.data.id
                        }, function () {
                            spa.closeModal();
                            if (data.hand) {
                                data.hand();
                            }
                        }, {});
                    };

                upload.build({
                    render: root.find(".upload-btn"),
                    accept: "image/gif, image/jpeg",
                    fail: function (errType, errData) {
                        /*this ={id,name,size,type,abort=function}*/
                        util.errMsg(this.name + "上传文件错误：" + errType);
                        this.ele.remove();
                        saveBtn.on("click", save);
                    },
                    async: false,
                    // maxSize: 1024 * 1024 * 10,
                    done: function (data) {
                        /*this ={id,name,size,type,abort=function}*/
                        this.ele.remove();
                        // headArea.find("img").remove();
                        $('<div class="file-item thumbnail"><img src="../data/question' + data[0].uri + '"' +
                            'name="' + data[0].uri + '">' +
                            '<div class="file-panel">' +
                            '<span class="cancel icon-remove-sign">删除</span>' +
                            '</div>' +
                            '</div>').appendTo($list);
                        form.val({"head": data.uri});
                        if ($('#fileList').find('img').length > 2) {
                            $('.upload-btn').hide();
                        }
                        saveBtn.on("click", save);
                    },
                    start: function () {
                        /*this ={id,name,size,type,abort=function}*/
                        // this.ele = $("<div class='upload-item'><div class='progress'></div><span>" + this.name + "</span><div>");
                        // this.ele.appendTo(headArea);
                        // this.progress = this.ele.find(".progress");
                        saveBtn.off("click");
                    },
                    notity: function (total, loaded) {
                        /*this ={id,name,size,type,abort=function}*/
                        // var vv = "" + Math.ceil(loaded * 100 / total) + "%;";
                        // this.progress.attr("style", "width:" + vv);
                        // this.progress.text(vv);
                    },
                    uri: "http://www.ekexiu.com/ajax/question/upload"
                });
                $list.on("click", ".cancel", function () {
                    $(this).parent().parent().remove();
                    if ($('#fileList').find('img').length < 3) {
                        $('.upload-btn').show();
                    }
                });


                if (data.data.img) {
                    var image = split1(data.data.img);
                    for (var i = 0; i < image.length; i++) {
                        var $li = $(
                                '<div class="file-item thumbnail">' +
                                '<img  src="http://www.ekexiu.com/data/question/" id="oimg" />' +
                                ' <div class="file-panel">' +
                                '<span class="cancel icon-remove-sign">删除</span>' +
                                '</div>' +
                                '</div>'
                            ),
                            $img = $li.find('img');
                        $list.append($li);
                        $img.attr('src', "http://www.ekexiu.com/data/question" + image[i]);
                        // $img.attr('src', "../data/images/researchResult/" + image[i]+".jpg");
                        $img.attr('name', image[i]);
                    }
                    if ($('#fileList').find('img').length > 2) {
                        $('.upload-btn').hide();
                    }
                }
                function split1(data) {
                    var index = data.split(",");
                    var arr = [];
                    for (var m = 0; m < index.length; m++) {
                        arr.push(index[m]);
                    }
                    return arr;
                }

                saveBtn.on("click", save);
            }
        }
    });
});