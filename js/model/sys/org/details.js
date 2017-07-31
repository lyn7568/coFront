/**
 * Created by TT on 2017/5/23.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form", "upload"], function (spa, util, fb, upload) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_org_details");
                var ca = {ready: true, items: []};
                var form = fb.build(root.find(".newForm"), {
                    industryList: ca,
                    subjectList: ca,
                    qualificationList: ca,
                    fieldOfCustomerList:ca,
                    fieldOfSupplierList:ca
                });
                var id = util.data("loginUser").id;
                var cacheImageKey = null;
                var oValue;
                var oJudge;
                var trim = function (str) { //删除左右两端的空格			　　
                    return str.replace(/(^\s*)|(\s*$)/g, "");
                };
                var saveBtn = root.find(".opt-save"),
                    headArea = root.find(".head-ctn"),
                    save = function () {
                        console.log(form.val().fn);
                        form.val({inviterId: id});
                        form.val({
                            industry: oString(form.val().industryList),
                            subject: oString(form.val().subjectList),
                            qualification: oString(form.val().qualificationList),
                            fieldOfCustomer:oString(form.val().fieldOfCustomerList),
                            fieldOfSupplier:oString(form.val().fieldOfSupplierList)
                        });
                        if (form.val().forShort) {
                            var forShort = trim(form.val().forShort);
                            if (forShort.length > 10) {
                                util.alert("简介不得超过10个字");
                                return;
                            }
                        }
                        if (form.val().orgUrl) {
                            var orgUrl = trim(form.val().orgUrl);
                            if (orgUrl.length > 20) {
                                util.alert("官网长度不得超过20个字");
                                return;
                            }
                        }
                        if (form.val().addr) {
                            var addr = trim(form.val().addr);
                            if (addr.length > 20) {
                                util.alert("地址字数不得超过20个字");
                                return;
                            }
                        }
                        if (form.val().contactNum) {
                            var contactNum = trim(form.val().contactNum);
                            if (contactNum.length > 50) {
                                util.alert("联系电话不得超过50个字");
                                return;
                            }
                        }
                        if (form.val().email) {
                            var email = trim(form.val().email);
                            if (email.length > 50) {
                                util.alert("联系邮箱不得超过50个字");
                                return;
                            }
                        }
                        if (form.val().orgType == null) {
                            form.val({orgType: 1});
                        }
                        if (form.val().forShort == null) {
                            util.alert("请输入企业简称");
                            return;
                        }
                        else form.doPost("../ajax/sys/org/update", function () {
                                spa.closeModal();
                                if (data.hand) {
                                    data.hand();
                                }
                                // location.reload();
                            }, {});
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
                if (data.data.subject) {
                    form.val({subjectList: split(data.data.subject)});
                }
                if (data.data.qualification) {
                    form.val({qualificationList: split(data.data.qualification)});
                }
                if (data.data.fieldOfSupplier) {
                    form.val({fieldOfSupplierList: split(data.data.fieldOfSupplier)});
                }
                if (data.data.fieldOfCustomer) {
                    form.val({fieldOfCustomerList: split(data.data.fieldOfCustomer)});
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

                var part2 = function (one, list,num) {
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
                    if (oValue.length > 20) {
                        util.alert('提示', '添加内容不能超过20个字');
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

                var part3 = function (one, list,num) {
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
                    part(form.val().newIndustry, form.val().industryList,3);
                    form.val({newIndustry: "", industryList: oJudge});
                });
                root.find(".opt-subject").on("click", function () {
                    part(form.val().newSubject, form.val().subjectList,20);
                    form.val({newSubject: "", subjectList: oJudge});
                });
                root.find(".opt-qf").on("click", function () {
                    part2(form.val().newQualification, form.val().qualificationList,10);
                    form.val({newQualification: "", qualificationList: oJudge});
                });
                root.find(".opt-fos").on("click", function () {
                    part3(form.val().newFieldOfSupplier, form.val().fieldOfSupplierList,5);
                    form.val({newFieldOfSupplier: "", fieldOfSupplierList: oJudge});
                });
                root.find(".opt-foc").on("click", function () {
                    part3(form.val().newFieldOfCustomer, form.val().fieldOfCustomerList,5);
                    form.val({newFieldOfCustomer: "", fieldOfCustomerList: oJudge});
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
                if (data.data.province) {
                    $("#oprovince").text(data.data.province);
                }
                if (data.data.city) {
                    $("#ocity").text(data.data.city);
                }
                if (data.data.hasOrgLogo) {
                    // $("#oimg").attr("src", "../data/images/org/" + data.data.id + ".jpg");
                    var $li = $(
                            '<div class="file-item thumbnail">' +
                            // '<img  src="../data/images/org/" id="oimg" />' +
                            '<img  src="http://www.ekexiu.com/images/org/" id="oimg" />' +
                            '</div>'
                        ),
                        $img = $li.find('img');
                    $list.html($li);
                    // $img.attr('src',  "../data/images/org/" + data.data.id + ".jpg");
                    $img.attr('src',  "http://www.ekexiu.com/images/org/" + data.data.id + ".jpg");
                }
                saveBtn.on("click", save);
            }
        }
    });
});