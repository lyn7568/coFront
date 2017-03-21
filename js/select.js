$.use(["jQuery", "form", "doc", "util", "dropdown", "dict"], function($, form, doc, util, dd, dict) {
	var readOnly = "readOnly",
		showOnly = "showOnly",
		modelName = 'select',
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
		hand = {
			tn: "a",
			attrs: [
				{ an: "class", av: "dd-hand" },
				jhref,
				handCode,
			],
			chs: [
				{ tn: "i", attrs: [{ an: "class", av: "icon icon-drop" }] },
				{ tn: "span", attrs: [spanCode, spanDictCode] },
				{ tn: "i", attrs: [{ an: "class", av: "icon icon-close" }] },
				{ tn: "a", attrs: [jhref, { an: "class", av: placeholder }], chs: pa }
			]
		},
		seim = { an: "class", av: "select-item" },
		sebi = { an: "class", av: "branch-item" },
		buildTreeDrop = function(isQueried, items, pa) {
			items.forEach(function(item) {
				if(isQueried || item.enabled) {
					var li = { tn: "li", attrs: [], chs: [] };
					if(item.children && item.children.length) {
						var bhand = { tn: "a", attrs: [], chs: [] };
						bhand.attrs.push({ an: "code", av: item.code });
						bhand.chs.push({ tn: "span", chs: [item.caption] });
						li.attrs.push(sebi);
						li.chs.push(bhand);
						buildTreeDrop(isQueried, item.children, li.chs);
					} else {
						li.attrs.push(seim);
						li.attrs.push({ an: "code", av: item.code });
						li.chs.push(item.caption);
					}
					pa.push(li);
				}
			});
		},
		//			}
		//			$ul.find(QF_SELECT_ITEM).on("click.jr_select_api", select_selectItem);
		//			$ul.find(QF_BRANCH_ITEM).on("click.jr_select_api", select_branchItem);
		//			return $ul;
		//	}

		singleShown = function($e, dictCode, clss, $h, $span) {
			return clss[tree] ? function(evt) {
				var items = dict.get(dictCode);
				var drop = { tn: "div", attrs[{ an: "class", av: "dd-drop" }], chs = [] };
				if(items) {
					var ul = { tn: "ul", chs: [] };
					buildTreeDrop(clss[queried], items, ul.chs);
					drop.chs.push(ul);
				} else {
					drop.chs.push("loading.........");
				}
				util.appendChild($e[0], drop);
				if(items) {
					$e.find(".select-item").on("click", function() {
						var cc = this.getAttribute("code");
						$h.attr("code", cc);
						$span.attr("code", cc);
						$span[0].textContent = this.textContent;

					});
					$e.find(".branch-item").on("click", function(evt) {
						$(this).toggleClass("open");
						$e.addClass("dd-hold-once");
					});
				}
			} : function(evt) {
				var items = dict.get(dictCode);
				var drop = { tn: "div", attrs[{ an: "class", av: "dd-drop" }], chs = [] };
				if(items) {
					var ul = { tn: "ul", chs: [] };
					items.forEach(function(item) {
						if(clss[queried] || item.enabled) {
							this.push({ tn: "li", attr[seim, { an: "code": av: item.code }], chs: [item.caption] });
						}
					}, ul.chs);
					drop.chs.push(ul);
				} else {
					drop.chs.push("loading.........");
				}
				util.appendChild($e[0], drop);
				if(items) $e.find(".select-item").on("click", function(e) {
					var cc = this.getAttribute("code");
					$h.attr("code", cc);
					$span.attr("code", cc);
					$span[0].textContent = this.textContent;
				});
			};
		};

	from.register(function($e) {
		var cls = util.classCheck($e[0], [readOnly, showOnly, modelName, tInt, tBool, required, tree, queried]);
		if(cls[modelName]) {
			var n = attr("name") || $e.attr("id"),
				ve, rules = [];
			if(!n) {
				throw "Attribute[name] is invalid";
			}
			var dv = $e.attr(def) || "",
				dictCode = $e.attr("dictCode") || "";
			if(!dictCode) { throw "Attribute[dictCode] is invalid"; }
			$e.empty().addClass("dd-ctn").addClass("dd-clean");
			handCode.av = spanCode.av = dv;
			spanDictCode.av = dictCode;
			pa[0] = $e.attr(placeholder) || "";
			util.appendChild($e[0], hand);
			var $h = $e.children("a");
			var $span = $h.children("span");
			if(!(cls[readOnly] || cls[showOnly])) {
				$e.on("shown", singleShown($e[0], dictCode, cls, $h, $span));
				$e.find(".icon-close").on("click", function() {
					$e.addClass("dd-hold-once");
					$h.attr("code", "");
					$span.attr("code", "").text("");
				});
			}
			if(dv) {
				dict.tranfer($span, dictCode, dv);
			} else {
				dict.apply(dictCode, util.noop);
			}
			return {
				name: n,
				get: function() {
					var vd = $h.attr("code");
					if(vd) {
						return css[tBool]?'1'===vd:cls[tInt]?parseInt(vd):vd;
					}
				},
				set: function(data) {
					if(data){
						var cc = data===true?"1":(""+data);
						$h.attr("code",cc);
						$span.attr("code",cc);
						dict.transfer($span,dictCode,cc);
					}else if(data===false || data==0){
						$h.attr("code",'0');
						$span.attr("code",'0');
						dict.transfer($span,dictCode,'0');
					}else{
						$h.attr("code",'');
						$span.attr("code",'').text("");
					}
				},
				validate: function() {
					if(cls[required]){
						if(!$h.attr("code")){
							return "不可为空";
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