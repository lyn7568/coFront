/**
 * Created by TT on 2018/1/30.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_question_edit");
                var form = fb.build(root.find(".newForm"));
                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                form.val({cnt: data.data.cnt,title:data.data.title});
                var saveBtn = root.find(".opt-save"),
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

                var $list = $('#fileList'),
                    ratio = window.devicePixelRatio || 1,
                    thumbnailWidth = 100 * ratio,
                    thumbnailHeight = 100 * ratio,
                    uploader;
                uploader = WebUploader.create({
                    auto: true,
                    server: 'http://www.ekexiu.com:81/ajax/question/upload',
                    pick: {
                        id: "#filePicker",
                        multiple: false
                    },
                    duplicate: true,
                    // fileNumLimit:5,
                    // fileSingleSizeLimit: 2*1024*1024,
                    accept: {
                        title: 'Images',
                        extensions: 'gif,jpg,jpeg,bmp,png',
                        mimeTypes: 'image/jpg,image/jpeg,image/png'
                    }
                });
                uploader.on('fileQueued', function (file) {
                    if ($(".file-item").length < 3) {

                        var $li = $(
                                '<div id="' + file.id + '" class="file-item thumbnail">' +
                                '<img>' +
                                '</div>'
                            ),
                            $img = $li.find('img');

                        $list.append($li);

                        if ($('#fileList').find('img').length > 2) {
                            $('#filePicker').hide();
                        }
                    }
                });
                uploader.on('uploadSuccess', function (file, data) {
                    console.log(data);
                    $('#' + file.id).addClass('upload-state-done');
                    if (data.success) {
                        $('#' + file.id).find('img').attr('name', data.data[0].uri);
                    }
                    uploader.makeThumb(file, function (error, src) {
                        var $img = $("#" + file.id).find('img');
                        if (error) {
                            $img.replaceWith('<span>不能预览</span>');
                            return;
                        }

                        $img.attr('src', src);
                    }, thumbnailWidth, thumbnailHeight);
                    if ($('#fileList').find('img').length < 3) {
                        $('#filePicker').show();
                    }
                    if (uploader.getStats().progressNum == 0 || uploader.getStats().queueNum == 0) {
                        saveBtn.on("click", save);
                    }
                });
                uploader.on('uploadComplete', function (file) {
                    var $li = $('#' + file.id);
                    $li.find('.progress').remove();
                    $('<div class="file-panel">' +
                        '<span class="cancel icon-remove-sign">删除</span>' +
                        '</div>').appendTo($li);
                });
                $list.on("click", ".cancel", function () {
                    $(this).parent().parent().remove();
                    if ($('#fileList').find('img').length < 3) {
                        $('#filePicker').show();
                    }
                    uploader.refresh();
                });
                uploader.on('uploadProgress', function (file, percentage) {
                    var $li = $('#' + file.id),
                        $percent = $li.find('.progress span');

                    // 避免重复创建
                    if (!$percent.length) {
                        $percent = $('<p class="progress"><span></span></p>')
                            .appendTo($li)
                            .find('span');
                    }
                    $percent.css('width', percentage * 100 + '%');
                    $('#filePicker').hide();
                    saveBtn.unbind("click");
                });
                uploader.on('error', function (type) {
                    switch (type) {
                        case 'Q_EXCEED_NUM_LIMIT':
                            alert("错误：上传文件数量过多！");
                            break;
                        case 'Q_EXCEED_SIZE_LIMIT':
                            alert("错误：文件总大小超出限制！");
                            break;
                        case 'F_EXCEED_SIZE':
                            alert("错误：文件大小超出限制！");
                            break;
                        case 'Q_TYPE_DENIED':
                            alert("错误：禁止上传该类型文件！");
                            break;
                        default:
                            alert('错误代码：' + type);
                            break;
                    }
                });
                if (data.data.img) {
                    var image = split1(data.data.img);
                    for (var i = 0; i < image.length; i++) {
                        var $li = $(
                                '<div class="file-item thumbnail">' +
                                '<img  src="http://www.ekexiu.com/data/question/" id="oimg" />' +
                                '</div>'
                            ),
                            $btn = $('<div class="file-panel">' +
                                '<span class="cancel icon-remove-sign">删除</span>' +
                                '</div>').appendTo($li),
                            $img = $li.find('img');
                        $list.append($li);
                        $img.attr('src', "http://www.ekexiu.com:81/data/question" + image[i]);
                        // $img.attr('src', "../data/images/researchResult/" + image[i]+".jpg");
                        $img.attr('name', image[i]);
                    }
                    if ($('#fileList').find('img').length > 2) {
                        $('#filePicker').hide();
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

            }
        }
    });
});