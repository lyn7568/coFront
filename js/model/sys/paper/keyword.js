/**
 * Created by TT on 2017/8/23.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form"], function (spa, util, fb) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_paper_keyword");
                var ca = {ready: true, items: []};
                var form = fb.build(root.find(".newForm"), {
                    keywordList: ca
                });
                var oValue;
                var oJudge;
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        if (form.val().keywordList) {
                            form.val({
                                keywords: oString(form.val().keywordList)
                            });
                        } else {
                            form.val({keywords: null});
                        }


                        util.post("../ajax/paper/keywords", {
                            id: data.data.id,
                            keywords: form.val().keywords
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

                if (data.data.keywords) {
                    form.val({keywordList: split(data.data.keywords)});
                }

                root.find(".opt-keyword").on("click", function () {
                    part(form.val().newKeyword, form.val().keywordList, 5);
                    form.val({newKeyword: "", keywordList: oJudge});
                });

                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });

                saveBtn.on("click", save);
            }
        }
    });
});

