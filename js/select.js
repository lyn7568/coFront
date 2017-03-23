$.use(["jQuery", "form", "doc", "util", "dropdown", "dict"], function($, form, doc, util, dd, dict) {
	var readOnly = "readOnly",
		showOnly = "showOnly",
		modelName = 'select',
		mModelName = "mselect",
		tInt = "int",
		tBool = "bool",
		tString = "string",
		def = "defVal",
		placeholder = "placeholder",
		required = "required",
		tree = "tree",
		queried = "queried",
		handCode = { an: "code", av: "" },
		spanCode = { an: "code", av: "" },
		spanDictCode = { an: "dictCode", av: "" },
		pa = [""],
		jhref = { an: "href", av: "javascript:;" },
		dd_hand = { an: "class", av: "dd-hand" },
		icon_drop = { tn: "i", attrs: [{ an: "class", av: "icon icon-drop" }] },
		icon_close = { tn: "i", attrs: [{ an: "class", av: "icon icon-close" }] },
		a_placeHolder = { tn: "a", attrs: [jhref, { an: "class", av: placeholder }], chs: pa },
		hand = {
			tn: "a",
			attrs: [
				dd_hand,
				jhref,
				handCode,
			],
			chs: [
				icon_drop,
				{ tn: "span", attrs: [spanCode, spanDictCode] },
				icon_close,
				a_placeHolder,
			]
		},
		seim = { an: "class", av: "select-item" },
		sebi = { an: "class", av: "branch-item" },
		buildTreeDrop = function(isQueried, items, pa) {
			items.forEach(function(item) {
				if(isQueried || item.enabled) {
					var li = {
						tn: "li",
						attrs: [{ an: "code", av: item.code }, { an: "caption", av: item.caption }],
						chs: []
					};
					if(item.children && item.children.length) {
						var bhand = {
							tn: "a",
							attrs: [{ an: "code", av: item.code }],
							chs: [{ tn: "span", chs: [item.caption] }]
						};
						li.attrs.push(sebi);
						li.chs.push(bhand);
						var ul={tn:"ul",chs:[]};
						li.chs.push(ul);
						buildTreeDrop(isQueried, item.children, ul.chs);
					} else {
						li.attrs.push(seim);
						li.chs.push(item.caption);
					}
					pa.push(li);
				}
			});
		},
		buildShown = function($e, dictCode, clss) {
			return clss[tree] ? function(evt) {
				var items = dict.get(dictCode);
				var drop = { tn: "div", attrs: [{ an: "class", av: "dd-drop" }], chs: [] };
				if(items) {
					var ul = { tn: "ul", chs: [] };
					buildTreeDrop(clss[queried], items, ul.chs);
					drop.chs.push(ul);
				} else {
					drop.chs.push("loading.........");
				}
				util.appendChild($e[0], drop);
			} : function(evt) {
				var items = dict.get(dictCode);
				var drop = { tn: "div", attrs: [{ an: "class", av: "dd-drop" }], chs: [] };
				if(items) {
					var ul = { tn: "ul", chs: [] };
					items.forEach(function(item) {
						if(clss[queried] || item.enabled) {
							this.push({
								tn: "li",
								attrs: [seim, { an: "code", av: item.code }, { an: "caption", av: item.caption }],
								chs: [item.caption]
							});
						}
					}, ul.chs);
					drop.chs.push(ul);
				} else {
					drop.chs.push("loading.........");
				}
				util.appendChild($e[0], drop);
			};
		};

	form.register(function($e) {
		var cls = util.classCheck($e[0], [readOnly, showOnly, modelName, tInt, tBool, required, tree, queried]),
			rv;
		if(cls[modelName]) {
			var n = $e.attr("name") || $e.attr("id"),
				ve, rules = [];
			if(!n) {
				throw "Attribute[name] is invalid";
			}
			var dv = $e.attr(def) || "",
				dictCode = $e.attr("dictCode") || "";
			rv = dv;
			if(!dictCode) { throw "Attribute[dictCode] is invalid"; }
			$e.empty().addClass("dd-ctn").addClass("dd-clean");
			handCode.av = spanCode.av = dv;
			spanDictCode.av = dictCode;
			pa[0] = $e.attr(placeholder) || "请选择......";
			util.appendChild($e[0], hand);
			var $h = $e.children("a");
			var $span = $h.children("span");
			var select_change = function(nv, cap, evt) {
				if(rv != nv) {
					rv = nv;
					$h.attr("code", rv);
					$span.attr("code", rv).text(cap).removeClass("invalid-dict");
					if(evt) {
						$e.addClass("dd-hold-once");
					}
				}
			};
			if(!(cls[readOnly] || cls[showOnly])) {
				$e.on("shown.dropdown", buildShown($e, dictCode, cls));
				$e.find(".icon-close").on("click", function(evt) {
					select_change("", "", evt);
				});
				$e.on("click", "div .select-item", function() {
					select_change(this.getAttribute("code"), this.getAttribute("caption"));
				});
				if(cls[tree]) {
					$e.on("click", "div .branch-item>a", function(evt) {
						$(this).toggleClass("open");
						$e.addClass("dd-hold-once");
					});
				}
			}
			if(rv) {
				dict.transfer($span, dictCode, rv);
			} else {
				dict.apply(dictCode, util.noop);
			}
			return {
				name: n,
				get: function() {
					if((!cls[showOnly]) && rv) {
						return cls[tBool] ? '1' === rv : cls[tInt] ? parseInt(rv) : rv;
					}
				},
				set: function(data) {
					if(data) {
						var cc = data === true ? "1" : ("" + data);
						select_change(cc, "");
						dict.transfer($span, dictCode, cc);
					} else if(data === false || data === 0) {
						select_change("0", "");
						dict.transfer($span, dictCode, cc);
					} else {
						select_change("", "");
					}
				},
				validate: function() {
					if(cls[required]) {
						if(!rv) {
							return "不可为空";
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
	var selCap={an:"class",av:"select-caption"}, mhand = {
		tn: "a",
		attrs: [dd_hand],
		chs: [icon_drop, { tn: "ul" }, a_placeHolder]
	};
	form.register(function($e) {
		var cls = util.classCheck($e[0], [readOnly, showOnly, mModelName, tInt, required, tree, queried]);
		if(cls[mModelName]) {
			var n = $e.attr("name") || $e.attr("id"),
				rules = [];
			if(!n) {
				throw "Attribute[name] is invalid";
			}
			var dv = [],
				rv = [],
				tmp = ($e.attr(def) || "").split(","),
				dictCode = $e.attr("dictCode") || "";
			if(!dictCode) { throw "Attribute[dictCode] is invalid"; }
			tmp.forEach(function(item) {
				if(item) {
					item = item.trim();
					if(item) {
						dv.push(item);
						rv.push(item);
					}
				}
			});
			$e.empty().addClass("dd-ctn").addClass("dd-clean");
			pa[0] = $e.attr(placeholder) || "请选择......";
			var lis = mhand.chs[1].chs = [];
			dv.forEach(function(item) {
				lis.push({
					tn: "li",
					attrs: [{ an: "code", av: item }],
					chs: [icon_close, { tn: "span", attrs: [{ an: "code", av: item},selCap] }]
				});
			});
			util.appendChild($e[0], mhand);

			var $ul = $e.find("ul");
			var mselect_add = function(nv, cp) {
				if(rv.indexOf(nv) > -1) {
					return false;
				}
				rv.push(nv);
				var li = {
					tn: "li",
					attrs: [{ an: "code", av: nv }],
					chs: [icon_close,
						{
							tn: "span",
							attrs: [{ an: "code", av: nv },selCap],
							chs: [cp]
						}
					]
				};
				util.appendChild($ul[0], li);
				return true;
			};
			var mselect_change = function(na) {
				rv = [], nlis = [];
				$ul.empty();
				na.forEach(function(item) {
					rv.push("" + item);
				});
				if(rv.length) {
					rv.forEach(function(item) {
						nlis.push({
							tn: "li",
							attrs: [{ an: "code", av: nv },selCap],
							chs: [icon_close, {
								tn: "span",
								attrs: [{ an: "code", av: item.code }, { an: "dict", av: dictCode }, { an: "class", av: "hand-dict" }],
								chs: [cp]
							}]
						});
					});
					util.appendChild($ul[0], nlis);
					dict.doTransfer();
				}
			};
			if(lis.length) {
				$ul.find("span").each(function() {
					dict.transfer($(this), dictCode);
				});
			} else {
				dict.apply(dictCode, util.noop);
			}

			if(!(cls[readOnly] || cls[showOnly])) {
				$e.on("shown.dropdown", buildShown($e, dictCode, cls));
				$ul.on("click", "li>i", function(e) {
					$e.addClass("dd-hold-one");
					var idx = rv.indexOf(this.parentNode.getAttribute("code"));
					if(idx > -1) {
						rv.splice(idx, 1);
					}
					$(this).parent().remove();
				});
				$e.on("click", "div .select-item", function() {
					if(!mselect_add(this.getAttribute("code"), this.getAttribute("caption"))) {
						$e.addClass("dd-hold-once");
					}
				});
				if(cls[tree]) {
					$e.on("click", "div .branch-item>a", function(evt) {
						$(this).toggleClass("open");
						$e.addClass("dd-hold-once");
					});
				}
			}

			return {
				name: n,
				get: function() {
					if((!cls[showOnly]) && rv.length) {
						var ret = [];
						rv.forEach(function(item) {
							ret.push(cls[tInt] ? parseInt(item) : item);
						});
						return ret;
					}
				},
				set: function(data) {
					mselect_change(data ? (data.length ? data : []) : []);
				},
				validate: function() {
					if(cls[required]) {
						if(!rv.length) {
							return "不可为空";
						}
					}
					return util.validate(rules, this);
				},
				addRules: function(rule) {
					util.addRules(rules, rule);
				},
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