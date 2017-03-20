;
spa_define(function(spa) {

	return {
		main: function() {
			var root = spa.mainEle.children(".sys_dict_index");
			var pdg = root.pdg();

			var bindDataEvent = function() {
				root.find(".table-opt i.icon-edit").on("click", function() {
					var $this = $(this);
					var code = $this.parent().attr("dictCode");
					if(code) {
						$.util.get("../ajax/sys/dict/info/" + code, null, function(data) {
							if(data.readonly) {
								$.util.alertMsg("只读的");
							} else {
								spa.showModal("sys_dict_edit", {
									data: data,
									hand: function() {
										pdg.load();
									}
								});
							}
						}, {});
					}

				});
			};

			pdg.codeRef.addValueListener($.util.dictDisplay);
			pdg.codeRef.addValueListener(bindDataEvent);
			root.find(".opt-query").on("click", function() {
				//				console.log("dt load")
				pdg.load();
			});

			//console.log(pdg.formRef.val());
			pdg.load();

			root.find(".opt-new").on("click", function() {
				spa.showModal("sys_dict_add", function() { pdg.load() });
			});

			root.find(".table-opt i.icon-edit").on("click", function() {
				var $this = $(this);
				var code = $this.parent().attr("dictCode");
				if(code) {
					$.util.get("../ajax/sys/dict/info/" + code, null, function(data) {
						if(data.readonly) {
							$.util.alert("只读的");
						} else {
							spa.showModal("sys_dict_edit", {
								data: data,
								hand: function() {
									pdg.load();
								}
							});
						}
					}, {});
				}

			});

			//			root.find(".dt-tpl").on("click", "th.opt-check>i.icon-st-check", function() {
			//				var $this = $(this);
			//				$this.toggleClass("checked");
			//				if($this.hasClass("checked")) {
			//					root.find(".dt-tpl td.opt-check>i.icon-st-check").addClass("checked");
			//				} else {
			//					root.find(".dt-tpl td.opt-check>i.icon-st-check").removeClass("checked");
			//				}
			//			});
			//			root.find(".dt-tpl").on("click", "td.opt-check>i.icon-st-check", function() {
			//				var $this = $(this);
			//				$this.toggleClass("checked");
			//			});
			//			root.find(".opt-edit").on("click", function() {
			//				var $org = root.find("td.opt-check>i.checked");
			//				if($org.length) {
			//					if($org.length > 1) {
			//						$.util.alertMsg("只能选择一个机构");
			//					} else {
			//						$.util.get("../ajax/sys/org/id/"+$org.attr("orgId"),null,function(rd){
			//							if(rd){
			//								spa.showModal("sys_org_edit", { data:rd, hand: function() { pdg.load() } })								
			//							}else{
			//								$.util.alertMsg("机构已不存在", function(){pdg.load();});
			//							}
			//						},{});
			//					}
			//				} else {
			//					$.util.alertMsg("请选择一个机构");
			//				}
			//			});
			//			root.find(".opt-del").on("click", function() {
			//				var $org = root.find("td.opt-check>i.checked");
			//				if($org.length) {
			//					var ret =[];
			//					$org.each(function(){
			//						ret.push($(this).attr("orgId"));						
			//					});
			//					$.util.boxMsg({
			//						title: "确认删除",
			//						content: "您是否要删除选中的机构信息,机构信息删除后不可恢复！！！！！！！！！！！！！！！！！！",
			//						btns: [{ caption: "删除", hand: function() {
			//							$.util.post("../ajax/sys/org/del",{ids:ret},function(){pdg.load()},{});							
			//						} },
			//							{ caption: "取消" }
			//						]
			//					});
			//				} else {
			//					$.util.alertMsg("请选择一个机构");
			//				}
			//			});
		},
		modal: function(data) {
			//console.log(spa.getLastModalCtn())
			//spa.getLastModalCtn().html(" in modal:"+(new Date()).toString());	
			//			var modalCtn =spa.getLastModalCtn();
			//			var root = modalCtn = modalCtn.children();	
			//			root.css("width","80%");
			//			root.find(".upload-btn").upload({
			//				uri:"/ajax/upload",
			//				maxSize:1048576,
			//				accept:"image/*",
			//				start:function(){console.log("start:"+JSON.stringify(this))},
			//				done:function(data){console.log("done:"+JSON.stringify({ref:this,data:data}))},
			//				fail:function(type,param){console.log("fail:"+JSON.stringify({ref:this,type:type,param:param}))},
			//				notity:function(total,loaded){console.log("notity:"+JSON.stringify({ref:this,total:total,loaded:loaded}))},
			//			});
			//			root.find(".icon-times").on("click",function(){
			//				spa.closeModal();
			//			});
			//			var pdg =root.pdg();
			//			pdg.codeRef.addValueListener($.util.dictDisplay);
			//			root.find(".query").on("click", function() {
			//				console.log("dt load")
			//				pdg.load();
			//			});
			//			root.find(".reset").on("click", function() {
			//				console.log("dt reset")
			//				pdg.formRef.reset();
			//			});
			//			console.log(pdg.formRef.val());
			//			pdg.load();

		},
		mainDestory: function() {

		},
		modalDestory: function() {

		}
	};

});