$.use(["jQuery", "form", "doc", "util", "dropdown", "code"], function($, form, doc, util, dd, code) {
	var m_rd = "必选的",
		modelName = 'typeahead',
		placeholder = "placeholder",
		required = "required",
		typeahead = function() {
			this.ve = null;
			this.minLength = 1;
			this.maxShowCount = 10;
			this.keyPressInterval = 500;
			this.caption = "";
			this.autoselect = true;
			this.ajaxCfg={mask:false};
		};
	typeahead.prototype = defCfg = {};

	defCfg.source = function(query, hand) {
	//	console.log("source:" + query)
		var self = this;
		this.lastQuerying = query;
		setTimeout(function() {
			if((query === self.lastQuerying) && (query !== self.lastQueryed)) {
				self.doQuery(query, hand);
			}
		}, this.keyPressInterval || 500);
	};
	defCfg.doQuery = function(query, hand) {
		var self = this;
		this.lastQueryed = query;
	//	console.log("doQuery:" + query);
		util.get(this.quri + encodeURIComponent(query), null, function(data) {
			if(self.lastQueryed === query) {
				if(self.transfer) {
					data = self.transfer(data);
				}
//				console.log("doHand:" + query);
				hand(data);
			}
		}, this.ajaxEH, this.ajaxCfg);
	};
	defCfg.blur = function() {
		var self = this;
		setTimeout(function() {
			self.hide();
		}, 150);
	};
	defCfg.keydown = function(e) {
		this.suppressKeyPressRepeat = [40, 38, 9, 13, 27].indexOf(e.keyCode) >= 0;
		this.move(e);
	};
	defCfg.move = function(e) {
		if(!this.shown) return;
		switch(e.keyCode) {
			case 9: // tab
			case 13: // enter
			case 27: // escape
				e.preventDefault();
				break;
			case 38: // up arrow
				e.preventDefault();
				this.prev();
				break;
			case 40: // down arrow
				e.preventDefault();
				this.next();
				break;
		}
		e.stopPropagation();
	};
	defCfg.keypress = function(e) {
		if(this.suppressKeyPressRepeat) return;
		this.move(e);
	};
	defCfg.keyup = function(e) {
		var self = this;
		switch(e.keyCode) {
			case 40: // down arrow
			case 38: // up arrow
				break;
			case 9: // tab
			case 13: // enter
				if(!self.shown) return;
				self.select();
				break;
			case 27: // escape
				if(!self.shown) return;
				self.hide();
				break;
			default:
				self.lookup();
		}
		e.stopPropagation();
		e.preventDefault();
	};
	defCfg.click = function(e) {
		e.stopPropagation();
		e.preventDefault();
		this.select();
	};
	defCfg.mouseenter = function(e) {
		this.ctn.find('.active').removeClass('active');
		$(e.currentTarget).addClass('active');
	};
	defCfg.prev = function(e) {
		var active = this.ctn.find('.active').removeClass('active');
		var prev = active.prev();
		if(!prev.length) {
			prev = this.ctn.find('li').last();
		}
		prev.addClass('active');
	};
	defCfg.next = function(e) {
		var active = this.ctn.find('.active').removeClass('active');
		var next = active.next();
		if(!next.length) {
			next = this.ctn.find('li').first();
		}
		next.addClass('active');
	};
	defCfg.render = function(items) {
		var lis = [];
		items.forEach(function(item) {
			var pc = String(item.code || item);
			var pt = String(item.caption || item);

			lis.push({
				tn: "li",
				attrs: [{
					an: "code",
					av: pt
				}, {
					an: "caption",
					av: pt
				}, {
					an: "class",
					av: "select-item"
				}],
				chs: [pt]
			});
		});
		if(this.autoselect && lis.length) {
			lis[0].attrs[2].av = " active select-item";
		}
		this.menu.empty();
		util.appendChild(this.menu[0], lis);
		return this;
	};
	defCfg.lookup = function(event) {
		var self = this;
		self.query = self.ve.val();
		if(!self.query || self.query.length < self.minLength) {
			return self.shown ? self.hide() : self
		}

		if(self.source instanceof Function) {
			self.source(self.query, function() {
				self.process.apply(self, arguments);
			});
		} else {
			self.process(self.source);
		}

		return self;
	};
	defCfg.process = function(items) {
		if(items && items.length) {
			this.render(items.slice(0, this.maxShowCount));
			this.show();
		}
	};
	defCfg.show = function() {
		this.shown = true;
		this.ctn.addClass("open");
	};
	defCfg.hide = function() {
		this.shown = false;
		this.ctn.removeClass("open");
		var v = this.ve.val();
		if(v) {
			if(v !== this.caption) {
				this.ve.val(this.caption);
			}
		} else {
			this.rv = "";
			this.caption = "";
		}
		this.lastQuerying = null;
		this.lastQueryed = null;
	};
	defCfg.select = function() {
		if(this.shown) {
			var item = this.menu.find(".active");
			this.rv = item.attr('code');
			this.caption = item.attr("caption");
			this.ve.val(this.caption);
			return this.hide();
		}
	};
	defCfg.init = function($e) {
		var self = this;
		this.ctn = $e;
		var ve = $e.children(".dd-drop");
		if(ve.length && ve.children("ul").length === 1) {
			var rc = code.parseCode(ve);
			rc.empty();
			this.render = function(items) {
				rc.val(items);
				self.menu=self.ctn.find(".dd-drop>ul");
			}
		} else {
			$("<div class='dd-drop'><ul></ul></div>").appendTo($e);
		}
		this.menu = $e.find(".dd-drop>ul");
		ve = this.ve = $("<input type='text'/>");
		var tmp = $e.attr(placeholder);
		if(tmp) ve.attr(placeholder, tmp);
		$e.addClass("dd-ctn").append(ve).removeClass("dd-clean");
		this.shown = false;
		this.quri = this.quri || $e.attr("uri");
		this.minLength == this.minLength || parseInt($e.attr("minQueryLen") || "1");
		this.maxShowCount = this.maxShowCount || parseInt($e.attr("minQueryLen") || "1");
		this.keyPressInterval = this.keyPressInterval || parseInt($e.attr("keyPressInterval") || "500");
		ve.on("blur", function(e) {
			self.blur(e);
		});
		ve.on("keypress", function(e) {
			self.keypress(e);
		});
		ve.on("keyup", function(e) {
			self.keyup(e);
		});
		ve.on("keydown", function(e) {
			self.keydown(e);
		});
		$e.children(".dd-drop").on("click", function(e) {
			self.click(e);
		});
		$e.children(".dd-drop").on("mouseenter", "li", function(e) {
			self.mouseenter(e);
		});
	};

	form.register(function($e, options) {
		var cls = util.classCheck($e[0], [modelName, required]),
			config;
		if(cls[modelName]) {
			var n = $e.attr("name") || $e.attr("id"),
				ve, rules = [];
			if(!n) {
				throw "Attribute[name] is invalid";
			}
			config = $.extend(new typeahead(), options ? options[n] || {} : {});
			config.dv = $e.attr("defVal") || "";
			config.rv = config.dv;
			if(!config.rules) {
				config.rules = [];
			}
			config.init($e);
			return {
				name: n,
				get: function() {
					return config.rv;
				},
				set: function(data) {
					config.rv = data;
				},
				validate: function() {
					if(cls[required]) {
						if(!config.rv) {
							this.invalid(m_rd);
							return m_rd;
						}
					}
					return util.validate(config.rules, this);
				},
				addRules: function(rule) {
					util.addRules(config.rules, rule);
				},
				reset: function() {
					this.set(dv);
				},
				valid: function() {
					util.valid($e);
				},
				invalid: function(reson) {
					util.invalid($e);
					util.error(reson);
				}
			};
		}

	});
});