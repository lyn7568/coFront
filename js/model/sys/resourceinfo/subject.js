/**
 * Created by TT on 2017/8/23.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_resourceinfo_subject");
                var ca = {ready: true, items: []};
                var form = fb.build(root.find(".newForm"), {
                    subjectList: ca
                });
                var oValue;
                var oJudge;

                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (form.val().subjectList) {
                            form.val({
                                subject: oString(form.val().subjectList)
                            });
                        } else {
                            form.val({subject: null});
                        }


                        util.post("../ajax/resource/subject", {
                            resourceId: data.data.resourceId,
                            subject: form.val().subject
                        }, function () {
                            spa.closeModal();
                            if (data.hand) {
                                data.hand();
                            }
                        }, {});
                    };

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

                var split = function (data) {
                    var index = data.split(",");
                    var arr = [];
                    for (var m = 0; m < index.length; m++) {
                        ca.items.push({code: index[m], caption: index[m]});
                        arr.push(index[m]);
                    }
                    return arr;
                };

                if (data.data.subject) {
                    form.val({subjectList: split(data.data.subject)});
                }

                root.find(".opt-subject").on("click", function () {
                    part(form.val().newSubject, form.val().subjectList, 5);
                    form.val({newSubject: "", subjectList: oJudge});
                });

                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });

                saveBtn.on("click", save);
            }
        }
    });
});
