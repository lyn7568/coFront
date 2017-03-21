$.define(["jQuery", "util"], "form", function($, util) {

	var impls = [],

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
					dv = data;
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
		/* create form instance by jQuery obj */
		bf = function($e) {
			if($e.length === 1) {
				var items = {},
					rules = [];
				$e.find(".form-item").each(function() {
					var $this = $(this);
					for(var i = 0; i < impls.length; ++i) {
						var item = impls[i]($this);
						if(item && item.name) {
							items[item.name] = item;
						}
					}
				});
				return {
					item: function(name) {
						return items[name];
					},
					validate: function(vds) {
						if(vd(items)){
							return util.validate(rules,this);							
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
							ret[key] = items[key].get();
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
							util.get(url, this.val(), sh, eh, config);
						}
					},
					doPost: function(url, sh, eh, config) {
						if(this.validate()) {
							util.post(url, this.val(), sh, eh, config);
						}
					},
					doPut: function(url, sh, eh, config) {
						if(this.validate()) {
							util.put(url, this.val(), sh, eh, config);
						}
					},
					doDel: function(url, sh, eh, config) {
						if(this.validate()) {
							util.del(url, this.val(), sh, eh, config);
						}
					}
				};
			}
			return null;
		}

	return {
		build: bf,
		register: function(impl) {
			impls.push(impl)
		}
	};

});