/**
 * Created by TT on 2018/5/23.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form", "upload"], function (spa, util, fb, upload) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_platform_details");
                var ca = {ready: true, items: []};
                var form = fb.build(root.find(".newForm"), {
                    industryList: ca
                });
                var oValue;
                var oJudge;
                var trim = function (str) { //删除左右两端的空格			　　
                    return str.replace(/(^\s*)|(\s*$)/g, "");
                };
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        form.val({
                            industry: oString(form.val().industryList)
                        });
                        if (form.val().url) {
                            var url = trim(form.val().url);
                            if (url.length > 50) {
                                util.alert("官网长度不得超过50个字");
                                return;
                            }
                        }
                        if (form.val().addr) {
                            var addr = trim(form.val().addr);
                            if (addr.length > 50) {
                                util.alert("地址字数不得超过50个字");
                                return;
                            }
                        }
                        if (form.val().linkphone) {
                            var linkphone = trim(form.val().linkphone);
                            if (linkphone.length > 50) {
                                util.alert("联系电话不得超过50个字");
                                return;
                            }
                        }
                        if (form.val().linkemail) {
                            var linkemail = trim(form.val().linkemail);
                            if (linkemail.length > 50) {
                                util.alert("联系邮箱不得超过50个字");
                                return;
                            }
                        }
                        if (form.val().descp) {
                            var descp = trim(form.val().descp);
                            if (descp.length > 1000) {
                                util.alert("联系邮箱不得超过1000个字");
                                return;
                            }
                        }
                        form.doPost(baseUrl+"/ajax/platform/info", function () {
                            spa.closeModal();
                            if (data.hand) {
                                data.hand();
                            }
                            // location.reload();
                        }, {});
                        console.log("tt")
                    };

                var split = function (data) {
                    var index = data.split(",");
                    var arr = [];
                    for (var m = 0; m < index.length; m++) {
                        ca.items.push({code: index[m], caption: index[m]});
                        arr.push(index[m]);
                    }
                    return arr;
                };
                if (data.data.industry) {
                    form.val({industryList: split(data.data.industry)});
                }

                form.val(data.data);

                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });

                var part = function (one, list,num) {
                    oValue = one;
                    oJudge = list || [];
                    if (oJudge.length>=num) {
                        util.alert("最多"+num+"个");
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
                    part(form.val().newIndustry, form.val().industryList,10);
                    form.val({newIndustry: "", industryList: oJudge});
                });

                var $list = $('#fileList'),
                    ratio = window.devicePixelRatio || 1,
                    thumbnailWidth = 100 * ratio,
                    thumbnailHeight = 100 * ratio,
                    uploader;
                uploader = WebUploader.create({
                    auto: true,
                    server: baseUrl+'/ajax/platform/upload',

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
                    var uri = data.data[0].uri;
                    form.val({logo: uri});
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
                    form.val({province: $("#oprovince").text(), city: $("#ocity").text()});
                });
                if (data.data.province) {
                    $("#oprovince").text(data.data.province);
                }
                if (data.data.city) {
                    $("#ocity").text(data.data.city);
                }
                if (data.data.logo) {
                    // $("#oimg").attr("src", "../data/images/org/" + data.data.id + ".jpg");
                    var $li = $(
                            // '<div class="file-item thumbnail">' +
                            // // '<img  src="../data/images/org/" id="oimg" />' +
                            // '<img  src=baseUrl+"/images/org/" id="oimg" />' +
                            // '</div>'
                        ),
                        $img = $li.find('img');
                    $list.html($li);
                    // $img.attr('src',  "../data/images/org/" + data.data.id + ".jpg");
                    $img.attr('src',  baseUrl+"/data/platform" + data.data.logo);
                }
                saveBtn.on("click", save);
            }
        }
    });
});