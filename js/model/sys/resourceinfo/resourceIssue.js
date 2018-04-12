$(document).ready(function() {
    loginStatus();
	var resourceId=GetQueryString("resourceId");
	if(resourceId) {
		$("#deleteResource").removeClass("disableLi").addClass("deleteResource");
		getRecourceMe();
	}
	// loginStatus(); //判断个人是否登录
	// valUser();
	// var userid = $.cookie("userid");
	var temp = [];
	var array=[];
	var hbur,hburEnd;
	ue = UE.getEditor('editor', {});

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


    /*获取资源信息*/
	function getRecourceMe() {
			$.ajax({
					"url": "/ajax/resource/queryOne",
					"type": "GET",
					"success": function(data) {
						// console.log(data);
						if(data.success) {
							$("#uploadDd").siblings().remove();
							$("#fileList").append("<dd></dd><dd></dd>");
							temp=[];
							array=[];
							resourceHtml(data.data);
						}
					},
					"data": {
						"resourceId":resourceId
					},
					dataType: "json",
					'error':function() {
						$.MsgBox.Alert('提示', '服务器连接超时！');
					}
				});
	}
	/*处理资源html代码*/
	function resourceHtml($da) {
		$("#resourceName").val($da.resourceName);//名字
		$("#application").val($da.supportedServices);//应用用途
		if($da.orgName) {//所属机构
			$("#organizationName").val($da.orgName);
		}
		if($da.comp) {//所属机构
			$("#organizationName").val($da.comp);
		}
		if($da.spec) {//厂商型号
			$("#modelNumber").val($da.spec);
		}
		if($da.parameter) {//性能参数
			$("#performancePa").val($da.parameter);
		}
		if($da.cooperationNotes) {//合作备注
			$("#remarkContent").val($da.cooperationNotes);
		}
		if($da.subject) {
			var oSub=$da.subject.split(",");
			var oSt="";
			for(var i=0;i<oSub.length;i++){
				oSt+='<li><p class="h2Font">'+oSub[i]+'</p><div class="closeThis"></div></li>'
			}
			$("#keywordList").html(oSt);
		}else{
			$("#keywordList").html("");
		}
		if($da.descp) {//编辑器
			 ue.ready(function() {
				    	ue.setContent($da.descp);
				    });
			 
		}
		if($da.images.length) {
			var arr=[];
			for(var i=0;i<$da.images.length;i++) {
				var oString='<dd>' +
					'<div class="imgItem">'+
						'<img src="'+"http://www.ekexiu.com/data/resource/"+$da.images[i].imageSrc+'"/>' +
					'</div>'+
					'<div class="file-panel">' +
						'<span class="cancel" flag=1></span>' +
					'</div>' +
				'</dd>'
				arr[i]=oString;
				array[i]=$da.images[i].imageId;
			}
		$("#fileList dd").eq(2).remove();
			if($da.images.length==1) {
				$("#fileList").prepend(arr[0]);
			}else if($da.images.length==2) {
				$("#fileList dd").eq(1).remove();
				$("#fileList").prepend(arr[1]);
				$("#fileList").prepend(arr[0]);
			}else if($da.images.length==3) {
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
		server: '/ajax/cachedFileUpload',
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
					'<div class="imgItem" id="' + file.id + '">'+
						'<img />' +
					'</div>'+
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

		// 创建缩略图
		// 如果为非图片文件，可以不用调用此方法。
		// thumbnailWidth x thumbnailHeight 为 100 x 100
		uploader.makeThumb(file, function(error, src) {
			if(error) {
				$img.replaceWith('<span>不能预览</span>');
				return;
			}
			$img.attr('src', src);
		}, 1, 1);
		/*$li.on('mouseenter', function() {
			$btns.stop().animate({
				height: 30
			});
		});

		$li.on('mouseleave', function() {
			$btns.stop().animate({
				height: 0
			});
		});*/

	});
	uploader.onError = function(code) {
		// console.log(code)
		$.MsgBox.Alert('提示', '请上传jpg、jpeg、png格式的图片，大小不超过2M')
	};
	uploader.on('uploadSuccess', function(file, data) {
		if(data.success) {
				uploader.removeFile(fileId);
				var cacheImageKey = temp.push(data.data[0].cacheKey);
		}else{
			$.MsgBox.Alert('提示', '只支持jpeg/jpg/png格式的图片');
		}
	});
	/*删除图片*/
	$("#fileList").on("click", ".cancel", function() {
		var flag=$(this).attr("flag");
		var oNum=$(this).parents("dd").index();
		if(flag==1) {
			array.splice(oNum,1);
		}else{
			temp.splice(oNum,1);
		}
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
	/*关键词*/
	$("#keywordName").bind({
		focus: function() {
			$("#keywordPrompt").show().text('最多可添加5个关键词，每个关键词15字以内');
		},
		blur: function() {
			$("#keywordPrompt").text('');
		},
		keyup: function() {
			var ti=$(this).val();
			hbur=ti;
			var lNum=$.trim($(this).val()).length;
			// console.log(lNum);
			if(lNum > 15) {
				$(this).val($(this).val().substr(0, 15));
			} else if(0 < lNum&& lNum < 15) {
					$("#addKeyword").show();
					setTimeout(function(){
						if( ti===hbur && ti!== hburEnd) {
							var tt=ti;
							hburEnd=tt;
						$.ajax({
						"url": "/ajax/article/qaHotKey",
						"type": "GET",
						"success": function(data) {
							// console.log(data);
							if(data.success) {
								if(hburEnd == tt){
									if(data.data.length==0) {
										$("#keyList").addClass("displayNone");
										$("#keyList ul").html("");
									}else{
										$("#keyList").removeClass("displayNone");
										var oSr="";
										for(var i=0;i<Math.min(data.data.length,5);i++) {
											oSr+='<li><p class="h2Font">'+data.data[i].caption+'</p></li>'
										}
										$("#keyList ul").html(oSr);
									}
								}	
							}else {
								$("#keyList ul").html("");
							}
						},
						"data": {
							"key":$('#keywordName').val()
						},
						dataType: "json",
						'error':function() {
							$.MsgBox.Alert('提示', '服务器连接超时！');
						}
				});
				}
				},500)
			}else if(lNum == 0){
				 $("#addKeyword").hide();
				 $("#keyList ul").html("");
			}
		}
	});
	$("#keyList ul").on("click","li",function(){
		 keyWord($(this).find("p").text());
		 $("#keyList ul").html("");
		 $("#keyList").addClass("displayNone");
		 $("#addKeyword").hide();
	})
	/*添加关键词*/
	$("#addKeyword").click(function() {
		 keyWord($("#keywordName").val());
	})
	function keyWord(atl) {
		var oKeywordName =  $.trim(atl);
		var keywordListLength = $("#keywordList").find("li");
		if(oKeywordName.length == 0) {
			$("#keywordPrompt").text('关键词输入不能为空');
			return;
		}
		for(var i = 0; i < keywordListLength.length; i++) {
			if(oKeywordName == keywordListLength.find("p").eq(i).text()) {
				$("#keywordPrompt").text('该关键词已存在');
				return;
			}
		}
		 $("#keyList ul").html("");
		  $("#addKeyword").hide();
		var oStr = '<li><p class="h2Font">' + oKeywordName + '</p><div class="closeThis"></div></li>'
		$("#keywordList").append(oStr);
		$("#keywordName").val("");
		if((keywordListLength.length + 1) == 5) {
			$("#keywordHide").hide();
			$("#keyList").css("border-top","none");
		}
	}
	/*删除关键词*/
	$("#keywordList").on("click", ".closeThis", function() {
		$(this).parent().remove();
		var keywordListLength = $("#keywordList").find("li");
		if(keywordListLength.length < 5) {
			$("#keywordHide").show();
			$("#keyList").css("border-top","1px solid #E5E5E5");		
		}
	});
	/*应用用途*/
	$("#application").bind({
		focus: function() {
			$("#applicationPrompt").show();
		},
		blur: function() {
			$("#applicationPrompt").hide();
		},
		keyup: function() {
			if($(this).val().length > 250) {
				$(this).val($(this).val().substr(0, 250));
			}
		}

	})
	/*所属机构*/
	$("#organizationName").bind({
		focus: function() {
			$("#organization").show();
			$("#department").show();
		},
		blur: function() {
			$("#organization").hide();
			setTimeout(function(){
				$("#department").hide();
			},100)
		},
		keyup: function() {
			if($(this).val().length > 50) {
				$(this).val($(this).val().substr(0, 50));
			} else if(0 < $(this).val().length < 50) {
					$.ajax({
					"url": "/ajax/sys/org/querylimit",
					"type": "GET",
					"success": function(data) {
						// console.log(data);
						if(data.success) {
							if(data.data==null) {
								$("#department ul").html("");
							}else{
								addHtml(data.data);
							}
						}
					},
					"data": {
						name:$(this).val(),
						rows: 3
					},
					dataType: "json",
					'error':function() {
						$.MsgBox.Alert('提示', '服务器连接超时！');
					}
			});
			}
		}
	})
	
	function addHtml($html) {
		var i=0;
		var oSum="";
		for( i in $html) {
			var oImg="";
			// console.log($html[i].hasOrgLogo)
			if($html[i].hasOrgLogo) {
				oImg="http://www.ekexiu.com/images/org/" + $html[i].id + ".jpg"
			}else{
				oImg="http://www.ekexiu.com/images/default-icon.jpg"
			}
			oSum+='<li class="orgList"><img src="'+oImg+'" class="floatL" /><p class="h2Font floatL">'+$html[i].name+'</p></li>'
		}
		$("#department ul").html(oSum);
	}
	$("#department ul").on("click","li",function(){
		$("#organizationName").val($(this).find("p").text());
		$("#department ul").html("");
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

	/*性能参数*/
	limitObj("#performancePa",1000)
	/*合作备注*/
	limitObj("#remarkContent",1000)
	/*发布*/
	$(".goFabu").click(function(){
		if($(this).hasClass("disableLi")){
			return;
		}
		var  oYes=term();
		if(oYes==0) {
			return;
		}
		$.MsgBox.Confirm("提示", "确认发布该资源？",ajsPost);
	})
	/*预览*/
	$("#oPreview").click(function(){
		if($(this).hasClass("disableLi")){
			return;
		}
		var  oYes=term();
		if(oYes==0) {
			return;
		}
		ajsPost("/ajax/resource/draft",1);
	})
	/*存草稿*/
	$("#oDraft").click(function(){
		if($(this).hasClass("disableLi")){
			return;
		}
		var  oYes=term();
		if(oYes==0) {
			return;
		}
		ajsPost("/ajax/resource/draft",2);
	})
	/*删除*/
	$("#operateBlocko").on("click",".deleteResource",function(){
		$.MsgBox.Confirm("提示", "确认删除该资源？",deleResource);
	})
	/*删除函数*/
	function deleResource() {
			$.ajax({
					"url": "/ajax/resource/delete",
					"type": "POST",
					"success": function(data) {
						// console.log(data)
						if(data.success) {							
								location.href="resourceList.html"						
						}
					},
					"data": {"resourceId":resourceId},
					"beforeSend": function() { /*console.log(this.data)*/ },
					"contentType": "application/x-www-form-urlencoded",
					dataType: "json"
				});
	}
	/*条件是否匹配*/
	function term(){
		var $len = $("#fileList").find("img").length;
		var reName=$("#resourceName").val();
		var oIndustry=$("#application").val();
		if($len==0) {
			$.MsgBox.Alert('提示', '请上传资源图片。');
			return 0;
		}
		if(reName=="") {
			$.MsgBox.Alert('提示', '请输入资源名称。');
			return 0;
		}
		if(oIndustry=="") {
			$.MsgBox.Alert('提示', '请输入应用用途。');
			return 0;
		}
	}
	/*发布函数*/
	function ajsPost(pa1,pa2) {
		$(".operateBlock").find("li").addClass("disableLi");
		var oUrl="/ajax/resource/save";
		if(pa1) {
			oUrl=pa1
		}
		var $data = {};
			if(resourceId) {
				$data.resourceId=resourceId;
			}
			// $data.professorId=userid;
			$data.resourceName = $("#resourceName").val();//资源名字
			$data.cooperationNotes = $("#remarkContent").val();//合作备注
			$data.subject = captiureSubInd("keywordList p");
			// console.log($data.subject);
			$data.supportedServices=$("#application").val();
			$data.orgName=$("#organizationName").val();
			$data.spec=$("#modelNumber").val();
			$data.parameter=$("#performancePa").val();
			$data.descp=ue.getContent();
			$data.fns=temp;
			$data.imageIds=array;
			//$data.imageIds:资源图片ID NULL 字符串数组
			// console.log(temp);
			$.ajax({
					"url": oUrl,
					"type": "POST",
					"complete":function(){
						$(".operateBlock").find("li").removeClass("disableLi");
					},
					"success": function(data) {
						// console.log(data)
						if(data.success) {
							if(pa2==1) {
								resourceId=data.data;
								$("#deleteResource").removeClass("disableLi").addClass("deleteResource");
								window.open("resourcePreview.html?resourceId="+data.data);
								getRecourceMe();
								//弹出预览
							}else if(pa2==2) {
							$("#deleteResource").removeClass("disableLi").addClass("deleteResource");
							resourceId=data.data;
							$.MsgBox.Alert('提示', '资源已保存草稿。');
							$("#mb_msgicon").css("background", 'url("/images/sign_icon_chenggong_nor.png") 0% 0% / contain');
							getRecourceMe();
							}else{
								$.MsgBox.Alert('提示', '资源发布成功！');
								$("#mb_msgicon").css("background", 'url("/images/sign_icon_chenggong_nor.png") 0% 0% / contain');
								// location.href="resourceList.html"
							}
							
						}else{
							if(data.code==90) {
								$.MsgBox.Alert('提示', '由于操作时间过久，上传图片已失效，请重新上传。');
							}
						}
					},
					"data": $data,
					"beforeSend": function() { /*console.log(this.data)*/ },
					"contentType": "application/x-www-form-urlencoded",
					"traditional":true,
					dataType: "json"
			});
	}
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
})