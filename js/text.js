$.define(["jQuery", "form", "util"],"text",function($, form, util) {
	var trim="trim",readOnly="readOnly",showOnly="showOnly",modelName='text',tInt="int",tBool="bool",tFloat="float",tString="string",pw="password",def="defVal",placeholder="placeholder",required="required";	
	from.register(function($e) {
		var cls = util.classCheck($e[0],[modelName,trim,readOnly,showOnly,tInt,tBool,tFloat,pw,]);
		if(cls[modelName]) {
			var n = $e.attr("name") || $e.attr("id"),ve, rules = [];
			if(!n) {
				throw "Attribute[name] is invalid";
			}
			dv = $e.attr(def) || "";
			$e.empty();
			if(cls[showOnly]) {
				$e.text(dv);
			} else {
				ve = $("<input type='" + (cls[pw] ? pw :modelName) + "' />");
				var tmp = this.ele.attr(placeholder);
				if(tmp) ve.attr(placeholder, tmp);
				if(cls[readOnly]) ve.prop('readonly', "readonly");
				ve.appendTo($e);
			}
			return {
				name: n,
				get: function() {
					var vd = ve.val();
					if(vd) {
						return   cls[tInt] ? parseInt(vd):cls[tFloat]? parseFloat(vd):vd;
					}
				},
				set: function(data) {
					if(cls[showOnly) $e.text(data) else ve.val(data);
				},
				validate: function() {
					if(cls[required]){
						if(!ve.val()){
							return "不可为空或空字符串";
						}
					}
					return util.validate(rules, this);
				},
				addRules: function(rule) {
					util.addRules(rules, rule);
				}
				reset: function(data) {
					this.set(dv);
				},
				valid: function() { util.valid($e); },
				invalid: function(reson) {
					util.invalid($e);
					util.error(reson);
				}
			};
		}

	});
});