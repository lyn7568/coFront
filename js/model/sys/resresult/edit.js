/**
 * Created by TT on 2017/10/23.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form", "upload"], function (spa, util, fb, upload) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_result_new");
                var ca = {ready: true, items: []},
                    ba = {ready: true, items: []};
                var form = fb.build(root.find(".newForm"), {
                    industryList: ca,
                    subjectList: ca,
                    researcherList: ba,
                    researcher: {
                        keyPressInterval: 1,
                        hide: function () {
                            this.shown = false;
                            this.ctn.removeClass("open");
                            this.lastQuerying = null;
                            this.lastQueryed = null;
                        },
                        select: function () {
                            if (this.shown) {
                                var item = this.menu.find(".active");
                                this.rv = item.attr('code');
                                this.caption = item.attr("caption");
                                var caption = this.caption.toString();
                                var name = caption.substr(0, caption.indexOf(","));
                                this.ve.val("");
                                var res = this.rv + "," + name;
                                part2(name, form.val().researcherList, res, 20);
                                form.val({researcherList: oJudge});
                                return this.hide();
                            }
                        }
                    },
                    orgName: {
                        keyPressInterval: 1,
                        hide: function () {
                            this.shown = false;
                            this.ctn.removeClass("open");
                            this.lastQuerying = null;
                            this.lastQueryed = null;
                        }
                    },
                    newSubject: {
                        keyPressInterval: 1,
                        hide: function () {
                            this.shown = false;
                            this.ctn.removeClass("open");
                            this.lastQuerying = null;
                            this.lastQueryed = null;
                        },
                        select: function () {
                            if (this.shown) {
                                var item = this.menu.find(".active");
                                this.rv = item.attr('code');
                                this.caption = item.attr("caption");
                                var caption = this.caption.toString();
                                this.ve.val("");
                                part(caption, form.val().subjectList, 20);
                                form.val({subjectList: oJudge});
                                return this.hide();
                            }
                        }
                    },
                    newIndustry: {
                        keyPressInterval: 1,
                        hide: function () {
                            this.shown = false;
                            this.ctn.removeClass("open");
                            this.lastQuerying = null;
                            this.lastQueryed = null;
                        },
                        select: function () {
                            if (this.shown) {
                                var item = this.menu.find(".active");
                                this.rv = item.attr('code');
                                this.caption = item.attr("caption");
                                var caption = this.caption.toString();
                                this.ve.val("");
                                part(caption, form.val().industryList, 20);
                                form.val({industryList: oJudge});
                                return this.hide();
                            }
                        }
                    }
                });
                var oValue;
                var oJudge;
                var trim = function (str) {
                    return str.replace(/(^\s*)|(\s*$)/g, "");
                };
                var saveBtn = root.find(".opt-save"),
                    headArea = root.find(".head-ctn"),
                    save = function () {
                        // console.log($(".org").find("input").val());
                        var pic = [];
                        $('#fileList').find('img').each(function () {
                            pic.push($(this).attr("name"));
                        });
                        form.val({pic: oString(pic), researchers: form.val().researcherList});
                        form.val({
                            industry: oString(form.val().industryList),
                            subject: oString(form.val().subjectList),
                            orgName: $(".org").find("input").val()
                        });

                        if (form.val().name == null) {
                            util.alert("请输入成果名称");
                            return;
                        }
                        else form.doPost("../ajax/resResult/update", function () {
                            spa.closeModal();
                            if (data.hand) {
                                data.hand();
                            }
                            // location.reload();
                        }, {});
                    };

                util.get("../ajax/resResult/queryResearcher", {id: data.data.id}, function (res) {
                    if (res) {
                        var arr = [];
                        for (var m = 0; m < res.length; m++) {
                            var caption = res[m].name;
                            var code = res[m].professorId + "," + res[m].name;
                            ba.items.push({code: code, caption: caption});
                            arr.push(code);
                        }
                        form.val({researcherList: arr});
                    }
                });
                form.val(data.data);
                $(".org").find("input").val(data.data.orgName);
                if (data.data.industry) {
                    form.val({industryList: split1(data.data.industry)});
                }
                if (data.data.subject) {
                    form.val({subjectList: split1(data.data.subject)});
                }

                var part = function (one, list, num) {
                    oValue = one;
                    oJudge = list || [];
                    if (oJudge.length >= num) {
                        util.alert("最多" + num + "个");
                        return;
                    }
                    var repeat,
                        b;
                    if (!oValue) {
                        util.alert('提示', '请先填写内容');
                        return;
                    }
                    if (oValue.length > 15) {
                        util.alert('提示', '添加内容不能超过15个字');
                        return;
                    } else {
                        var oValueList = oValue.split(","),
                            length = oValueList.length;
                        for (var m = 0;m<oValueList.length;m++) {
                            oValueList[m] = trim(oValueList[m]);
                        }
                        for (var j = 0; j < length; j++) {
                            for (var n = j + 1; n < oValueList.length + 1;) {
                                if (oValueList[j] == oValueList[n]) {
                                    oValueList.remove(n);
                                    repeat = false;
                                } else {
                                    n++;
                                }
                            }
                        }
                        for (var j = 0; j < oValueList.length;) {
                            for (var i = 0; i < oJudge.length; i++) {
                                if (oValueList[j] == oJudge[i]) {
                                    oValueList.remove(j);
                                    repeat = false;
                                    b = true;
                                }
                            }
                            if (b) {
                                b = false
                            } else j++;
                        }
                        if (repeat == false) {
                            util.alert('提示', '添加内容不能重复');
                        }
                        for (var m = 0; m < oValueList.length; m++) {
                            ca.items.push({code: oValueList[m], caption: oValueList[m]});
                            oJudge.push(oValueList[m]);
                        }
                    }
                };
                var part2 = function (one, list, value, num) {
                    oValue = one;
                    oJudge = list || [];
                    if (oJudge.length >= num) {
                        util.alert("最多" + num + "个");
                        return;
                    }
                    // var repeat,
                    //     b;
                    if (!oValue) {
                        util.alert('提示', '请先填写内容');
                        return;
                    }
                    if (oValue.length > 50) {
                        util.alert('提示', '添加内容不能超过50个字');
                        return;
                    } else {
                        // var oValueList = oValue.split(","),
                        //     length = oValueList.length;
                        // for (var j = 0; j < length; j++) {
                        //     for (var n = j + 1; n < oValueList.length + 1;) {
                        //         if (oValueList[j] == oValueList[n]) {
                        //             oValueList.remove(n);
                        //             repeat = false;
                        //         } else {
                        //             n++;
                        //         }
                        //     }
                        // }
                        // for (var j = 0; j < oValueList.length;) {
                        //     for (var i = 0; i < oJudge.length; i++) {
                        //         if (oValueList[j] == oJudge[i]) {
                        //             oValueList.remove(j);
                        //             repeat = false;
                        //             b = true;
                        //         }
                        //     }
                        //     if (b) {
                        //         b = false
                        //     } else j++;
                        // }
                        // if (repeat == false) {
                        //     util.alert('提示', '添加内容不能重复');
                        // }
                        // for (var m = 0; m < oValueList.length; m++) {
                        ba.items.push({code: value, caption: oValue});
                        oJudge.push(value);
                        // }
                    }
                };

                Array.prototype.remove = function (obj) {
                    for (var i = 0; i < this.length; i++) {
                        var temp = this[i];
                        if (!isNaN(obj)) {
                            temp = i;
                        }
                        if (temp == obj) {
                            for (var j = i; j < this.length; j++) {
                                this[j] = this[j + 1];
                            }
                            this.length = this.length - 1;
                        }
                    }
                };

                function split1(data) {
                    var index = data.split(",");
                    var arr = [];
                    for (var m = 0; m < index.length; m++) {
                        ca.items.push({code: index[m], caption: index[m]});
                        arr.push(index[m]);
                    }
                    return arr;
                }

                function oString(data) {
                    var arry = new Array();
                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            arry.push(data[i]);
                        }
                    }
                    return arry.join(",");
                }

                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });
                root.find(".opt-industry").on("click", function () {
                    var ind = $(".ind").find("input");
                    part(trim(ind.val()), form.val().industryList, 20);
                    ind.val("");
                    form.val({newIndustry: "", industryList: oJudge});
                });
                root.find(".opt-subject").on("click", function () {
                    var sub = $(".sub").find("input");
                    part(trim(sub.val()), form.val().subjectList, 20);
                    sub.val("");
                    form.val({newSubject: "", subjectList: oJudge});
                });
                root.find(".opt-res").on("click", function () {
                    var res = $(".typeahead").find("input");
                    var value = "################################," + trim(res.val());
                    part2(trim(res.val()), form.val().researcherList, value, 20);
                    res.val("");
                    form.val({researcherList: oJudge});
                });

                var $list = $('#fileList'),
                    ratio = window.devicePixelRatio || 1,
                    thumbnailWidth = 100 * ratio,
                    thumbnailHeight = 100 * ratio,
                    uploader;
                uploader = WebUploader.create({
                    auto: true,
                    server: '../ajax/cachedFileUpload',
                    pick: '#filePicker',
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
                    if ($(".file-item").length < 5) {

                        var $li = $(
                                '<div id="' + file.id + '" class="file-item thumbnail">' +
                                '<img>' +
                                '</div>'
                            ),
                            $img = $li.find('img');

                        $list.append($li);

                        if ($('#fileList').find('img').length > 4) {
                            $('#filePicker').hide();
                        }
                    }
                });
                uploader.on('uploadSuccess', function (file, data) {
                    $('#' + file.id).addClass('upload-state-done');
                    $.ajax({
                        type: "post",
                        url: "../ajax/image/researchResult",
                        async: false,
                        data: {fn: data.data[0].cacheKey},
                        contentType: "application/x-www-form-urlencoded"
                    }).done(function (rd) {
                        if (rd.success) {
                            $('#' + file.id).find('img').attr('name', rd.data);
                        }
                    });
                    uploader.makeThumb(file, function (error, src) {
                        var $img = $("#" + file.id).find('img');
                        if (error) {
                            $img.replaceWith('<span>不能预览</span>');
                            return;
                        }

                        $img.attr('src', src);
                    }, thumbnailWidth, thumbnailHeight);
                    if ($('#fileList').find('img').length < 5) {
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
                    if ($('#fileList').find('img').length < 5) {
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
                if (data.data.pic) {
                    var image = split1(data.data.pic);
                    for (var i = 0; i < image.length; i++) {
                        var $li = $(
                                '<div class="file-item thumbnail">' +
                                '<img  src="http://www.ekexiu.com/data/researchResult/" id="oimg" />' +
                                '</div>'
                            ),
                            $btn = $('<div class="file-panel">' +
                                '<span class="cancel icon-remove-sign">删除</span>' +
                                '</div>').appendTo($li),
                            $img = $li.find('img');
                        $list.append($li);
                        $img.attr('src', "http://www.ekexiu.com/data/researchResult/" + data.data.id + ".jpg");
                        // $img.attr('src', "../data/images/researchResult/" + image[i]);
                        $img.attr('name', image[i]);
                    }
                    if ($('#fileList').find('img').length > 4) {
                        $('#filePicker').hide();
                    }
                }
                saveBtn.on("click", save);
            }
        }
    });
});