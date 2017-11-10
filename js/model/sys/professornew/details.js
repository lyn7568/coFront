/**
 * Created by TT on 2017/7/7.
 */
;
spa_define(function () {
    return $.use(["spa", "util", "form", "code"], function (spa, util, fb, code) {
        return {
            modal: function (data) {
                var root = spa.findInModal(".sys_professornew_details");
                var ca = {ready: true, items: []};
                var dp = code.parseCode(root.find(".dt-project"));
                var dh = code.parseCode(root.find(".dt-honor"));
                var dj = code.parseCode(root.find(".dt-job"));
                var de = code.parseCode(root.find(".dt-edu"));
                var form = fb.build(root.find(".newForm"), {
                    industryList: ca,
                    subjectList: ca,
                    researchAreaList: ca
                });
                var oValue;
                var oJudge;
                var trim = function (str) { //删除左右两端的空格			　　
                    return str.replace(/(^\s*)|(\s*$)/g, "");
                };
                var saveBtn = root.find(".opt-save"),
                    save = function () {
                        var researchAreas = [];
                        var researchList = form.val().researchAreaList || [];
                        for (var i = 0; i < researchList.length; ++i) {
                            var item = {caption: researchList[i], professorId: data.data.id};
                            researchAreas.push(item);
                        }
                        form.val({researchAreas: researchAreas});
                        if(form.val().industryList) {
                            form.val({
                                industry: oString(form.val().industryList)
                            });
                        }else {
                            form.val({industry: null});
                        }
                        if(form.val().subjectList) {
                            form.val({
                                subject: oString(form.val().subjectList)
                            });
                        }else {
                            form.val({subject: null});
                        }
                        form.val({
                            subjectList: "", industryList: "", researchAreaList: ""
                        });
                        if (form.val().title) {
                            var title = trim(form.val().title);
                            if (title.length > 20) {
                                util.alert("职称不得超过20个字");
                                return;
                            }
                        }
                        if (form.val().office) {
                            var office = trim(form.val().office);
                            if (office.length > 20) {
                                util.alert("职位不得超过20个字");
                                return;
                            }
                        }
                        if (form.val().orgName) {
                            var orgName = trim(form.val().orgName);
                            if (orgName.length > 50) {
                                util.alert("所在机构不得超过50个字");
                                return;
                            }
                        }
                        if (form.val().department) {
                            var department = trim(form.val().department);
                            if (department.length > 20) {
                                util.alert("所在部门不得超过20个字");
                                return;
                            }
                        }
                        if (form.val().descp) {
                            var descp = trim(form.val().descp);
                            if (descp.length > 500) {
                                util.alert("个人简介不得超过500个字");
                            }
                        }
                        if (form.val().phone) {
                            var phone = trim(form.val().phone);
                            if (trim(phone)) {
                                if (phone.length > 50) {
                                    util.alert('提示', '联系电话不得超过50个字');
                                    return;
                                }
                            }
                        }
                        if (form.val().email) {
                            var email = trim(form.val().email);
                            var gunf = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                            if (!gunf.test(email)) {
                                util.alert("联系邮箱格式有误，请检查后重新填写");
                                return;
                            }
                        }
                        if (form.val().name) {
                            var name = trim(form.val().name);
                            if (name.length > 10) {
                                util.alert("姓名最长为10个字");
                                return;
                            }
                        }
                        if (form.val().name == null) {
                            util.alert("请输入专家姓名");
                        } else if (form.val().loginPhone || form.val().loginEmail) {
                            form.doPut("../ajax/sys/professor", function () {
                                spa.closeModal();
                                if (data.hand) {
                                    data.hand();
                                }
                            }, {"50000":"只能修改未激活用户信息"});
                        } else {
                            util.alert("手机或邮箱至少输入一项");
                        }
                    };
                var part = function (one, list) {
                    oValue = one;
                    oJudge = list || [];
                    var repeat,
                        b;
                    if (!oValue) {
                        util.alert('提示', '请先填写内容');
                        return;
                    }
                    if (oValue.length > 15) {
                        util.alert('提示', '添加内容不能超过15个字');

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

                var part2 = function (one, list) {
                    oValue = one;
                    oJudge = list || [];
                    var repeat,
                        b;
                    if (!oValue) {
                        util.alert('提示', '请先填写内容');
                        return;
                    }
                    if (oValue.length > 20) {
                        util.alert('提示', '添加内容不能超过20个字');

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

                var split = function (data) {
                    var index = data.split(",");
                    var arr = [];
                    for (var m = 0; m < index.length; m++) {
                        ca.items.push({code: index[m], caption: index[m]});
                        arr.push(index[m]);
                    }
                    return arr;
                };

                var split2 = function (data) {
                    var arr = [];
                    for (var m = 0; m < data.length; m++) {
                        ca.items.push({code: data[m].caption, caption: data[m].caption});
                        arr.push(data[m].caption);
                    }
                    return arr;
                };

                if (data.data.industry) {
                    form.val({industryList: split(data.data.industry)});
                }
                if (data.data.subject) {
                    form.val({subjectList: split(data.data.subject)});
                }
                if (data.data.researchAreas) {
                    form.val({researchAreaList: split2(data.data.researchAreas)});
                }


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
                    var arry = [];
                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            arry.push(data[i]);
                        }
                    }
                    return arry.join(",");
                }

                root.find(".name").on("focusout", function () {
                    if (form.val().name != data.data.name) {
                        if (form.val().name) {
                            var name = trim(form.val().name);
                            if (name.length > 10) {
                                util.alert("姓名最长为10个字，请重新修改");
                                form.val({name: data.data.name});
                                return;
                            }
                        }
                        if (form.val().name == null) {
                            util.alert("专家姓名不可为空，请重新修改");
                            form.val({name: data.data.name});
                            return;
                        }
                        util.boxMsg({
                            title: "确认修改",
                            content: "您修改了姓名，该专家的专利和论文将取消关联，确定修改？",
                            btns: [{
                                caption: "确认",
                                hand: function () {
                                    util.post("../ajax/sys/professor/updateName", {
                                        name: form.val().name,
                                        id: data.data.id
                                    }, function () {
                                        data.data.name = form.val().name;
                                    }, {});
                                }
                            },
                                {
                                    caption: "取消",hand:function () {
                                    form.val({name: data.data.name});
                                }}
                            ]
                        });
                    }
                });

                root.find(".org").on("focusout", function () {
                    if (form.val().orgName != data.data.orgName) {
                        if (form.val().orgName) {
                            var orgName = trim(form.val().orgName);
                            if (orgName.length > 50) {
                                util.alert("机构名最长为50个字，请重新修改");
                                form.val({orgName: data.data.orgName});
                                return;
                            }
                        }
                        util.boxMsg({
                            title: "确认修改",
                            content: "修改了所在机构，该专家认证员工身份将失效，为企业发布的需求也将关闭，确定修改？",
                            btns: [{
                                caption: "确认",
                                hand: function () {
                                    util.post("../ajax/sys/professor/updateOrgName", {
                                        orgName: form.val().orgName,
                                        orgId:data.data.orgId,
                                        id: data.data.id
                                    }, function () {
                                        data.data.orgName = form.val().orgName;
                                    }, {});
                                }
                            },
                                {caption: "取消",hand:function () {
                                    form.val({orgName: data.data.orgName});
                                }}
                            ]
                        });
                    }
                });

                root.find(".opt-industry").on("click", function () {
                    part(form.val().newIndustry, form.val().industryList);
                    form.val({newIndustry: "", industryList: oJudge});
                });
                root.find(".opt-subject").on("click", function () {
                    part(form.val().newSubject, form.val().subjectList);
                    form.val({newSubject: "", subjectList: oJudge});
                });
                root.find(".opt-ra").on("click", function () {
                    part2(form.val().newResearchArea, form.val().researchAreaList);
                    form.val({newResearchArea: "", researchAreaList: oJudge});
                });
                root.find(".modal-ctrl .icon-times").on("click", function () {
                    spa.closeModal();
                });

                root.find(".opt-project-new").on("click", function () {
                    spa.showModal("sys_professornew_project_new", {
                        data: data.data.id, hand: function () {
                            loadPorject();
                        }
                    });
                });
                root.on("click", ".opt-project-edit", function () {
                    var pid = $(this).parent().attr("pid");
                    util.get("../ajax/project/" + pid, null, function (project) {
                        if (project) {
                            spa.showModal("sys_professornew_project_edit", {
                                data: project, hand: function () {
                                    loadPorject();
                                }
                            });
                        } else {
                            util.alert("该项目经历不存在");
                        }
                    });
                });
                root.on("click", ".opt-project-del", function () {
                    var pid = $(this).parent().attr("pid");
                    util.get("../ajax/project/" + pid, null, function (project) {
                        if (project) {
                            util.boxMsg({
                                title: "确认删除",
                                content: "确认删除该项目经历？删除后无法恢复。",
                                btns: [{
                                    caption: "删除",
                                    hand: function () {
                                        util.del("../ajax/project/" + pid, function () {
                                            loadPorject();
                                        }, {});
                                    }
                                },
                                    {caption: "取消"}
                                ]
                            });
                        } else {
                            util.alert("该项目经历不存在");
                        }
                    });
                });
                root.find(".opt-honor-new").on("click", function () {
                    spa.showModal("sys_professornew_honor_new", {
                        data: data.data.id, hand: function () {
                            loadHonor();
                        }
                    });
                });
                root.on("click", ".opt-honor-edit", function () {
                    var hid = $(this).parent().attr("hid");
                    util.get("../ajax/honor/" + hid, null, function (honor) {
                        if (honor) {
                            spa.showModal("sys_professornew_honor_edit", {
                                data: honor, hand: function () {
                                    loadHonor();
                                }
                            });
                        } else {
                            util.alert("该荣誉奖项不存在");
                        }
                    });
                });
                root.on("click", ".opt-honor-del", function () {
                    var hid = $(this).parent().attr("hid");
                    util.get("../ajax/honor/" + hid, null, function (honor) {
                        if (honor) {
                            util.boxMsg({
                                title: "确认删除",
                                content: "确认删除该荣誉奖项？删除后无法恢复。",
                                btns: [{
                                    caption: "删除",
                                    hand: function () {
                                        util.del("../ajax/honor/" + hid, function () {
                                            loadHonor();
                                        }, {});
                                    }
                                },
                                    {caption: "取消"}
                                ]
                            });
                        } else {
                            util.alert("该荣誉奖项不存在");
                        }
                    });
                });
                root.find(".opt-job-new").on("click", function () {
                    spa.showModal("sys_professornew_job_new", {
                        data: data.data.id, hand: function () {
                            loadJob();
                        }
                    });
                });
                root.on("click", ".opt-job-edit", function () {
                    var jid = $(this).parent().attr("jid");
                    util.get("../ajax/job/" + jid, null, function (job) {
                        if (job) {
                            spa.showModal("sys_professornew_job_edit", {
                                data: job, hand: function () {
                                    loadJob();
                                }
                            });
                        } else {
                            util.alert("该工作经历不存在");
                        }
                    });
                });
                root.on("click", ".opt-job-del", function () {
                    var jid = $(this).parent().attr("jid");
                    util.get("../ajax/job/" + jid, null, function (job) {
                        if (job) {
                            util.boxMsg({
                                title: "确认删除",
                                content: "确认删除该工作经历？删除后无法恢复。",
                                btns: [{
                                    caption: "删除",
                                    hand: function () {
                                        util.del("../ajax/job/" + jid, function () {
                                            loadJob();
                                        }, {});
                                    }
                                },
                                    {caption: "取消"}
                                ]
                            });
                        } else {
                            util.alert("该工作经历不存在");
                        }
                    });
                });
                root.find(".opt-edu-new").on("click", function () {
                    spa.showModal("sys_professornew_edu_new", {
                        data: data.data.id, hand: function () {
                            loadEdu();
                        }
                    });
                });
                root.on("click", ".opt-edu-edit", function () {
                    var eid = $(this).parent().attr("eid");
                    util.get("../ajax/edu/" + eid, null, function (edu) {
                        if (edu) {
                            spa.showModal("sys_professornew_edu_edit", {
                                data: edu, hand: function () {
                                    loadEdu();
                                }
                            });
                        } else {
                            util.alert("该教育经历不存在");
                        }
                    });
                });
                root.on("click", ".opt-edu-del", function () {
                    var eid = $(this).parent().attr("eid");
                    util.get("../ajax/edu/" + eid, null, function (edu) {
                        if (edu) {
                            util.boxMsg({
                                title: "确认删除",
                                content: "确认删除该教育经历？删除后无法恢复。",
                                btns: [{
                                    caption: "删除",
                                    hand: function () {
                                        util.del("../ajax/edu/" + eid, function () {
                                            loadEdu();
                                        }, {});
                                    }
                                },
                                    {caption: "取消"}
                                ]
                            });
                        } else {
                            util.alert("该教育经历不存在");
                        }
                    });
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
                    if ($("#oprovince").text() != "请选择省份") {
                        form.val({province: $("#oprovince").text()});
                    }
                    if ($("#ocity").text() != "请选择城市") {
                        form.val({address: $("#ocity").text()});
                    }

                });

                if (data.data.province) {
                    $("#oprovince").text(data.data.province);
                }
                if (data.data.address) {
                    $("#ocity").text(data.data.address);
                }
                saveBtn.on("click", function () {
                    save();
                });

                // data.data.projects = data.data.projects || [];
                // for (var i = 0; i < data.data.projects.length; ++i) {
                //     data.data.projects[i].no = i;
                // }
                // dp.val(data.data.projects);
                //
                // data.data.honors = data.data.honors || [];
                // for (var i = 0; i < data.data.honors.length; ++i) {
                //     data.data.honors[i].no = i;
                // }
                // dh.val(data.data.honors);
                //
                // data.data.jobs = data.data.jobs || [];
                // for (var i = 0; i < data.data.jobs.length; ++i) {
                //     data.data.jobs[i].no = i;
                // }
                // dj.val(data.data.jobs);
                //
                // data.data.edus = data.data.edus || [];
                // for (var i = 0; i < data.data.edus.length; ++i) {
                //     data.data.edus[i].no = i;
                // }
                // de.val(data.data.edus);

                /*
                 加载项目经历、荣誉奖项、工作经历、教育背景
                 */
                var loadPorject = function () {
                    util.get("../ajax/project/professor", {professorId: data.data.id}, function (projects) {
                        dp.val(projects);
                    });
                };
                var loadHonor = function () {
                    util.get("../ajax/honor/professor", {professorId: data.data.id}, function (honors) {
                        dh.val(honors);
                    });
                };
                var loadJob = function () {
                    util.get("../ajax/job/professor", {professorId: data.data.id}, function (jobs) {
                        dj.val(jobs);
                    });
                };
                var loadEdu = function () {
                    util.get("../ajax/edu/professor", {professorId: data.data.id}, function (edus) {
                        de.val(edus);
                    });
                };
                form.val(data.data);
                loadPorject();
                loadHonor();
                loadJob();
                loadEdu();
            }
        }
    });
});