;
spa_define(function(spa) {

	return {
		modal: function(data) {
			var modalCtn =spa.getLastModalCtn();
			var root = modalCtn = modalCtn.children();	
			var form = root.find(".newForm").form();
			root.find(".modal-ctrl .icon-times").on("click",function(){
				spa.closeModal();
			});
			
			root.find(".opt-save").on("click",function(){
				form.doPost("../ajax/sys/resource",function(){
					spa.closeModal();
					if(data){
						data();
					}
				},{});
			});
			
		}
	};

});