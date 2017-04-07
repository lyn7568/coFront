$.define(["jQuery", "util"], "form", function($, util) {

	var impls = [],
		data_key = "jfw_base_form",

		/* default impl */
		di = function(val) {
			var v = val,
				rules = [],
				dv = null;
			return {
				get: function() {
					return v;
				},
				set: function(vd) {
					v = vd;
				},
				reset: function() {
					v = dv;
				},
				validate: function() {
					return util.validate(rules, this);
				},
				addRules: function(rule) {
					util.addRules(rules, rule);
				},
				valid: function() {},
				invalid: function(reson) {}
			};
		},
		vd = function(items) {
			for(key in items) {
				if(!items[key].validate())
					return false;
			}
			return true;
		},
		serialize=util.serialize,
		/* create form instance by jQuery obj */
		bf = function($e,itemOptions) {
			if($e.length === 1) {
				var items = {},
					rules = [];
				$e.find(".form-item").each(function() {
					var $this = $(this);
					for(var i = 0; i < impls.length; ++i) {
						var item = impls[i]($this,itemOptions);
						if(item && item.name) {
							items[item.name] = item;
						}
					}
				});
				return {
					item: function(name) {
						return items[name];
					},
					validate: function() {
						if(vd(items)) {
							return util.validate(rules, this);
						}
						return false;
					},
					addRules: function(rule) {
						var te = $.type(rule);
						if("function" === te) {
							rules.push(rule);
						} else if("array" === te) {
							rules.concat(rule);
						} else if("object" === te) {
							for(key in rule) {
								var im = items[key];
								if(im) im.addRules(rule[key]);
							}
						}
					},
					val: function(data) {
						if(arguments.length) {
							if(data) {
								for(key in data) {
									var ch = items[key];
									if(!ch) {
										ch = items[key] = di();
									}
									ch.set(data[key]);
								}
							}
							return this;
						}
						var ret = {};
						for(key in items) {
							var tmp = items[key].get();
							if(undefined !== tmp) {
								ret[key] = tmp;
							}
						}
						return ret;
					},
					reset: function() {
						for(key in items) {
							items[key].reset();
						}
					},
					get: function(url, data, eh, config) {
						util.get(url, data, function(rd) {
							if(config && config.check) {
								rd = config.ckeck(rd);
								if(rd) {
									this.reset();
									this.val(rd);
								}
							}
						}, eh, config);
					},
					post: function(url, data, eh, config) {
						util.post(url, data, function(rd) {
							if(config && config.check) {
								rd = config.ckeck(rd);
								if(rd) {
									this.reset();
									this.val(rd);
								}
							}
						}, eh, config);
					},
					doGet: function(url, sh, eh, config) {
						if(this.validate()) {
							util.get(url, serialize(this.val()), sh, eh, config);
						}
					},
					doPost: function(url, sh, eh, config) {
						if(this.validate()) {
							util.post(url, serialize(this.val()), sh, eh, config);
						}
					},
					doPut: function(url, sh, eh, config) {
						if(this.validate()) {
							util.put(url, this.val(), sh, eh, config);
						}
					}
				};
			}
			return null;
		};

	$.fn.form = function(val) {
		if(this.length && this.length ===1) {
			return bf(this);
		}
	};
	return {
		build: bf,
		register: function(impl) {
			impls.push(impl)
		}
	};
});