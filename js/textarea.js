$.use(["jQuery", "form", "util"], function($, form, util) {
	var trim = "trim",
		readOnly = "readOnly",
		showOnly = "showOnly",
		modelName = 'textarea',
		def = "defVal",
		placeholder = "placeholder",
		required = "required";
	form.register(function($e) {
		var cls = util.classCheck($e[0], [modelName, trim, readOnly, showOnly]);
		if(cls[modelName]) {
			var n = $e.attr("name") || $e.attr("id"),
				ve, rules = [];
			if(!n) {
				throw "Attribute[name] is invalid";
			}
			dv = $e.attr(def) || "";
			$e.empty();
			if(cls[showOnly]) {
				$e.text(dv);
			} else {
				ve = $("<textarea></textarea>");
				ve.attr("rows", $e.attr("rows") || "3");
				ve.attr("cols", $e.attr("cols") || "20");
				var tmp = $e.attr(placeholder);
				if(tmp) ve.attr(placeholder, tmp);
				if(cls[readOnly]) ve.prop("readonly", "readonly");
				ve.val(dv);
				ve.appendTo($e);
			}
			return {
				name: n,
				get: function() {
					if(!cls[showOnly]) {
						var vd = ve.val();
						return vd?(cls[trim]?vd.trim():vd):undefined;
					}
				},
				set: function(data) {
					if(cls[showOnly]) {
						$e.text(data)
					} else {
						ve.val(data);
					}
				},
				validate: function() {
					if(cls[required]) {
						var v=cls[trim]?ve.val().trim():ve.val();
						if(!v) {
							return "不可为空或空字符串";
						}
					}
					return util.validate(rules, this);
				},
				addRules: function(rule) {
					util.addRules(rules, rule);
				},
				reset: function() {
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