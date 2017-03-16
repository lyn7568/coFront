;
spa_define(function(spa) {

	return {
		main: function() {
			var form = spa.mainEle.find(".queryForm").form();
			var codeRef = spa.mainEle.find(".dt-tpl").code();
			var queryBtn = spa.mainEle.find(".queryForm .icon-search");
			var newBtn = spa.mainEle.find(".opt-new");
			newBtn.on("click", function() {
				spa.showModal("sys_resource_new",load);
			});
			var tableData = { data: [] },
				allData = [];
			var query = function() {
				var val = form.item("qn").val();
				if(val) {
					var td = tableData.data = [];
					for(var i = 0; i < allData.length; ++i) {
						var item = allData[i];
						if(item && item.name && item.name.indexOf(val) >= 0) {
							td.push(item);
						}
					}
				} else {
					tableData.data = allData;
				}
				codeRef.val(tableData);
			};
			var load = function() {
				$.util.get("../ajax/sys/resource/all", null, function(data) {
					allData = data || [];
					query();
				}, {});
			};

			queryBtn.on("click", query);
			load();

			//			var pdg = spa.mainEle.children(".main1").pdg();
			//			pdg.codeRef.addValueListener($.util.dictDisplay);
			//			spa.mainEle.find(".query").on("click", function() {
			////				console.log("dt load")
			//				pdg.load();
			//			});
			//			spa.mainEle.find(".reset").on("click", function() {
			////				console.log("dt reset")
			//				pdg.formRef.reset();
			//			});
			//			//console.log(pdg.formRef.val());
			//			pdg.load();
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