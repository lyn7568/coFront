$.use(["jQuery", "form", "util"], function($, form, util) {
	var m_rd="不可为空或空字符串",trim = "trim",
		readOnly = "readOnly",
		showOnly = "showOnly",
		modelName = 'text',
		tInt = "int",
		tBool = "bool",
		tFloat = "float",
		tString = "string",
		pw = "password",
		def = "defVal",
		placeholder = "placeholder",
		required = "required";
	form.register(function($e) {
		var cls = util.classCheck($e[0], [modelName, trim, readOnly, showOnly, tInt, tBool, tFloat, pw,required ]);
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
				ve = $("<input type='" + (cls[pw] ? pw : modelName) + "' />");
				var tmp = $e.attr(placeholder);
				if(tmp) ve.attr(placeholder, tmp);
				if(cls[readOnly]) ve.prop('readonly', "readonly");
				ve.val(dv);
				ve.appendTo($e);
			}
			return {
				name: n,
				get: function() {
					if(!cls[showOnly]) {
						var vd = cls[trim]?ve.val().trim():ve.val();
						if(vd) {
							if(cls[tInt]) {
								vd = parseInt(vd);
								if(!isNaN(vd)) { return vd };
							} else if(cls[tFloat]) {
								vd = parseFloat(vd);
								if(!isNaN(vd)) { return vd };
							} else {
								return vd;
							}
						}
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
						if(!ve.val().trim()) {
							this.invalid(m_rd)
							return m_rd;
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