;
spa_define(function(spa) {

	return {
		main: function() {
			var root = spa.mainEle.children(".sys_org_index");
			var pdg = root.pdg();
			pdg.codeRef.shell("showDay",function(data,key){
				if(data && data[key]){
					var day = data[key];
					return day.substring(0,4)+"年"+day.substring(4,6)+"月"+day.substring(6,8)+"日";
				}
				return "";
			});
			pdg.codeRef.addValueListener($.util.dictDisplay);
			root.find(".opt-query").on("click", function() {
//				console.log("dt load")
				pdg.load();
			});

			//console.log(pdg.formRef.val());
			pdg.load();
			
			root.find(".opt-new").on("click",function(){
				spa.showModal("sys_org_new",function(){pdg.load()});
			});
			root.find(".dt-tpl").on("click","th.opt-check>i.icon-st-check",function(){
				var $this = $(this);
				$this.toggleClass("checked");
				if($this.hasClass("checked")){
					root.find(".dt-tpl td.opt-check>i.icon-st-check").addClass("checked");
				}else{
					root.find(".dt-tpl td.opt-check>i.icon-st-check").removeClass("checked");
				}
			});
			root.find(".dt-tpl").on("click","td.opt-check>i.icon-st-check",function(){
				var $this = $(this);
				$this.toggleClass("checked");
			});
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