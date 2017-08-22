/**
 * Created by TT on 2017/8/21.
 */
$(function() {
    // loginStatus();//判断个人是否登录
    // valUser();
    var articleId = GetQueryString("articleId");
    var experarray = [];
    var resourcesarray = [];
    var $data = {};
    var modifyTimeval;
    var settime = false;

    articleshow();
    relevantExperts();
    relevantResources();

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

    //校验关键字
    $("#KeyWord").on({
        focus: function() {
            $("#keyPrompt").text("最多可添加5个关键词，每个关键词15字以内");
        },
        blur: function() {
            $("#keyPrompt").text("");
        },
        keyup: function() {
            if($(this).val()==""){
                $(".frmadd").addClass("displayNone");
                $(".keydrop ul").html("");
                $(".keydrop").addClass("displayNone");
            }else{
                $(".frmadd").removeClass("displayNone");
            }
            if($(this).val().length > 15) {
                $(this).val($(this).val().substr(0, 15));
            }
            KeyWordList();
        }
    })

    //添加关键字
    $("#addkeyWord").on("click", function() {
        var keyWord = $("#KeyWord").val();
        keyWordlen(keyWord);
        $(".frmadd").addClass("displayNone");
        $(".keydrop ul").html("");
        $(".keydrop").addClass("displayNone");
    })

    //点击搜出的关键字添加
    $(".keydrop").on("click", "p", function() {
        var keyWord = $(this).text();
        $(".frmadd").addClass("displayNone");
        keyWordlen(keyWord)
        $(".keydrop ul").html("");
        $(".keydrop").addClass("displayNone");
    })

    //删除关键字
    $("#keyWordlist").on("click", ".closeThis", function() {
        $(this).parent().remove();
        var plength = $(".keyResult li p").length;
        if(plength < 5) {
            $("#KeyWord").removeClass("displayNone");
        }
        $(".keydrop ul").html("");
        $(".keydrop").addClass("displayNone");
    })

    //组合关键字
    function captiureSubInd(subIndu) {
        var industrys = $("#" + subIndu + "");
        var industryAll = "";
        if(industrys.size() > 0) {
            for(var i = 0; i < industrys.size(); i++) {
                industryAll += industrys[i].innerText;
                industryAll += ',';
            };
            industryAll = industryAll.substring(0, industryAll.length - 1);
        }
        return industryAll;
    }

    function keyWordlen(keyWord) {
        $("#KeyWord").val("");
        var plength = $(".keyResult li p");
        for(var i = 0; i < plength.length; i++) {
            if(plength[i].innerText == keyWord) {
                $("#keyPrompt").text("关键词已存在");
                return;
            }
        }
        if(plength.length > 3) {
            $("#KeyWord").addClass("displayNone");
            $("#keyWordlist").append("<li class='delkeylist'><p class='h2Font'>" + keyWord + "</p><div class='closeThis'></div></li>");
        } else {
            $("#keyWordlist").append("<li class='delkeylist'><p class='h2Font'>" + keyWord + "</p><div class='closeThis'></div></li>");
        }
    }

    function KeyWordList() {
        $.ajax({
            "url": "/ajax/dataDict/qaHotKey",
            "type": "get",
            "data": {
                "key": $("#KeyWord").val()
            },
            "success": function(data) {
                console.log(data);
                if(data.success && data.data != "") {
                    var itemlist = '';
                    $("#keydropList").html("");
                    for(var i = 0; i < 5; i++) {
                        var itemlist = '<li><p class="h2Font"></p></li>';
                        $itemlist = $(itemlist);
                        $("#keydropList").append($itemlist);
                        $itemlist.find(".h2Font").text(data.data[i].caption);
                    }
                    $(".keydrop").removeClass("displayNone");
                } else {
                    $(".keydrop").addClass("displayNone");
                    $(".keydrop ul").html("");
                }
            },
            "error": function() {
                $.MsgBox.Alert('提示', '链接服务器超时')
            }
        });
    }

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
                $("#KeyWord").addClass("displayNone");
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
        checkZj(_this);
    })

    $("#checkZy").on("keyup", function() {
        var _this = this;
        checkZy(_this);
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

    function checkZj(_this){
        $.ajax({
            "url": "/ajax/professor/qaByName",
            "type": "get",
            "data": {
                "name": $("#checkZj").val(),
                "total":3
            },
            "success": function(data) {
                console.log(data);
                if(data.success ) {
                    if(data.data != ""){
                        $(_this).next().removeClass("displayNone");
                        var itemlist = '';
                        $("#expertlist").html("");
                        for(var i = 0; i < data.data.length; i++) {
                            var itemlist = '<li id="usid" class="flexCenter">';
                            itemlist += '<div class="madiaHead useHead" id="userimg"></div>';
                            itemlist += '<div class="madiaInfo">';
                            itemlist += '<p class="ellipsisSty"><span class="h1Font" id="name"></span><span class="h2Font" style="margin-left:10px;" id="title"></span></p>';
                            itemlist += '<p class="h2Font ellipsisSty" id="orgName"></p>';
                            itemlist += '</div><div class="deleteThis"></div></li>';
                            $itemlist = $(itemlist);
                            $("#expertlist").append($itemlist);
                            var datalist = data.data[i];
                            $itemlist.attr("data-id",datalist.id);
                            $itemlist.find("#name").text(datalist.name);
                            $itemlist.find("#title").text(datalist.title);
                            $itemlist.find("#orgName").text(datalist.orgName);
                            if(datalist.hasHeadImage==1) {
                                $itemlist.find("#userimg").attr("style", "background-image: url(/images/head/" + datalist.id + "_l.jpg);");
                            }
                        }
                    }else{
                        $(_this).next().addClass("displayNone");
                    }
                }else{
                    $(_this).next().addClass("displayNone");
                }
            },
            "error": function() {
                $.MsgBox.Alert('提示', '链接服务器超时')
            }
        });
    }

    function checkZy(_this) {
        $.ajax({
            "url": "/ajax/resource/qaByName",
            "type": "get",
            "data": {
                "resourceName": $("#checkZy").val(),
                "rows": 3
            },
            "success": function(data) {
                console.log(data);
                if(data.success) {
                    if(data.data != "") {
                        $(_this).next().removeClass("displayNone");
                        var itemlist = '';
                        $("#resouselist").html("");
                        for(var i = 0; i < data.data.length; i++) {
                            var itemlist = '<li id="usid" class="flexCenter">';
                            itemlist += '<div class="madiaHead resouseHead" id="userimg"></div>';
                            itemlist += '<div class="madiaInfo">';
                            itemlist += '<p class="h1Font ellipsisSty" id="resourceName"></p>';
                            itemlist += '<p class="h2Font ellipsisSty" id="name"></p>';
                            itemlist += '</div><div class="deleteThis"></div></li>';
                            $itemlist = $(itemlist);
                            $("#resouselist").append($itemlist);
                            var datalist = data.data[i];
                            $itemlist.attr("data-id", datalist.resourceId);
                            $itemlist.find("#resourceName").text(datalist.resourceName);
                            if(datalist.resourceType==1){
                                $itemlist.find("#name").text(datalist.professor.name);
                            }else{
                                $itemlist.find("#name").text(datalist.organization.name);
                            }
                            if(datalist.images.length > 0) {
                                $itemlist.find("#userimg").attr("style", "background-image: url(/data/resource/" + datalist.images[0].imageSrc + ");");
                            }
                        }
                    } else {
                        $(_this).next().addClass("displayNone");
                    }
                } else {
                    $(_this).next().addClass("displayNone");
                }
            },
            "error": function() {
                $.MsgBox.Alert('提示', '链接服务器超时')
            }
        });
    }

    //初始化数据
    function articleshow(){
        $.ajax({
            "url" : "/ajax/article/query",
            "type" :  "GET" ,
            "dataType" : "json",
            "data" :{"articleId":articleId},
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
    function relevantExperts(){
        $.ajax({
            "url": "/ajax/article/ralatePro",
            "type": "get",
            "dataType" : "json",
            "data" :{"articleId":articleId},
            "success": function(data) {
                if(data.success && data.data) {
                    for(var i = 0; i < data.data.length; i++) {
                        var professorId = data.data[i].professorId;
                        relevantExpertsList(professorId)
                    }

                }
            },
            "error": function() {
                $.MsgBox.Alert('提示', '链接服务器超时')
            }
        });
    }

    //相关专家信息
    function relevantExpertsList(professorId){
        $.ajax({
            "url" : "/ajax/professor/info/"+professorId,
            "type" :  "GET" ,
            "dataType" : "json",
            "success" : function(data) {
                console.log(data);
                if (data.success && data.data){
                    var itemlist = '';
                    var itemlist = '<li id="usid">';
                    itemlist += '<div class="madiaHead useHead" id="userimg"></div>';
                    itemlist += '<div class="madiaInfo">';
                    itemlist += '<p class="ellipsisSty"><span class="h1Font" id="name"></span><span class="h2Font" style="margin-left:10px;" id="title"></span></p>';
                    itemlist += '<p class="h2Font ellipsisSty" id="orgName"></p>';
                    itemlist += '</div><div class="deleteThis"></div></li>';
                    $itemlist = $(itemlist);
                    $("#expertli").append($itemlist);
                    var datalist = data.data;
                    $itemlist.attr("data-id",datalist.id);
                    $itemlist.find("#name").text(datalist.name);
                    $itemlist.find("#title").text(datalist.title);
                    $itemlist.find("#orgName").text(datalist.orgName);
                    if(datalist.hasHeadImage==1) {
                        $itemlist.find("#userimg").attr("style", "background-image: url(/images/head/" + datalist.id + "_l.jpg);");
                    }
                }
            },
            "error":function(){
                $.MsgBox.Alert('提示','链接服务器超时')
            }
        });
    }

    //相关资源
    function relevantResources(){
        $.ajax({
            "url": "/ajax/article/ralateRes",
            "type": "get",
            "dataType" : "json",
            "data" :{"articleId":articleId},
            "success": function(data) {
                if(data.success && data.data) {
                    for(var i = 0; i < data.data.length; i++) {
                        var resourceId = data.data[i].resourceId;
                        relevantResourcesList(resourceId)
                    }

                }
            },
            "error": function() {
                $.MsgBox.Alert('提示', '链接服务器超时')
            }
        });
    }

    //相关资源信息
    function relevantResourcesList(resourceId){
        $.ajax({
            "url" : "/ajax/resource/resourceInfo",
            "type" :  "GET" ,
            "dataType" : "json",
            "data" :{"resourceId":resourceId},
            "success" : function(data) {
                console.log(data);
                if (data.success && data.data){
                    var itemlist = '<li id="usid">';
                    itemlist += '<div class="madiaHead resouseHead" id="userimg"></div>';
                    itemlist += '<div class="madiaInfo">';
                    itemlist += '<p class="h2Font ellipsisSty" id="resourceName"></p>';
                    itemlist += '<p class="h1Font" id="name"></p>';
                    itemlist += '</div><div class="deleteThis"></div></li>';
                    $itemlist = $(itemlist);
                    $("#resources").append($itemlist);
                    var datalist = data.data;
                    $itemlist.attr("data-id", datalist.resourceId);
                    $itemlist.find("#resourceName").text(datalist.resourceName);
                    $itemlist.find("#name").text(datalist.editProfessor.name);
                    if(datalist.images.length > 0) {
                        $itemlist.find("#userimg").attr("style", "background-image: url(/data/resource/" + datalist.images[0].imageSrc + ");");
                    }
                }
            },
            "error":function(){
                $.MsgBox.Alert('提示','链接服务器超时')
            }
        });
    }

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


    //文章发布
    $("#release").on("click",function(){
        noTitleImg();
        if(titleflase){
            $.MsgBox.Confirm("提示","确认发布该文章?",newsAdd);
        }
    })

    //文章存草稿
    $("#draft").on("click",function(){
        noTitleImg();
        if(titleflase){
            draftAdd(1);
        }
    })

    //文章预览
    $("#preview").on("click",function(){
        noTitleImg();
        if(titleflase){
            draftAdd(2);
        }
    })

    //删除文章
    $("#delete").on("click",function(){
        $.MsgBox.Confirm("提示","确认删除该文章？",newsDelet);
    })

    //定时文章发布
    $("#setTimeIssue").on("click", function() {
        //$(".form_datetime").val(timeGeshi(modifyTimeval));
        noTitleImg();
        if(titleflase) {
            $(".blackcover2").fadeIn();
            $(".modelContain").show();
            $("body").addClass("modelOpen");
            $(".mb_btnOk").on("click", function() {
                var modifyTimeval = $(".form_datetime").val();
                settime = true;
                setTimeIssue(st6(modifyTimeval),settime);
            })
        }
    })

    /*获取数据*/
    function getdata(publishTime,settime) {
        expertli();//相关专家
        resourcesli();//相关咨询
        $data.articleId = articleId;
        $data.professorId = userid;
        $data.articleTitle = $("#newstitle").val();
        $data.subject = captiureSubInd("keyWordlist .delkeylist");
        $data.articleImg = $("#uploader").attr("data-id");
        $data.articleContent = ue.getContent();
        $data.professors = experarray;
        $data.resources = resourcesarray;
        if(settime) {
            $data.publishTime = publishTime;
        }
        console.log($data);
    }


    /*文章添加*/
    function newsAdd(){
        getdata();
        $.ajax({
            "url" : "/ajax/article/save",
            "type" :  "post" ,
            "dataType" : "json",
            "data" :$data,
            "traditional": true, //传数组必须加这个
            "success" : function(data) {
                console.log(data);
                if (data.success){
                    articleId = data.data;
                    $.MsgBox.Alert("提示","文章发表成功！",function articalList(){
                        location.href = "articalList.html";
                    });
                    $("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
                } else {
                    if(data.code==90) {
                        $.MsgBox.Alert('提示', '由于操作时间过久，上传图片已失效，请重新上传。');
                    }else{
                        $.MsgBox.Alert("提示", "文章发表失败！");
                    }
                }
            },
            "error":function(){
                $.MsgBox.Alert('提示','链接服务器超时')
            }
        });
    }

    /*文章定时发布*/
    function setTimeIssue(publishTime,settime) {
        var opublishTime=publishTime+"01";
        getdata(opublishTime,settime);
        $.ajax({
            "url": "/ajax/article/timing",
            "type": "post",
            "dataType": "json",
            "data": $data,
            "traditional": true, //传数组必须加这个
            "success": function(data) {
                console.log(data);
                if(data.success) {
                    articleId = data.data;
                    location.href = "articalList.html";
                } else {
                    if(data.code==90) {
                        $.MsgBox.Alert('提示', '由于操作时间过久，上传图片已失效，请重新上传。');
                    }else{
                        $.MsgBox.Alert("提示", "文章发表失败！");
                    }
                }
            },
            "error": function() {
                $.MsgBox.Alert('提示', '链接服务器超时')
            }
        });
    }

    /*文章添加草稿和文章预览*/
    function draftAdd(num){
        getdata();
        $.ajax({
            "url" : "/ajax/article/draft",
            "type" :  "post" ,
            "dataType" : "json",
            "data" :$data,
            "traditional": true, //传数组必须加这个
            "success" : function(data) {
                console.log(data);
                if(num==1){
                    if (data.success){
                        articleId = data.data;
                        $.MsgBox.Alert("提示","文章已保存草稿。");
                        $("#mb_msgicon").css("background", 'url("images/sign_icon_chenggong_nor.png") 0% 0% / contain');
                        articleshow();
                    }else{
                        if(data.code==90) {
                            $.MsgBox.Alert('提示', '由于操作时间过久，上传图片已失效，请重新上传。');
                        }else{
                            $.MsgBox.Alert("提示", "文章发表失败！");
                        }
                    }
                }
                if(num==2){
                    if(data.success) {
                        $("#hidearticleId").val(data.data);
                        articleId = data.data;
                        $("#delete").removeClass("disableLi").addClass("odele");
                        fa = true;
                    }else{
                        if(data.code==90) {
                            $.MsgBox.Alert('提示', '由于操作时间过久，上传图片已失效，请重新上传。');
                        }else{
                            $.MsgBox.Alert("提示", "文章发表失败！");
                        }
                    }
                    if(fa) {
                        window.open("articalPreview.html?articleId=" + articleId)
                    }
                }
            },
            "error":function(){
                $.MsgBox.Alert('提示','链接服务器超时')
            }
        });
    }

    /*文章删除*/
    function newsDelet() {
        $.ajax({
            "url" : "/ajax/article/deleteArticle",
            "type" : "POST",
            "dataType" : "json",
            "data": {
                "articleId": articleId
            },
            "success" : function($data) {
                if ($data.success) {
                    location.href = "articalList.html";
                }
            },
            "error":function(){
                $.MsgBox.Alert('提示','链接服务器超时')
            }
        })
    }

    function st6(osr) {
        var tim = osr.substring(0, 4) + osr.substring(5, 7) + osr.substring(8, 10) + osr.substring(11, 13) + osr.substring(14, 16);
        return tim;
    }

    function timeGeshi(otm) {
        var otme = otm.substring(0, 4) + "-" + otm.substring(4, 6).replace(/\b(0+)/gi, "") + "-" + otm.substring(6, 8).replace(/\b(0+)/gi, "") + " " + otm.substring(8, 10)+ ":" + otm.substring(10, 12);
        return otme;
    }

});
