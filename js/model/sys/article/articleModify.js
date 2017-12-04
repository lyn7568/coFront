$(function() {
    loginStatus();
    var articleId = GetQueryString("articleId");
    var experarray = [];
    var resourcesarray = [];
    var $data = {};
    var modifyTimeval;
    var settime = false;
    // var orgId = $.cookie("orgId");
    var colMgr = true;
    // if(orgId == "" || orgId == null || orgId == "null"){
    //     location.href = "cmp-settled-log.html";
    // }
    var hbur,hburEnd;
    var pr,prEnd;
    var re,reEnd;
    var orgr,orgrEnd;
    articleshow();
    // relevantExperts();
    // relevantResources();

    function loginStatus() {
        $.ajax({
            type: "get",
            async:false,
            url:"/ajax/sys/user",
            success:function (data) {
                if(data.success == true) {
                    var userid = data.data.id;
                    if (userid == undefined || userid.length == 0 || userid == "null") {
                        location.href = "http://www.ekexiu.com:81/html/index.html";
                    }
                }else {
                    location.href = "http://www.ekexiu.com:81/html/index.html";
                }
            }
        });
    }

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg); //��ȡurl��"?"�����ַ�����ƥ��

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
                }
                else  {
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
            /*添加*/
            $(".addButton").siblings("input").keypress(function(){
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

    //校验标题
    $("#newstitle").on({
        focus: function() {
            $(this).prev().find("span").text("50字以内");
        },
        blur: function() {
            $(this).prev().find("span").text("");
        },
        keyup: function() {
            if($(this).val().length > 50) {
                $(this).val($(this).val().substr(0, 50));
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

    //拆解关键字
    function industryShow(data,industryList){
        if(data != undefined && data.length != 0 ){
            var subs = new Array();
            if(data.indexOf(',')){
                subs = data.split(',');
            }else{
                subs[0] = data;
            }
            if(subs.length>0){
                for (var i = 0; i < subs.length; i++)
                {
                    $("#"+industryList+"").append('<li class="delkeylist"><p class="h2Font">'+ subs[i] +'</p><div class="closeThis"></div></li>');
                };
            }
            if(subs.length>4){
                $("#KeyWord").parent().addClass("displayNone");
            }
        }
    }

    //校验右侧专家和资源
    $("#checkZj").on("focus",function(){
        $(this).prev().find("span").text("最多选择5位专家");
    })
    $("#checkZy").on("focus",function(){
        $(this).prev().find("span").text("最多选择5个资源");
    })
    $("#checkZj,#checkZy").on("blur",function(){
        $(this).prev().find("span").text("");
    })

    $("#checkZj").on("keyup", function() {
        var _this = this;
        var ti=$(this).val();
        pr=ti;
        if($(this).val()=="") {
            return;
        }
        setTimeout(function(){
            if( ti===pr && ti!== prEnd) {
                checkZj(_this,ti);
            }

        },500)

    })

    $("#checkZy").on("keyup", function() {
        var ti=$(this).val();
        re=ti;
        if($(this).val()=="") {
            return;
        }
        var _this = this;
        setTimeout(function(){
            if( ti===re && ti!== reEnd) {
                checkZy(_this,ti);
            }

        },500)

    })

    $("#expertlist").on("click","li",function(){
        var _this = this;
        expertlist(_this,"该专家已选择");
    });
    $("#resouselist").on("click","li",function(){
        var _this = this;
        expertlist(_this,"该资源已选择");
    });

    //点击右侧搜索出的专家和资源列表
    function expertlist(_this,title){
        var liId = $(_this).html();
        var plength = $(_this).parents(".otherBlock").find(".addexpert li");
        for(var i=0;i<plength.length;i++){
            if(plength[i].innerHTML==liId){
                $(_this).parents(".otherBlock").find(".aboutTit span").text(title);
                $(_this).parents(".otherBlock").find(".form-drop").addClass("displayNone");
                $(_this).parents(".otherBlock").find("input").val("");
                return;
            }
        }
        if(plength.length > 3) {
            $(_this).parents(".otherBlock").find("input").hide();
            $(_this).parents(".otherBlock").find(".addexpert").append($(_this).clone());
            $(_this).parents(".otherBlock").find("input").val("");
            $(_this).parents(".otherBlock").find(".form-drop").addClass("displayNone");
        }else{
            $(_this).parents(".otherBlock").find(".addexpert").append($(_this).clone());
            $(_this).parents(".otherBlock").find("input").val("");
            $(_this).parents(".otherBlock").find(".form-drop").addClass("displayNone");
        }
    }

    //删除右侧搜索出的专家和资源
    $(".addexpert").on("click",".deleteThis",function(){
        var plength = $(this).parent().parent().find("li").length;
        if(plength < 6){
            $(this).parents(".otherBlock").find("input").show();
        }
        $(this).parent().remove();
    })

    // function checkZj(_this,prd) {
    //     prEnd=prd;
    //     $.ajax({
    //         "url": "/ajax/professor/qaByName",
    //         "type": "get",
    //         "data": {
    //             "name": $("#checkZj").val(),
    //             "total": 3
    //         },
    //         "success": function(data) {
    //             console.log(data);
    //             if(data.success) {
    //                 if(data.data != "") {
    //                     if(prEnd == prd){
    //                         $(_this).next().removeClass("displayNone");
    //                         var itemlist = '';
    //                         $("#expertlist").html("");
    //                         for(var i = 0; i < data.data.length; i++) {
    //                             var itemlist = '<li id="usid" class="flexCenter">';
    //                             itemlist += '<div class="madiaHead useHead" id="userimg"></div>';
    //                             itemlist += '<div class="madiaInfo">';
    //                             itemlist += '<p class="ellipsisSty"><span class="h1Font" id="name"></span><span class="h2Font" style="margin-left:10px;" id="title"></span></p>';
    //                             itemlist += '<p class="h2Font ellipsisSty" id="orgName"></p>';
    //                             itemlist += '</div><div class="deleteThis"></div></li>';
    //                             $itemlist = $(itemlist);
    //                             $("#expertlist").append($itemlist);
    //                             var datalist = data.data[i];
    //                             $itemlist.attr("data-id", datalist.id);
    //                             $itemlist.find("#name").text(datalist.name);
    //                             $itemlist.find("#title").text(datalist.title);
    //                             $itemlist.find("#orgName").text(datalist.orgName);
    //                             if(datalist.hasHeadImage == 1) {
    //                                 $itemlist.find("#userimg").attr("style", "background-image: url(/images/head/" + datalist.id + "_l.jpg);");
    //                             }
    //                         }
    //                     }
    //                 } else {
    //                     $(_this).next().addClass("displayNone");
    //                 }
    //             } else {
    //                 $(_this).next().addClass("displayNone");
    //             }
    //         },
    //         "error": function() {
    //             $.MsgBox.Alert('提示', '链接服务器超时')
    //         }
    //     });
    // }

    // function checkZy(_this,prd) {
    //     reEnd=prd;
    //     $.ajax({
    //         "url": "/ajax/resource/qaByName",
    //         "type": "get",
    //         "data": {
    //             "resourceName": $("#checkZy").val(),
    //             "rows": 3
    //         },
    //         "success": function(data) {
    //             console.log(data);
    //             if(data.success) {
    //                 if(data.data != "") {
    //                     if(reEnd==prd) {
    //                         $(_this).next().removeClass("displayNone");
    //                         var itemlist = '';
    //                         $("#resouselist").html("");
    //                         for(var i = 0; i < data.data.length; i++) {
    //                             var itemlist = '<li id="usid" class="flexCenter">';
    //                             itemlist += '<div class="madiaHead resouseHead" id="userimg"></div>';
    //                             itemlist += '<div class="madiaInfo">';
    //                             itemlist += '<p class="h1Font ellipsisSty" id="resourceName"></p>';
    //                             itemlist += '<p class="h2Font ellipsisSty" id="name"></p>';
    //                             itemlist += '</div><div class="deleteThis"></div></li>';
    //                             $itemlist = $(itemlist);
    //                             $("#resouselist").append($itemlist);
    //                             var datalist = data.data[i];
    //                             $itemlist.attr("data-id", datalist.resourceId);
    //                             $itemlist.find("#resourceName").text(datalist.resourceName);
    //                             if(datalist.resourceType==1){
    //                                 $itemlist.find("#name").text(datalist.professor.name);
    //                             }else{
    //                                 $itemlist.find("#name").text(datalist.organization.name);
    //                             }
    //                             if(datalist.images.length > 0) {
    //                                 $itemlist.find("#userimg").attr("style", "background-image: url(/data/resource/" + datalist.images[0].imageSrc + ");");
    //                             }
    //                         }
    //                     }
    //                 } else {
    //                     $(_this).next().addClass("displayNone");
    //                 }
    //             } else {
    //                 $(_this).next().addClass("displayNone");
    //             }
    //         },
    //         "error": function() {
    //             $.MsgBox.Alert('提示', '链接服务器超时')
    //         }
    //     });
    // }
    //初始化数据
    function articleshow(){
        $.ajax({
            "url" : "/ajax/article/id/"+articleId,
            "type" :  "GET" ,
            "dataType" : "json",
            "success" : function(data) {
                console.log(data)
                if (data.success){
                    $("#keyWordlist").html("");
                    $("#newstitle").val(data.data.articleTitle);
                    if(data.data.articleImg){
                        $("#uploader").attr("style", "background-image: url(/data/article/" + data.data.articleImg + ");");
                        $(".upFront").hide();
                        $(".upBackbtn").show();
                    }
                    ue.ready(function() {
                        if(data.data.articleContent==undefined){
                            var datadescp ="";
                        }else{
                            var datadescp = data.data.articleContent;
                        }
                        ue.setContent(datadescp);
                    });
                    industryShow(data.data.subject,"keyWordlist");
                    modifyTimeval = data.data.modifyTime;
                }
            },
            "error":function(){
                $.MsgBox.Alert('提示','链接服务器超时')
            }
        });
    }

    //相关专家
    // function relevantExperts(){
    //     $.ajax({
    //         "url": "/ajax/article/ralatePro",
    //         "type": "get",
    //         "dataType" : "json",
    //         "data" :{"articleId":articleId},
    //         "success": function(data) {
    //             if(data.success && data.data) {
    //                 for(var i = 0; i < data.data.length; i++) {
    //                     var professorId = data.data[i].professorId;
    //                     relevantExpertsList(professorId)
    //                 }
    //
    //             }
    //         },
    //         "error": function() {
    //             $.MsgBox.Alert('提示', '链接服务器超时')
    //         }
    //     });
    // }

    //相关专家信息
    // function relevantExpertsList(professorId){
    //     $.ajax({
    //         "url" : "/ajax/professor/info/"+professorId,
    //         "type" :  "GET" ,
    //         "dataType" : "json",
    //         "success" : function(data) {
    //             console.log(data);
    //             if (data.success && data.data){
    //                 var itemlist = '';
    //                 var itemlist = '<li id="usid">';
    //                 itemlist += '<div class="madiaHead useHead" id="userimg"></div>';
    //                 itemlist += '<div class="madiaInfo" style="padding-right:42px">';
    //                 itemlist += '<p class="ellipsisSty"><span class="h1Font" id="name"></span><span class="h2Font" style="margin-left:10px;" id="title"></span></p>';
    //                 itemlist += '<p class="h2Font ellipsisSty" id="orgName"></p>';
    //                 itemlist += '</div><div class="deleteThis"></div></li>';
    //                 $itemlist = $(itemlist);
    //                 $("#expertli").append($itemlist);
    //                 var datalist = data.data;
    //                 $itemlist.attr("data-id",datalist.id);
    //                 $itemlist.find("#name").text(datalist.name);
    //                 $itemlist.find("#title").text(datalist.title);
    //                 $itemlist.find("#orgName").text(datalist.orgName);
    //                 if(datalist.hasHeadImage==1) {
    //                     $itemlist.find("#userimg").attr("style", "background-image: url(/images/head/" + datalist.id + "_l.jpg);");
    //                 }
    //             }
    //         },
    //         "error":function(){
    //             $.MsgBox.Alert('提示','链接服务器超时')
    //         }
    //     });
    // }
    //
    // //相关资源
    // function relevantResources(){
    //     $.ajax({
    //         "url": "/ajax/article/ralateRes",
    //         "type": "get",
    //         "dataType" : "json",
    //         "data" :{"articleId":articleId},
    //         "success": function(data) {
    //             if(data.success && data.data) {
    //                 for(var i = 0; i < data.data.length; i++) {
    //                     var resourceId = data.data[i].resourceId;
    //                     relevantResourcesList(resourceId)
    //                 }
    //
    //             }
    //         },
    //         "error": function() {
    //             $.MsgBox.Alert('提示', '链接服务器超时')
    //         }
    //     });
    // }
    //
    // //相关资源信息
    // function relevantResourcesList(resourceId){
    //     $.ajax({
    //         "url" : "/ajax/resource/resourceInfo",
    //         "type" :  "GET" ,
    //         "dataType" : "json",
    //         "data" :{"resourceId":resourceId},
    //         "success" : function(data) {
    //             console.log(data);
    //             if (data.success && data.data){
    //                 var itemlist = '<li id="usid">';
    //                 itemlist += '<div class="madiaHead resouseHead" id="userimg"></div>';
    //                 itemlist += '<div class="madiaInfo" style="padding-right:42px">';
    //                 itemlist += '<p class="h1Font ellipsisSty" id="resourceName"></p>';
    //                 itemlist += '<p class="h2Font" id="name"></p>';
    //                 itemlist += '</div><div class="deleteThis"></div></li>';
    //                 $itemlist = $(itemlist);
    //                 $("#resources").append($itemlist);
    //                 var datalist = data.data;
    //                 $itemlist.attr("data-id", datalist.resourceId);
    //                 $itemlist.find("#resourceName").text(datalist.resourceName);
    //                 $itemlist.find("#name").text(datalist.editProfessor.name);
    //                 if(datalist.images.length > 0) {
    //                     $itemlist.find("#userimg").attr("style", "background-image: url(/data/resource/" + datalist.images[0].imageSrc + ");");
    //                 }
    //             }
    //         },
    //         "error":function(){
    //             $.MsgBox.Alert('提示','链接服务器超时')
    //         }
    //     });
    // }

    var titleflase = false;
    //交验图片和标题不能为空
    function noTitleImg(){
        //var ImageKey = $("#uploader").attr("data-id");
        var newstitle = $("#newstitle").val();
        /*if(ImageKey==""){
         $(".imgtis").text("请上传封面图片");
         }else{
         $(".imgtis").text("");
         imgflase = true;
         }*/
        if(newstitle==""){
            $.MsgBox.Alert('提示', '请输入文章标题')
            return;
        }else{
            $("#aboutTit span").text("");
            titleflase = true;
        }
    }

    //获取相关专家
    function expertli(){
        experarray=[];
        $("#expertli li").each(function(i){
            var liid = $(this).attr("data-id");
            experarray.push(liid);
        });

        return $.unique(experarray);
    }

    //获取相关专家
    function resourcesli(){
        resourcesarray=[];
        $("#resources li").each(function(i){
            var liid = $(this).attr("data-id");
            resourcesarray.push(liid);
        });
        return $.unique(resourcesarray);
    }

    var seleClum ='<div class="mb-list mb-listL"><p>请选择文章发布的栏目：</p>'+
        '<select class="form-control form-column" id="seletColum"></select></div>';
    var seleTime = '<div class="mb-list mb-listR"><p>请设置文章发布的时间：</p>'+
        '<div class="formTime"><div class="form-group">'+
        '<input size="16" type="text" value="" readonly class="form-control form_datetime">'+
        '</div></div></div>';
    //文章发布
    $("#release").on("click", function() {
        if($(this).hasClass("disableLi")){
            return;
        }
        noTitleImg();
        if(titleflase) {
            console.log(colMgr)
            if(colMgr=="true"){
                $(".blackcover2").fadeIn();
                var btnOk='<input class="mb_btn mb_btnOk mb_btnOkpub" type="button" value="确定">'
                $(".mb_btnOk").remove(); $("#promotGt").prepend(btnOk);
                $(".modelContain").show(); $("body").addClass("modelOpen");
                $(".mb-listR").remove();
                $(".mb-listL").remove();
                $("#promotTh").prepend(seleClum);
                fillColum(7);//填充select栏目
                $(".mb_btnOkpub").on("click", function() {
                    $(".blackcover2").fadeOut();
                    $(".modelContain").hide();
                    $("body").removeClass("modelOpen");
                    $.MsgBox.Confirm("提示", "确认修改该文章?", newsAdd);
                })
            }else{
                $.MsgBox.Confirm("提示", "确认修改该文章?", newsAdd);
            }

        }
    });

    //定时文章发布
    // $("#setTimeIssue").on("click", function() {
    //     if($(this).hasClass("disableLi")){
    //         return;
    //     }
    //     noTitleImg();
    //     if(titleflase) {
    //         $(".blackcover2").fadeIn();
    //         var btnOk='<input class="mb_btn mb_btnOk mb_btnOkset" type="button" value="确定">'
    //         $(".mb_btnOk").remove(); $("#promotGt").prepend(btnOk);
    //         $(".modelContain").show(); $("body").addClass("modelOpen");
    //         $(".mb-listR").remove(); $("#promotTh").append(seleTime);//时间选择器
    //         $(".mb-listR .form_datetime").datetimepicker({
    //             format: 'yyyy-mm-dd hh:ii',
    //             forceParse: true,
    //             autoclose: true,
    //         });
    //         $(".mb-listR .form_datetime").val(getNowFormatDate());
    //         if(colMgr=="true"){
    //             $(".mb-listL").remove();
    //             $("#promotTh").prepend(seleClum);
    //             fillColum(7);//填充select栏目
    //         }
    //         $(".mb_btnOkset").on("click", function() {
    //             var publishTime = $(".form_datetime").val();
    //             console.log(st6(publishTime));
    //             setTimeIssue(st6(publishTime));
    //         })
    //     }
    // })
    //
    // //文章存草稿
    // $("#draft").on("click",function(){
    //     if($(this).hasClass("disableLi")){
    //         return;
    //     }
    //     noTitleImg();
    //     if(titleflase){
    //         draftAdd(1);
    //     }
    // })
    //
    // //文章预览
    // $("#preview").on("click",function(){
    //     if($(this).hasClass("disableLi")){
    //         return;
    //     }
    //     noTitleImg();
    //     if(titleflase){
    //         draftAdd(2);
    //     }
    // })
    //
    // //删除文章
    // $("#delete").on("click",function(){
    //     $.MsgBox.Confirm("提示","确认删除该文章？",newsDelet);
    // })


    function getAttrId() {
        var arr=[];
        this.each(function(){
            arr.push( $(this).attr("data-id"));
        });
        return arr;
    }
    /*获取数据*/
    function getdata(publishTime) {
        var industrys = $("#keyWordlist li");
        var industryAll = "";
        if(industrys.size() > 0) {
            for(var i = 0; i < industrys.size(); i++) {
                industryAll += industrys[i].innerText.trim();
                industryAll += ',';
            };
            industryAll = industryAll.substring(0, industryAll.length - 1);
        }
        expertli(); //相关专家
        resourcesli(); //相关咨询
        // $data.orgId = orgId;
        $data.articleId=articleId;
        if($("#companys li").length) {
            $data.orgs = getAttrId.call($("#companys li"));
        }
        $data.articleTitle = $("#newstitle").val();
        $data.subject = industryAll;
        $data.articleImg = $("#uploader").attr("data-id");
        $data.articleContent = ue.getContent();
        // $data.professors = experarray;
        // $data.resources = resourcesarray;
        // if(colMgr=="true"){
        //     $data.colNum = $("#seletColum").val();
        //     if(publishTime!="") {
        //         $data.publishTime = publishTime;
        //     }
        // }else{
        //     if(publishTime!="") {
        //         $data.publishTime = publishTime;
        //     }
        //     $data.colNum=2;
        // }
        console.log($data);
    }


    /*文章添加*/
    function newsAdd(){
        getdata();
        $(".operateBlock").find("li").addClass("disableLi");
        $.ajax({
            "url" : "/ajax/article/save",
            "type" :  "post" ,
            "dataType" : "json",
            "data" :$data,
            "traditional": true, //传数组必须加这个
            "complete":function(){
                $(".operateBlock").find("li").removeClass("disableLi");
            },
            "success" : function(data) {
                console.log(data);
                if (data.success){
                    articleId = data.data;
                    $.MsgBox.Alert("提示","文章修改成功！",function articalList(){
                        // location.href = "cmp-articalList.html";
                    });
                    $("#mb_msgicon").css("background", 'url("/images/sign_icon_chenggong_nor.png") 0% 0% / contain');
                } else {
                    if(data.code==90) {
                        $.MsgBox.Alert('提示', '由于操作时间过久，上传图片已失效，请重新上传。');
                    }else{
                        $.MsgBox.Alert("提示", "文章修改失败！");
                    }
                }
            },
            "error":function(){
                $.MsgBox.Alert('提示','链接服务器超时')
            }
        });
    }

    /*文章定时发布*/
    // function setTimeIssue(publishTime,settime) {
    //     var opublishTime=publishTime+"01";
    //     getdata(opublishTime,settime);
    //     $(".operateBlock").find("li").addClass("disableLi");
    //     $.ajax({
    //         "url": "/ajax/article/timing",
    //         "type": "post",
    //         "dataType": "json",
    //         "data": $data,
    //         "traditional": true, //传数组必须加这个
    //         "complete":function(){
    //             $(".operateBlock").find("li").removeClass("disableLi");
    //         },
    //         "success": function(data) {
    //             console.log(data);
    //             if(data.success) {
    //                 articleId = data.data;
    //                 location.href = "cmp-articalList.html";
    //             } else {
    //                 if(data.code==90) {
    //                     $.MsgBox.Alert('提示', '由于操作时间过久，上传图片已失效，请重新上传。');
    //                 }else{
    //                     $.MsgBox.Alert("提示", "文章发表失败！");
    //                 }
    //             }
    //         },
    //         "error": function() {
    //             $.MsgBox.Alert('提示', '链接服务器超时')
    //         }
    //     });
    // }

    /*文章添加草稿和文章预览*/
    // function draftAdd(num){
    //     getdata();
    //     $(".operateBlock").find("li").addClass("disableLi");
    //     $.ajax({
    //         "url" : "/ajax/article/draft",
    //         "type" :  "post" ,
    //         "dataType" : "json",
    //         "data" :$data,
    //         "traditional": true, //传数组必须加这个
    //         "complete":function(){
    //             $(".operateBlock").find("li").removeClass("disableLi");
    //         },
    //         "success" : function(data) {
    //             console.log(data);
    //             if(num==1){
    //                 if (data.success){
    //                     articleId = data.data;
    //                     $.MsgBox.Alert("提示","文章已保存草稿。");
    //                     $("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
    //                     articleshow();
    //                 }else{
    //                     if(data.code==90) {
    //                         $.MsgBox.Alert('提示', '由于操作时间过久，上传图片已失效，请重新上传。');
    //                     }else{
    //                         $.MsgBox.Alert("提示", "文章发表失败！");
    //                     }
    //                 }
    //             }
    //             if(num==2){
    //                 if(data.success) {
    //                     $("#hidearticleId").val(data.data);
    //                     articleId = data.data;
    //                     $("#delete").removeClass("disableLi").addClass("odele");
    //                     fa = true;
    //                 }else{
    //                     if(data.code==90) {
    //                         $.MsgBox.Alert('提示', '由于操作时间过久，上传图片已失效，请重新上传。');
    //                     }else{
    //                         $.MsgBox.Alert("提示", "文章发表失败！");
    //                     }
    //                 }
    //                 if(fa) {
    //                     window.open("../articalPreview.html?articleId=" + articleId)
    //                 }
    //             }
    //         },
    //         "error":function(){
    //             $.MsgBox.Alert('提示','链接服务器超时')
    //         }
    //     });
    // }

    /*文章删除*/
    // function newsDelet() {
    //     $.ajax({
    //         "url" : "/ajax/article/deleteArticle",
    //         "type" : "POST",
    //         "dataType" : "json",
    //         "data": {
    //             "articleId": articleId
    //         },
    //         "success" : function($data) {
    //             if ($data.success) {
    //                 location.href = "cmp-articalList.html";
    //             }
    //         },
    //         "error":function(){
    //             $.MsgBox.Alert('提示','链接服务器超时')
    //         }
    //     })
    // }

    // function st6(osr) {
    //     var tim = osr.substring(0, 4) + osr.substring(5, 7) + osr.substring(8, 10) + osr.substring(11, 13) + osr.substring(14, 16);
    //     return tim;
    // }
    //
    // function timeGeshi(otm) {
    //     var otme = otm.substring(0, 4) + "-" + otm.substring(4, 6) + "-" + otm.substring(6, 8) + " " + otm.substring(8, 10)+ ":" + otm.substring(10, 12);
    //     return otme;
    // }
    // /*添加相关企业*/
    // relatCompanies("#company");
    // /*添加相关企业*/
    // function  relatCompanies(sel) {
    //
    //     $(sel).bind({
    //         paste: function(e) {
    //             var pastedText;
    //             if (window.clipboardData  &&  window.clipboardData.getData)  {  // IE
    //
    //                 pastedText  = $(this).val() +  window.clipboardData.getData('Text');
    //             }
    //             else  {
    //                 pastedText  = $(this).val() +  e.originalEvent.clipboardData.getData('Text'); //e.clipboardData.getData('text/plain');
    //
    //             }
    //             $(this).val(pastedText);
    //             e.preventDefault();
    //         },
    //         cut: function(e) {
    //             var $this = $(this);
    //         },
    //         blur: function() {
    //             var $this = $(this);
    //             setTimeout(function() {
    //                 $this.siblings(".form-drop").hide();
    //             }, 500)
    //             $(this).siblings(".aboutTit").find("span").text("");
    //         },
    //         focus: function() {
    //             $(this).siblings(".form-drop").show();
    //             $(this).siblings(".aboutTit").find("span").text("最多选择3家企业");
    //         },
    //         keyup: function(e) {
    //             var ti=$(this).val();
    //             orgr=ti;
    //             var $this=$(this);
    //             if($(this).val().trim()) {
    //                 var lNum = $.trim($(this).val()).length;
    //                 if(0 < lNum) {
    //                     setTimeout(function(){
    //                         if( ti===orgr && ti!== orgrEnd) {
    //                             var tt=ti;
    //                             orgrEnd=tt;
    //                             $("#companylist").parent().show();
    //                             $.ajax({
    //                                 "url": "/ajax/org/qr",
    //                                 "type": "GET",
    //                                 "data":{
    //                                     kw: $this.val(),
    //                                     limit:3
    //                                 },
    //                                 "success": function(data) {
    //                                     console.log(data);
    //                                     if(data.success) {
    //                                         if(orgrEnd==tt) {
    //                                             if(data.data.length == 0) {
    //                                                 $this.siblings(".form-drop").addClass("displayNone");
    //                                                 $this.siblings(".form-drop").find("ul").html("");
    //                                             } else {
    //                                                 $this.siblings(".form-drop").removeClass("displayNone");
    //                                                 var oSr = "";
    //                                                 for(var i = 0; i < data.data.length; i++) {
    //                                                     var busName=(data.data[i].forShort)?data.data[i].forShort:data.data[i].name;
    //                                                     oSr += '<li style="min-height:40px;position:static;"data-id="'+data.data[i].id+'">' + busName + '</li>';
    //                                                 }
    //                                                 $this.siblings(".form-drop").find("ul").html(oSr);
    //                                             }
    //                                         }
    //                                     } else {
    //                                         $this.siblings(".form-drop").addClass("displayNone");
    //                                         $this.siblings(".form-drop").find("ul").html("");
    //                                     }
    //                                 },
    //                                 dataType: "json",
    //                                 'error': function() {
    //                                     $.MsgBox.Alert('提示', '服务器连接超时！');
    //                                 }
    //                             });
    //                         }
    //                     },500)
    //                 }
    //             } else {
    //                 $(this).siblings(".form-drop").addClass("displayNone");
    //                 $(this).siblings(".form-drop").find("ul").html("");
    //             }
    //         }
    //     })
    //     $("#company").siblings(".form-drop").on("click", "li", function() {
    //         var oValue = $(this).text();
    //         var oJudge = $(this).parents(".form-drop").siblings(".form-result").find("ul li");
    //         for(var i = 0; i < oJudge.length; i++) {
    //             if(oValue == oJudge[i].innerText) {
    //                 $.MsgBox.Alert('提示', '该企业已选择.');
    //                 return;
    //             }
    //         }
    //         $(this).parents(".form-drop").siblings(".form-result").find("ul").append('<li class="ellipsisSty" style="min-height:40px;padding-right:42px;" data-id="'+$(this).attr("data-id")+'">' + oValue + '<div class="deleteThis"></div></li>');
    //         $(this).parents(".form-drop").siblings("input").val("");
    //         if(oJudge.length == 4) {
    //             $(this).parents(".form-drop").siblings("input").val("");
    //             $("#company").hide();
    //         }
    //         $(this).parent("ul").html("")
    //     })
    // }
    // companylist()
    // //相关企业
    // function companylist() {
    //     $.ajax({
    //         url:"/ajax/article/ralateOrg",
    //         dataType: 'json', //数据格式类型
    //         type: 'GET', //http请求类型
    //         data: {
    //             "articleId": articleId,
    //         },
    //         timeout: 10000, //超时设置
    //         success: function(data) {
    //             if(data.success) {
    //                 var $data=data.data;
    //                 if($data.length>=5) {
    //                     $("#company").hide();
    //                 }
    //                 for(var i=0;i<$data.length;i++) {
    //                     angleBus.call($data[i])
    //                 }
    //             }
    //         },
    //         error: function() {
    //             $.MsgBox.Alert('提示', '服务器请求失败')
    //         }
    //     });
    // }
    // function angleBus() {
    //     $.ajax({
    //         url: "/ajax/org/" +this.orgId,
    //         type: "GET",
    //         timeout: 10000,
    //         dataType: "json",
    //         context: $("#companys"),
    //         success: function(data) {
    //             if(data.success) {
    //                 var oValue=data.data.forShort?data.data.forShort:data.data.name;
    //                 this.append('<li class="ellipsisSty" style="min-height:40px;padding-right:42px;" data-id="'+data.data.id+'">' + oValue + '<div class="deleteThis"></div></li>')
    //
    //             }
    //         },
    //         error: function(XMLHttpRequest, textStats, errorThrown) {
    //             $.MsgBox.Alert('提示', '服务器请求失败')
    //         }
    //     })
    // }
});