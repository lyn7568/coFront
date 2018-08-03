/**
 * Created by TT on 2018/7/23.
 */
$(document).ready(function() {
    var baseUrl = "http://192.168.3.233:81";
    loginStatus();
    var productId = GetQueryString("productId");
    if(productId) {
        $("#deleteResource").removeClass("disableLi").addClass("deleteResource");
        getRecourceMe();
    }
    // var orgId = $.cookie('orgId');
    // if(orgId == "" || orgId == null || orgId == "null"){
    //     location.href = "cmp-settled-log.html";
    // }
    var temp = [];
    var array = [];
    var oProfessor=[];
    var hbur,hburEnd;
    var ue = UE.getEditor('editor', {});
    function loginStatus() {
        $.ajax({
            type: "get",
            async:false,
            url:"/ajax/sys/user",
            success:function (data) {
                if(data.success == true) {
                    var userid = data.data.id;
                    if (userid == undefined || userid.length == 0 || userid == "null") {
                        location.href = "http://"+window.location.host+"/html/index.html";
                    }
                }else {
                    location.href = "http://"+window.location.host+"/html/index.html";
                }
            }
        });
    }

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);

        var context = "";
        if(r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : decodeURI(context);
    }

    function hotKey(sel, num) {
        $(sel).bind({
            paste: function(e) {
                var pastedText;
                if (window.clipboardData  &&  window.clipboardData.getData)  {  // IE
                    pastedText  = $(this).val() +  window.clipboardData.getData('Text');
                }else{
                    pastedText  = $(this).val() +  e.originalEvent.clipboardData.getData('Text'); //e.clipboardData.getData('text/plain');
                }
                $(this).val(pastedText);

                var $this = $(this);
                setTimeout(function() {
                    if($this.val().trim()) {
                        $this.siblings("button").show();
                    } else {
                        $this.siblings("button").hide();
                    }
                }, 1);
                e.preventDefault();
            },
            cut: function(e) {
                var $this = $(this);
                setTimeout(function() {
                    if($this.val().trim()) {
                        $this.siblings("button").show();
                    } else {
                        $this.siblings("button").hide();
                    }
                }, 1);
            },
            blur: function() {
                var $this = $(this);
                setTimeout(function() {
                    $this.siblings(".keydrop").hide();
                }, 500)
            },
            focus: function() {
                $(this).siblings(".keydrop").show();
            },
            keyup: function(e) {
                var ti=$(this).val();
                var $t=this;
                $t.comr=ti;
                var $this=$(this);
                if($(this).val().trim()) {
                    $(this).siblings("button").show();
                    var lNum = $.trim($(this).val()).length;
                    if(0 < lNum) {
                        setTimeout(function(){
                            if( ti===$t.comr && ti!== $t.comrEnd) {
                                var tt=ti;
                                $t.comrEnd=tt;
                                $("#addKeyword").show();
                                $.ajax({
                                    "url": "/ajax/article/qaHotKey",
                                    "type": "GET",
                                    "success": function(data) {
                                        console.log(data);
                                        if(data.success) {
                                            if($t.comrEnd==tt) {
                                                if(data.data.length == 0) {
                                                    $this.siblings(".keydrop").addClass("displayNone");
                                                    $this.siblings(".keydrop").find("ul").html("");
                                                } else {
                                                    $this.siblings(".keydrop").removeClass("displayNone");
                                                    var oSr = "";
                                                    for(var i = 0; i < Math.min(data.data.length,5); i++) {
                                                        oSr += '<li>' + data.data[i].caption + '<div class="closeThis"></div></li>';
                                                    }
                                                    $this.siblings(".keydrop").find("ul").html(oSr);
                                                }
                                            }
                                        } else {
                                            $this.siblings(".keydrop").addClass("displayNone");
                                            $this.siblings(".keydrop").find("ul").html("");
                                        }
                                    },
                                    "data": {
                                        "key": $this.val()
                                    },
                                    dataType: "json",
                                    'error': function() {
                                        $.MsgBox.Alert('提示', '服务器连接超时！');
                                    }
                                });
                            }
                        },500);
                    }
                } else {
                    $(this).siblings("button").hide();
                    $(this).siblings(".keydrop").addClass("displayNone");
                    $(this).siblings(".keydrop").find("ul").html("");
                }
            }
        })
        $(".keydrop").on("click", "li", function() {
            var oValue = $(this).text();
            var oJudge = $(this).parents(".col-w-12").siblings().find("ul.ulspace li");
            var addNum = $(this).parents(".keydrop").siblings("input").attr("data-num");

            for(var i = 0; i < oJudge.length; i++) {
                if(oValue == oJudge[i].innerText) {
                    $.MsgBox.Alert('提示', '添加内容不能重复');
                    return;
                }
            }
            $(this).parents(".col-w-12").siblings().find("ul.ulspace").append('<li>' + oValue + '<div class="closeThis"></div></li>');
            $(this).parents(".keydrop").siblings("input").val("");
            $(this).parents(".keydrop").siblings("button").hide();
            if(oJudge.length == addNum - 1) {
                $(this).parents(".keydrop").siblings("input").val("");
                $(this).parents(".col-w-12").hide();
            }
            $(this).parent("ul").html("")
        })
        if(num == 1) {
            return;
        } else {
            $(".addButton").siblings("input").keypress(function(){/*添加*/
                var e = event || window.event;
                if(e.keyCode == 13) {
                    var oValue = $(this).val().trim();
                    var oJudge = $(this).parent().siblings().find("ul.ulspace li");
                    var addContent = $(this).attr("data-pro");
                    var addNum = $(this).attr("data-num");
                    var addfontSizeNum = $(this).attr("data-fontSizeN");
                    if(!oValue) {
                        $.MsgBox.Alert('提示', '请先填写内容');
                        return;
                    }
                    if(oValue.length > addfontSizeNum) {
                        $.MsgBox.Alert('提示', addContent);
                        return;
                    }
                    for(var i = 0; i < oJudge.length; i++) {
                        if(oValue == oJudge[i].innerText) {
                            $.MsgBox.Alert('提示', '添加内容不能重复');
                            return;
                        }
                    }
                    $(this).parent().siblings().find("ul.ulspace").append('<li>' + oValue + '<div class="closeThis"></div></li>');
                    $(this).siblings(".addButton").hide();
                    $(this).val("");
                    if(oJudge.length == addNum - 1) {
                        $(this).val("").parents(".col-w-12").hide();
                    }
                    $(this).siblings(".keydrop").find("ul").html("");
                }
            })
            $(".addButton").click(function() {
                var oValue = $(this).siblings("input").val().trim();
                var oJudge = $(this).parent().siblings().find("ul.ulspace li");
                var addContent = $(this).siblings("input").attr("data-pro");
                var addNum = $(this).siblings("input").attr("data-num");
                var addfontSizeNum = $(this).siblings("input").attr("data-fontSizeN");
                if(!oValue) {
                    $.MsgBox.Alert('提示', '请先填写内容');
                    return;
                }
                if(oValue.length > addfontSizeNum) {
                    $.MsgBox.Alert('提示', addContent);
                    return;
                }
                for(var i = 0; i < oJudge.length; i++) {
                    if(oValue == oJudge[i].innerText) {
                        $.MsgBox.Alert('提示', '添加内容不能重复');
                        return;
                    }
                }
                $(this).parent().siblings().find("ul.ulspace").append('<li>' + oValue + '<div class="closeThis"></div></li>');
                $(this).hide();
                $(this).siblings("input").val("");
                if(oJudge.length == addNum - 1) {
                    $(this).val("").parents(".col-w-12").hide();
                }
                $(this).siblings(".keydrop").find("ul").html("");
            })
        }
    }

    function limitObj(obj,maxNum){
        $(obj).bind({
            paste: function(e) {
                if($(this).val().length==""){
                    $(this).parent().siblings(".btnModel").attr("disabled", true);
                }else{
                    $(this).parent().siblings(".btnModel").attr("disabled", false);
                }
                var pastedText;
                if (window.clipboardData  &&  window.clipboardData.getData)  {  // IE
                    pastedText  = $(this).val() +  window.clipboardData.getData('Text');
                }
                else  {
                    pastedText  = $(this).val() +  e.originalEvent.clipboardData.getData('Text'); //e.clipboardData.getData('text/plain');
                }
                $(this).val(pastedText);
                setTimeout(function() {
                    $(this).siblings().find("em").text($(obj).val().length);
                }, 1);
                e.preventDefault();
            },
            cut: function(e) {
                if($(this).val().length==""){
                    $(this).parent().siblings(".btnModel").attr("disabled", true);
                }else{
                    $(this).parent().siblings(".btnModel").attr("disabled", false);
                }
                setTimeout(function() {
                    $(obj).siblings().find("em").text($(obj).val().length);
                }, 1);
            },
            focus: function(e) {
                $(obj).parents("li").find(".frmconmsg").show();
                $(obj).siblings().find("em").text($(obj).val().length);
            },
            blur: function(e) {
                $(obj).parents("li").find(".frmconmsg").hide();
            },
            keyup: function(e) {
                if($(this).val().length==""){
                    $(this).parent().siblings(".btnModel").attr("disabled", true);
                }else{
                    $(this).parent().siblings(".btnModel").attr("disabled", false);
                }
                if($(this).val().length > maxNum) {
                    $(obj).val($(obj).val().substring(0, maxNum));
                    e.preventDefault();
                }
                setTimeout(function() {
                    $(obj).siblings().find("em").text($(obj).val().length);
                }, 1);
            }
        });
    }

    function ajaxRequist(url, obj, type, fn) {
        $.ajax({
            url: url,
            data: obj,
            dataType: 'json', //服务器返回json格式数据
            type: type, //支持'GET'和'POST'
            traditional: true,
            success: function(data) {
                if(data.success) {
                    fn(data)
                }
            },
            error: function(xhr, type, errorThrown) {
                $.MsgBox.Alert('提示', '服务器请求失败');
            }
        });
    }
    /*获取资源信息*/
    function getRecourceMe() {
        $.ajax({
            "url": baseUrl+"/ajax/product/qo",
            "type": "GET",
            "success": function(data) {
                console.log(data);
                if(data.success) {
                    $("#uploadDd").siblings().remove();
                    $("#fileList").append("<dd></dd><dd></dd>");
                    temp=[];
                    resourceHtml(data.data);
                }
            },
            "data": {
                "id": productId
            },
            dataType: "json",
            'error': function() {
                $.MsgBox.Alert('提示', '服务器连接超时！');
            }
        });
    }
    /*处理资源html代码*/
    function resourceHtml($da) {
        $("#resourceName").val($da.name); //名字
        $("#application").val($da.cnt); //应用用途
        if($da.spec) { //厂商型号
            $("#modelNumber").val($da.spec);
        }
        if($da.parameter) { //性能参数
            $("#performancePa").val($da.parameter);
        }
        if($da.keywords) {
            var oSub = $da.keywords.split(",");
            var oSt = "";
            for(var i = 0; i < oSub.length; i++) {
                oSt += '<li>' + oSub[i] + '<div class="closeThis"></div></li>'
            }
            $("#keyWordlist").html(oSt);
            if(oSub.length>4){
                $("#KeyWord").parent().addClass("displayNone");
            }
        } else {
            $("#keyWordlist").html("");
        }
        if($da.descp) { //编辑器
            ue.ready(function() {
                ue.setContent($da.descp);
            });

        }
        if($da.price) {
            $("#priceInput").val($da.price);
        }
        if($da.producingArea) {
            $("#productAddressInput").val($da.producingArea);
        }
        if($da.images) {
            var arr = [];
            var oImg = $da.images.split(",");
            for(var i = 0; i < oImg.length; i++) {
                var oString = '<dd>' +
                    '<div class="imgItem">' +
                    '<img src="' + baseUrl+  "/data/product" + oImg[i] + '"/>' +
                    '</div>' +
                    '<div class="file-panel">' +
                    '<span class="cancel" flag=1></span>' +
                    '</div>' +
                    '</dd>'
                arr[i] = oString;
                temp[i] = oImg[i];
            }
            $("#fileList dd").eq(2).remove();
            if(oImg.length == 1) {
                $("#fileList").prepend(arr[0]);
            } else if(oImg.length == 2) {
                $("#fileList dd").eq(1).remove();
                $("#fileList").prepend(arr[1]);
                $("#fileList").prepend(arr[0]);
            } else if(oImg.length == 3) {
                $("#fileList dd").eq(1).remove();
                $("#fileList").prepend(arr[2]);
                $("#fileList").prepend(arr[1]);
                $("#fileList").prepend(arr[0]);
            }

        }
    }
    var uploader = WebUploader.create({
        auto: true,
        fileNumLimit: 3,
        swf: '../js/webuploader/Uploader.swf',
        server: '/ajax/product/upload',
        fileSingleSizeLimit: 2 * 1024 * 1024,
        pick: {
            id: "#filePicker",
            multiple: false
        },
        accept: {
            title: 'Images',
            extensions: 'jpg,jpeg,png',
            mimeTypes: 'image/jpg,image/png'
        }

    });

    // 当有文件添加进来的时候
    uploader.on('fileQueued', function(file) {
        fileId = file.id;
        var $len = $("#fileList").find("img").length;
        if($len == 0 || $len == 1) {
            var oRemove = $("#fileList").find("dd");
            oRemove.eq(oRemove.length - 1).remove();
        }
        var $li = $(
                '<dd>' +
                '<div class="imgItem" id="' + file.id + '">' +
                '<img />' +
                '</div>' +
                //'<div class="info">' + file.name + '</div>' +
                '</dd>'
            ),
            $btns = $('<div class="file-panel">' +
                '<span class="cancel"></span>' +
                '</div>').appendTo($li),
            $img = $li.find('img');
        var $list = $("#fileList");
        if($len == 1) {
            $list.find("dd").eq(0).after($li)
        } else if($len == 2) {
            $list.find("dd").eq(1).after($li)
        } else {
            $list.prepend($li);
        }
        uploader.makeThumb(file, function(error, src) {
            if(error) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }
            $img.attr('src', src);
        }, 1, 1);
    });
    uploader.onError = function(code) {
        console.log(code)
        $.MsgBox.Alert('提示', '请上传jpg、jpeg、png格式的图片，大小不超过2M')
    };
    uploader.on('uploadSuccess', function(file, data) {
        if(data.success) {
            temp.push(data.data[0].uri);
            console.log(temp)
            uploader.removeFile(fileId);

        }else{
            $.MsgBox.Alert('提示', '只支持jpeg/jpg/png格式的图片');
        }
    });
    /*删除图片*/
    $("#fileList").on("click", ".cancel", function() {
        var flag = $(this).attr("flag");
        var oNum = $(this).parents("dd").index();
        temp.splice(oNum, 1);
        $(this).parent().parent().remove();

        var $len = $("#fileList").find("img").length;
        if($len != 2) {
            $("#fileList").append("<dd></dd>")
        }

    });
    /*资源名称*/
    $("#resourceName").bind({
        focus: function() {
            $("#resourceNamePrompt").show();
        },
        blur: function() {
            $("#resourceNamePrompt").hide();
        },
        keyup: function() {
            if($(this).val().length > 30) {
                $(this).val($(this).val().substr(0, 30));
            }
        }
    })
    hotKey(".oinput");
    //校验关键字
    $("#KeyWord").on({
        focus: function() {
            $("#keyPrompt").text("最多可添加5个关键词，每个关键词15字以内");
        },
        blur: function() {
            $("#keyPrompt").text("");
        }
    })
    $("#keyWordlist").on("click", ".closeThis", function() {
        $(this).parent().remove();
        var liNum = $("#keyWordlist").find("li").length;
        if(liNum < 5) {
            $("#keyWordlist").parents(".keyResult").siblings("div.col-w-12").show();
        }
    })
    /*厂商型号*/
    $("#modelNumber").bind({
        focus: function() {
            $("#model").show();
        },
        blur: function() {
            $("#model").hide();
        },
        keyup: function() {
            if($(this).val().length > 50) {
                $(this).val($(this).val().substr(0, 50));
            }
        }

    });
    $("#productAddressInput").bind({
        focus: function() {
            $("#productAddress").show();
        },
        blur: function() {
            $("#productAddress").hide();
        },
        keyup: function() {
            if($(this).val().length > 50) {
                $(this).val($(this).val().substr(0, 50));
            }
        }

    });
    $("#priceInput").bind({
        focus: function() {
            $("#price").show();
        },
        blur: function() {
            $("#price").hide();
        },
        keyup: function() {
            if($(this).val().length > 50) {
                $(this).val($(this).val().substr(0, 50));
            }
        }

    });
    /*应用用途*/
    limitObj("#application",250)
    /*性能参数*/
    limitObj("#performancePa",1000)
    /*发布*/
    $(".goFabu").click(function() {
        if($(this).hasClass("disableLi")){
            return;
        }
        var oYes = term();
        if(oYes == 0) {
            return;
        }
        $.MsgBox.Confirm("提示", "确认发布该产品？", ajsPost);
    })
    /*预览*/
    // $("#oPreview").click(function() {
    //     if($(this).hasClass("disableLi")){
    //         return;
    //     }
    //     var oYes = term();
    //     if(oYes == 0) {
    //         return;
    //     }
    //     if(resourceId) {
    //         ajsPost(baseUrl+"/ajax/product/draft/update", 1);
    //     }else {
    //         ajsPost(baseUrl+"/ajax/product/draft", 1);
    //     }
    //
    // })
    // /*存草稿*/
    // $("#oDraft").click(function() {
    //     if($(this).hasClass("disableLi")){
    //         return;
    //     }
    //     var oYes = term();
    //     if(oYes == 0) {
    //         return;
    //     }
    //     if(resourceId) {
    //         ajsPost(baseUrl+"/ajax/product/draft/update", 2);
    //     }else {
    //         ajsPost(baseUrl+"/ajax/product/draft", 2);
    //     }
    // })
    // /*删除*/
    // $("#operateBlocko").on("click", ".deleteResource", function() {
    //     $.MsgBox.Confirm("提示", "确认删除该产品？", deleResource);
    // })
    // /*删除函数*/
    // function deleResource() {
    //     $.ajax({
    //         "url": baseUrl+"/ajax/product/delete",
    //         "type": "POST",
    //         "success": function(data) {
    //             console.log(data)
    //             if(data.success) {
    //                 location.href = "cmp-productList.html"
    //             }
    //         },
    //         "data": {
    //             "id": resourceId
    //         },
    //         "beforeSend": function() { /*console.log(this.data)*/ },
    //         "contentType": "application/x-www-form-urlencoded",
    //         dataType: "json"
    //     });
    // }
    /*条件是否匹配*/
    function term() {
        var $len = $("#fileList").find("img").length;
        var reName = $("#resourceName").val();
        var oIndustry = $("#application").val();
        var oLen=$("#expertli").find(".selectAdd").length
        if($len == 0) {
            $.MsgBox.Alert('提示', '请上传产品图片。');
            return 0;
        }
        if(reName == "") {
            $.MsgBox.Alert('提示', '请填写产品名称。');
            return 0;
        }
        if(oIndustry == "") {
            $.MsgBox.Alert('提示', '请填写产品简介。');
            return 0;
        }
        if(oLen==0) {
            $.MsgBox.Alert('提示', '至少选择一个联系人');
            return 0;
        }
    }
    /*发布函数*/
    function ajsPost(pa1, pa2) {

        var sdd=[];
        var sdf = $("#expertli").find(".selectAdd");
        for(var i=0;i<sdf.length;i++) {
            sdd.push(sdf.eq(i).parents("li").attr("id"));
        }
        var industrys = $("#keyWordlist li");
        var industryAll = "";
        if(industrys.size() > 0) {
            for(var i = 0; i < industrys.size(); i++) {
                industryAll += industrys[i].innerText.trim();
                industryAll += ',';
            };
            industryAll = industryAll.substring(0, industryAll.length - 1);
        }
        $(".operateBlock").find("li").addClass("disableLi");
        var oUrl = baseUrl+"/ajax/product/publish";
        if(productId) {
            oUrl = baseUrl+"/ajax/product/conUpdate";
        }
        if(pa1) {
            oUrl = pa1
        }
        var $data = {};
        if(productId) {
            $data.id = productId;
        }
        // $data.owner = orgId;
        $data.name = $("#resourceName").val(); //资源名字
        $data.keywords = industryAll;
        $data.cnt = $("#application").val();
        $data.spec = $("#modelNumber").val();
        $data.parameter = $("#performancePa").val();
        $data.descp = ue.getContent();
        $data.images = temp.join(",");
        $data.professor=sdd;
        $data.producingArea=$("#productAddressInput").val();
        $data.price = $("#priceInput").val()
        $.ajax({
            "url": oUrl,
            "type": "POST",
            "complete":function(){
                $(".operateBlock").find("li").removeClass("disableLi");
            },
            "success": function(data) {
                console.log(data)
                if(data.success) {
                    if(pa2 == 1) {
                        productId = data.data;
                        $("#deleteResource").removeClass("disableLi").addClass("deleteResource");
                        window.open("../productPreview.html?productId=" + data.data);
                        getRecourceMe();
                        //弹出预览
                    } else if(pa2 == 2) {
                        $("#deleteResource").removeClass("disableLi").addClass("deleteResource");
                        if(!productId)
                            productId = data.data;
                        $.MsgBox.Alert('提示', '产品已保存草稿。');
                        $("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
                        getRecourceMe();
                    } else {
                        $.MsgBox.Alert('提示', '产品发布成功！');
                        $("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
                        location.href = "cmp-productList.html"
                    }

                }else {
                    if(data.code==90) {
                        $.MsgBox.Alert('提示', '由于操作时间过久，上传图片已失效，请重新上传。');
                    }
                }
            },
            "data": $data,
            "beforeSend": function() { /*console.log(this.data)*/ },
            "contentType": "application/x-www-form-urlencoded",
            "traditional": true,
            dataType: "json"
        });
    }
    // DefaultContact()
    // function DefaultContact() {
    //     $.ajax({
    //         url: "/ajax/org/linkman/queryAll",
    //         type: "GET",
    //         timeout: 10000,
    //         dataType: "json",
    //         async:"true",
    //         data: {
    //             "oid": orgId
    //         },
    //         success: function(data, textState) {
    //             if(data.success) {
    //                 var $data = data.data;
    //                 if($data.length) {
    //                     oProfessor.push($data[0].pid);
    //                     var oLength=$("#expertli").find("li");
    //                     for(var i=0;i<oLength.length;i++) {
    //                         var sid = oLength.eq(i).attr("id");
    //                         if($data[0].pid ===sid) {
    //                             oLength.eq(i).find("[flag]").addClass("selectAdd");
    //                             break;
    //                         }
    //                     }
    //                 }
    //
    //             }
    //         },
    //         error: function(XMLHttpRequest, textStats, errorThrown) {
    //             $.MsgBox.Alert('提示', '服务器请求失败')
    //         }
    //     })
    // }
    // function UnauthorizedUser() {
    //     $.ajax({
    //         url: "/ajax/professor/qaOrgAuth",
    //         type: "GET",
    //         timeout: 10000,
    //         dataType: "json",
    //         async:"false",
    //         data: {
    //             "orgId": orgId,
    //             "orgAuth": 1
    //         },
    //         success: function(data, textState) {
    //             if(data.success) {
    //                 console.log(data);
    //                 unauthUser(data.data);
    //             }
    //         },
    //         error: function(XMLHttpRequest, textStats, errorThrown) {
    //             $.MsgBox.Alert('提示', '服务器请求失败')
    //         }
    //     })
    // }
    // UnauthorizedUser();
    // function unauthUser($res) {
    //     if(resourceId) {
    //         selUse();
    //     }
    //     var osting=""
    //     for(var i = 0; i < $res.length; i++) {
    //         var img;
    //         //var styC="";
    //         var oClass = autho($res[i].authType, $res[i].orgAuth, $res[i].authStatus);
    //         var oTitle="";
    //         if(!resourceId) {
    //             /*if(i<5) {
    //              styC="selectAdd";
    //              oProfessor.push($res[i].id);
    //              }*/
    //         }
    //
    //         if($res[i].title) {
    //             oTitle=$res[i].title;
    //         }else{
    //             if($res[i].office) {
    //                 oTitle=$res[i].office;
    //             }
    //         }
    //         if($res[i].hasHeadImage) {
    //             img = "/images/head/" + $res[i].id + "_l.jpg";
    //         } else {
    //             img = "../images/default-photo.jpg"
    //         }
    //         var oSt = '<li class="flexCenter" style="cursor:pointer;" id="'+$res[i].id+'">'
    //         oSt += '<div class="madiaHead useHead" id="userimg" style="background-image: url('+img+');"></div>'
    //         oSt += '<div class = "madiaInfo">'
    //         oSt += '<p class = "ellipsisSty">'
    //         oSt += '<span class = "h1Font" id="name">'+$res[i].name+'</span><em class="authicon '+oClass.sty+'" title="'+oClass.title+'"></em >'
    //         oSt += '</p>'
    //         oSt += '<p class="h2Font ellipsisSty">'+oTitle+'</p>'
    //         oSt += '</div>'
    //         oSt += '<div class="selectNull " flag=1></div>'
    //         oSt += '</li>'
    //         osting+=oSt;
    //     }
    //     $("#expertli").html(osting);
    //     if(!resourceId) {
    //         DefaultContact()
    //     }
    // }
    // /*选择用户*/
    // $("#expertli").on("click","li",function(){
    //     var userL=$("#expertli").find(".selectAdd").length;
    //     var oSel=$(this).find(".selectAdd").length;
    //     var oId=$(this).attr("id");
    //     $("#linkman").text("");
    //
    //     if(oSel == 0) {
    //         if(userL == 5) {
    //             $("#linkman").text("最多可选5位联系人");
    //             return;
    //         }
    //         $(this).find('[flag]').addClass("selectAdd");
    //         oProfessor.push(oId);
    //     } else {
    //         $(this).find('[flag]').removeClass("selectAdd");
    //         for(var i=0;i<oProfessor.length;i++) {
    //             if(oId==oProfessor[i]) {
    //                 oProfessor.splice(i, 1);
    //             }
    //         }
    //     }
    // });
    //
    // function selUse() {
    //     $.ajax({
    //         url: "/ajax/product/pro",
    //         type: "GET",
    //         timeout: 10000,
    //         dataType: "json",
    //         async:true,
    //         data: {
    //             "id": resourceId,
    //         },
    //         success: function(data, textState) {
    //             console.log(data)
    //             if(data.success) {
    //                 var arr=[];
    //                 var arr1=[];
    //                 var oLength=$("#expertli").find("li");
    //                 for(var i=0;i<data.data.length;i++) {
    //                     arr1.push(data.data[i].professor);
    //                 }
    //                 for(var i=0;i<oLength.length;i++) {
    //                     arr.push(oLength.eq(i).attr("id"));
    //                 }
    //                 for(var i=0;i<arr1.length;i++) {
    //                     oProfessor.push(arr1[i]);
    //                     oLength.eq(arr.indexOf(arr1[i])).find("[flag]").addClass("selectAdd")
    //                 }
    //             }
    //         },
    //         error: function(XMLHttpRequest, textStats, errorThrown) {
    //             $.MsgBox.Alert('提示', '服务器请求失败')
    //         }
    //     })
    // }

})