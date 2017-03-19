(function($,form){	
	from.register(function($e){
		var n=$e.attr("name")||$e.attr("name"), $,dv,t="string";
		if($e.hasClass("int")) t="int";
		if($e.hasClass("float")) t="float";		
		return {
			name:n,
			val:function(data){},
			validate:function(h){
				
			},
			reset:function(data){
				if(arguments.leng){
					dv=data;
				}else{
					this.val(dv);
				}
			},
			type:function(){
				return t;
			}
			
		};
	});	
})(jQuery,form);