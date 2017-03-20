!(function($) {

	$.define(["jQuery", "util"], "form", function($, util) {

		var impls = [],

			/* default impl */
			di = function(val) {
				var v = val,
					dv = null;
				return {
					val: function(data) {
						if(arguments.length) {
							v = data;
							return this;
						}
						return v;
					},
					reset: function(data) {
						if(arguments.length) {
							dv = data;
							return this;
						}
						dv = data;
						validate
						return this;
					},
					validate: function(vds) {
						if(vds) {
							// add valid obj
							return this;
						} else {
							return true;
						}
					}
				};
			},
			svd = function(items, vds) {
				for(key in vds) {
					var im = items[key],
						vd = vds[key];
					if(im && vd)
						im.validate(vd);
				}
				return this;
			},
			vd = function(items) {
				for(key in items) {
					if(!items[key].validate())
						return false;
				}
				return true;
			},
			vda = function(valids, form) {
				for(var i = 0; i < valids.length; ++i) {
					if(!valids[i](form))
						return false;
				}
				return true;
			},

			/* create form instance by jQuery obj */
			bf = function($e) {
				if($e.length === 1) {
					var items = {},
						valids = [];
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
							if(arguments.length) {
								$.isArray(data) ? valids.concat(data) : svd(items, vds);
								return this;
							} else {
								return vd(items) ? vda(valids, this) : false;
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
										ch.val(data[key]);
									}
								}
								return this;
							}
							var ret = {};
							for(key in items) {
								ret[key] = items[key].val();
							}
							return ret;
						},
						reset: function(data) {
							if(arguments.leng) {
								for(key in data) {
									var item = itmes[key];
									if(item)
										item.reset(data[key]);
								}
							} else {
								for(key in items) {
									items[key].reset();
								}
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

})(jQuery);