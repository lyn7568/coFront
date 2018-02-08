/**
 * Created by TT on 2018/1/30.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_question_keys");
                var ca = {ready: true, items: []};
                var form = fb.build(root.find(".newForm"), {
                    keyList: ca
                });
                var oValue;
                var oJudge;

                util.get("../ajax/qa/question?id=" + data.id, null, function (data) {
                    if (data) {
                        if (data.keys) {
                            form.val({keyList: split(data.keys)});
                        }
                    } else {
                        util.alert("此问题不存在");
                    }
                });

                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (form.val().keyList) {
                            form.val({
                                keys: oString(form.val().keyList)
                            });
                        } else {
                            util.alert("问题关键词不可为空");
                            return;
                        }
                        util.post("../ajax/qa/question/keys", {
                            id: data.id,
                            keys: form.val().keys
                        }, function () {
                            spa.closeModal();
                            if (data.hand) {
                                data.hand();
                            }
                        }, {});
                    };
                var trim = function (str) { //删除左右两端的空格
                    return str.replace(/(^\s*)|(\s*$)/g, "");
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

                var split = function (data) {
                    var index = data.split(",");
                    var arr = [];
                    for (var m = 0; m < index.length; m++) {
                        ca.items.push({code: index[m], caption: index[m]});
                        arr.push(index[m]);
                    }
                    return arr;
                };

                root.find(".opt-key").on("click", function () {
                    part(form.val().newKey, form.val().keyList, 5);
                    form.val({newKey: "", keyList: oJudge});
                });

                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });

                saveBtn.on("click", save);
            }
        }
    });
});
