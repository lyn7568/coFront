/**
 * Created by TT on 2017/7/19.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form", "upload"], function (spa, util, fb, upload) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_org_new");
                var ca = {ready: true, items: []};
                var form = fb.build(root.find(".newForm"), {
                    industryList: ca,
                    subjectList: ca,
                    qualificationList: ca
                });
                var id = util.data("loginUser").id;
                var cacheImageKey = null;
                var oValue;
                var oJudge;
                var saveBtn = root.find(".opt-save"),
                    headArea = root.find(".head-ctn"),
                    save = function () {
                        form.val({inviterId: id});
                        form.val({
                            industry: oString(form.val().industryList),
                            subject: oString(form.val().subjectList),
                            qualification: oString(form.val().qualificationList)
                        });
                        if (form.val().orgType == null) {
                            form.val({orgType: 1});
                        }
                        if (form.val().forShort == null) {
                            util.alert("请输入企业简称");
                        } else form.doPost("../ajax/sys/org/create", function () {
                            spa.closeModal();
                            if (data) {
                                data();
                            }
                        },function (data) {
                            util.alert(data.msg);
                        });
                    };
                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });

                var part = function (one, list) {
                    oValue = one;
                    oJudge = list || [];
                    var repeat,
                        b;
                    if (!oValue) {
                        util.alert('提示', '请先填写内容');
                        return;
                    }
                    if (oValue.length > 10) {
                        util.alert('提示', '添加内容不能超过10个字');
                        return;
                    } else {
                        var oValueList = oValue.split(","),
                            length = oValueList.length;
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

                function oString(data) {
                    var arry = new Array();
                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            arry.push(data[i]);
                        }
                    }
                    return arry.join(",");
                }

                root.find(".opt-industry").on("click", function () {
                    part(form.val().newIndustry, form.val().industryList);
                    form.val({newIndustry: "", industryList: oJudge});
                });
                root.find(".opt-subject").on("click", function () {
                    part(form.val().newSubject, form.val().subjectList);
                    form.val({newSubject: "", subjectList: oJudge});
                });
                root.find(".opt-qf").on("click", function () {
                    part(form.val().newQualification, form.val().qualificationList);
                    form.val({newQualification: "", qualificationList: oJudge});
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

                    accept: {
                        title: 'Images',
                        extensions: 'gif,jpg,jpeg,bmp,png',
                        mimeTypes: 'image/jpg,image/jpeg,image/png'
                    }
                });
                uploader.on('fileQueued', function (file) {
                    var $li = $(
                            '<div id="' + file.id + '" class="file-item thumbnail">' +
                            '<img>' +
                            '</div>'
                        ),
                        $btns = $('<div class="file-panel">' +
                            '<span class="cancel icon-remove-sign">删除</span>' +
                            '</div>').appendTo($li),
                        $img = $li.find('img');

                    $list.html($li);

                    uploader.makeThumb(file, function (error, src) {
                        if (error) {
                            $img.replaceWith('<span>不能预览</span>');
                            return;
                        }

                        $img.attr('src', src);
                    }, thumbnailWidth, thumbnailHeight);

                });
                uploader.on('uploadSuccess', function (file, data) {
                    $('#' + file.id).addClass('upload-state-done');
                    cacheImageKey = data.data[0].cacheKey;
                    form.val({fn: cacheImageKey});
                });
                uploader.on('uploadComplete', function (file) {
                    $('#' + file.id).find('.progress').remove();
                });
                $list.on("click", ".cancel", function () {
                    $(this).parent().parent().remove();
                });
                uploader.on('beforeFileQueued', function (file) {
                    uploader.reset();
                });
                $.fn.citySelect();
                $(document).on("click", "#City li a", function () {
                    var aVal = $(this).text();
                    $(this).parent().parent().parent().find('.mr_show').text(aVal);
                    $(this).parent().parent().parent().find('input[name=cho_City]').val(aVal);
                    if ($("#ocity").text() == "请选择城市") {
                        $("#ocity").removeClass("mr_select");
                    } else {
                        $("#ocity").addClass("mr_select");
                    }
                    // console.log($("#ocity").text(),$("#oprovince").text())
                    form.val({province: $("#oprovince").text(), city: $("#ocity").text()});
                });
                saveBtn.on("click", save);
            }
        }
    });
});