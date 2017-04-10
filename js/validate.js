$.define(["jQuery", "util"], "validate", function($, util) {
	var returnTrue = function() {
			return true;
		},
		returnFalse = function() {
			return false;
		},
		vDef = function(ps, name) {
			return function(obj) {
				return "invalid validate[" + name + "] option";
			}
		},
		vRequired = function(msg) {
			return function(obj) {
				var v = obj.get();
				if((undefined === v) || ("" === v) || ($.isArray(v) && v.length === 0)) {
					return msg || "必输字段";
				}
			};
		},
		vMax = function(ps) {
			var tn = $.type(ps),
				msg = "不能大于";
			if(tn === "object") {
				msg = ps.msg || (msg + ps.val);
				ps = ps.val;
				tn = $.type(ps);
			} else {
				msg = msg + ps;
			}
			if(tn === "number") {
				return function(obj) {
					var val = obj.get();
					if(val) {
						if($.iaArray(val)) {
							if(val.length > ps) {
								return msg;
							}
						} else {
							if(val > ps) {
								return msg;
							}
						}
					} else if(0 === val) {
						if(0 > ps) {
							return msg;
						}
					}
					return true;
				};
			} else if(tn === "string") {
				var val = obj.get();
				if(val) {
					if(val > ps) {
						return msg;
					}
				}
			}

		},
		vMin = function(ps) {
			var tn = $.type(ps),
				msg = "不能小于";
			if(tn === "object") {
				msg = ps.msg || (msg + ps.val);
				ps = ps.val;
				tn = $.type(ps);
			} else {
				msg = msg + ps;
			}
			if(tn === "number") {
				return function(obj) {
					var val = obj.get();
					if(val) {
						if($.iaArray(val)) {
							if(val.length < ps) {
								return msg;
							}
						} else {
							if(val < ps) {
								return msg;
							}
						}
					} else if(0 === val) {
						if(0 > ps) {
							return msg;
						}
					}
					return true;
				};
			} else if(tn === "string") {
				var val = obj.get();
				if(val) {
					if(val < ps) {
						return msg;
					}
				}
			}
		},
		vLen = function(ps) {
			var msg = "长度不等于";
			if($.type(ps) === "object") {
				msg = ps.msg || (msg + ps.val);
				ps = ps.val;
			} else {
				msg = msg + ps;
			}
			return function(obj) {
				var val = obj.get();
				if(val || (val === "")) {
					if(val.length !== ps) {
						return msg;
					}
				}
			};
		},
		vMinLen = function(ps) {
			var msg = "长度小于";
			if($.type(ps) === "object") {
				msg = ps.msg || (msg + ps.val);
				ps = ps.val;
			} else {
				msg = msg + ps;
			}
			return function(obj) {
				var val = obj.get();
				if(val || (val === "")) {
					if(val.length < ps) {
						return msg;
					}
				}
			};
		},
		vMaxLen = function(ps) {
			var msg = "长度大于";
			if($.type(ps) === "object") {
				msg = ps.msg || (msg + ps.val);
				ps = ps.val;
			} else {
				msg = msg + ps;
			}
			return function(obj) {
				var val = obj.get();
				if(val || (val === "")) {
					if(val.length > ps) {
						return msg;
					}
				}
			};
		},
		impls = {
			"_def": vDef,
			"required": vRequired,
			"max": vMax,
			"min": vMin,
			"len": vLen,
			"minLen": vMinLen,
			"maxLen": vMaxLen
		},
		reg = function(name, hand) {
			impls[name] = hand;
		},
		parseRules = function(obj) {
			var ret = [];
			for(key in obj) {
				var impl = impls[key] || impls["_def"];
				ret.push(impl(obj[key], key));
			}
			return ret;
		},
		configForm = function(form, options) {
			for(var key in options) {
				var item = form.item(key),
					option = options[key];
				if(item && option) {
					item.addRules(parseRules(option));
				}
			}
		};

	return {
		register: reg,
		form: configForm,
	};

});