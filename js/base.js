if(typeof jQuery === 'undefined') {
	throw new Error('this JavaScript requires jQuery')
} +

function($) {
	/*common css define 
	 * QF = query flag   
	 * CC = css class
	 */
	var
		CC_BRANCH_ITEM = "branch-item",
		QF_BRANCH_ITEM = ".branch-item > a",
		CC_TREE = "tree",
		QF_SELECT = ".select",
		CC_SELECT = "select",
		QF_HIDDEN = ".hidden",
		CC_HIDDEN = "hidden",
		QF_TEXT = ".text",
		CC_TEXT = "text",
		CC_FORM_ITEM = "form-item",
		QF_FORM_ITEM = ".form-item",
		CC_TRIM = "trim",
		CC_STRING = "string",
		CC_INT = "int",
		CC_BOOL = "bool",
		CC_FLOAT = "float",
		CC_SELECT_ITEM = "select-item",
		QF_SELECT_ITEM = ".select-item",
		CC_SELECT_CAPTION = "select-caption",
		QF_SELECT_CAPTION = ".select-caption",
		CC_READONLY = "readOnly",
		CC_SHOWONLY = "showOnly",
		QF_DROP_DOWN_CONTAINER = ".dd-ctn",
		CC_DROP_DOWN_CONTAINER = "dd-ctn",
		CC_DROP_DOWN_BACKGROUP = "dd-bg",
		QF_DROP_DOWN_BACKGROUP = ".dd-bg",
		CC_DROP_DOWN_HAND = "dd-hand",
		QF_DROP_DOWN_HAND = ".dd-hand",
		CC_DROP_DOWN_PANEL = "dd-drop",
		QF_DROP_DOWN_PANEL = ".dd-drop",
		CC_DROP_CLEAN = "dd-clean",
		QF_DROP_CLEAN = ".dd-clean",
		QF_OPEN = ".open",
		CC_OPEN = "open",
		CC_DISABLED = "disabled",
		QF_DISABLED = ".disabled :disabled";

	/*
	 * AK = attribate key
	 * DK = data key
	 * EN = element name
	 * TN = type name
	 * CK = const data key  
	 * 
	 */

	var AK_DEF_VAL = "defVal",
		AK_PLACEHOLDER = "placeholder",
		AK_ID = "id",
		AK_NAME = "name",
		AK_DICT_CODE = "dictCode",
		AK_CODE = "code",
		AK_READONLY = "readonly",
		AK_REQUIRED = "required",

		EN_HEAD, EN_BASE = "base",
		EN_SCRIPT = "script",
		EN_INPUT = "input",

		TN_STRING = CC_STRING,
		TN_NUMBER = "number",
		TN_ARRAY = "array",
		TN_OBJ = "object",
		TN_FNC = "function",
		TN_BOOL = "boolean",

		CK_TRUE = true,
		CK_FALSE = false,
		CK_UNDEF = undefined,
		CK_YYYYMMDD = "YYYYMMDD",
		CK_YYYY = "YYYY",
		CK_MM = "MM",
		CK_YYYYMM = "YYYYMM",

		DK_FORM_VALUE = "form_value";

	/**
	 * TK = template key
	 */
	var TK_TEXT_INPUT = "<input type='text' />",
		TK_SPAN = "<span></span>",
		TK_UL = "<ul></ul>",
		TK_LI = "<li></li>",
		TK_ICON = "<i class='icon'></i>",
		TK_DD_DROP = "<div class='dd-drop'></div>",
		TK_DD_HAND = "<a class='dd-hand' href='javascript:;'><i class='icon'></i></a>",
		TK_HIDDEN_INPUT = "<input type='hidden' />",
		doc = document,
		head = doc.head || doc.getElementsByTagName(EN_HEAD)[0] || doc.documentElement,
		baseElement = head.getElementsByTagName(EN_BASE)[0],
		noop = function() {},
		body = $("body"),
		returnFalse = function() {
			return CK_FALSE
		},
		returnTrue = function() {
			return CK_TRUE
		},
		_infoDiv = $("#g_info"),
		_errDiv = $("#g_err"),
		_warnDiv = $("#g_warn"),
		_msgDiv = $("#g_msg"),
		_loadingDiv = $("#g_loading"),
		_g_css_ref = 1,
		_g_script_ref = 1,
		_g_err_msg = {
			"1": function() {
				window.location.href = "login.html";
			}
		},
		_g_layer_curr = { index: 5000000, remove: noop, css: noop },
		layer_remove = function() {
			this.shade.remove();
			this.ctn.empty();
			this.ctn.remove();
			this.prev.css("display", "block");
			_g_layer_curr = this.prev;
		},
		_g_loadRef = 0;

	var util = {
		createModalLayer: function(p) {
			var inx = _g_layer_curr.index + 2;
			var ly = { index: inx, remove: layer_remove, prev: _g_layer_curr };
			ly.shade = $("<div class='layer-shade layer-" + inx + "' style='z-index:" + inx + ";'></div>").appendTo(body);
			++inx;
			ly.ctn = $("<div class='layer-ctn layer-" + inx + "' style='z-index:" + inx + ";'></div>").appendTo(body);
			ly.prev = _g_layer_curr;
			_g_layer_curr = ly;
			if(p) {
				if(typeof p === "string") {
					ly.ctn.html(p);
				} else if(typeof p == "function") {
					p.call(ly.ctn);
				} else if(p.jquery) {
					ly.ctn.append(p);
				}
			}
			return ly;
		},
		closeModalLayer: function() {
			_g_layer_curr.remove();
		},

		// parent is body z-index = 9999999
		// *弹出错误信息，会自动消失
		//cnt String or jquery obj
		//msg container is div
		//$(msg container).text(String)  or $(msg container).append(jquery obj); 
		error: function(cnt, timeInternal) {
			var $errCtn = $("<div class='err-ctn'><i class='icon click-hide-parent'></i></div>").appendTo(_errDiv);
			$(TK_SPAN).appendTo($errCtn).html(cnt);
			setTimeout(function() {
				$errCtn.remove()
			}, timeInternal ? timeInternal : 10000);
		},
		//弹出警告信息，会自动消失  ref  Util.error
		warn: function(cnt, timeInternal) {
			var $warnCtn = $("<div class='warn-ctn'><i class='icon click-hide-parent'></i></div>").appendTo(_warnDiv);
			$(TK_SPAN).appendTo($warnCtn).html(cnt);
			setTimeout(function() {
				$warnCtn.remove()
			}, timeInternal ? timeInternal : 3000);
		},
		//弹出提示信息，会自动消失 ref  Util.error
		msg: function(cnt, timeInternal) {
			var $msgCtn = $("<div class='msg-ctn'><i class='icon click-hide-parent'></i></div>").appendTo(_msgDiv);
			$(TK_SPAN).appendTo($msgCtn).html(cnt);
			setTimeout(function() {
				$msgCtn.remove()
			}, timeInternal ? timeInternal : 2000);
		},

		//弹出加载信息遮罩    parent  is  body     z-index =  9999998; 
		showLoading: function() {
			++_g_loadRef;
			if(_g_loadRef === 1) {
				_loadingDiv.show()
			}

		},
		//隐藏加载信息遮罩    parent  is  body     z-index =  9999998; 
		hideLoading: function() {
			--_g_loadRef;
			if(_g_loadRef === 0) {
				_loadingDiv.hide()
			}
		},
		/*
		 * 弹出提示信息，不会自动消失    parent is body z - index 5000000 - 9999997
		 */
		alertMsg: function(title, content,hand) {
			if(content){
				if($.isFunction(content)){
					hand = content;
					content = title;
					title = "提示";
				}
			}else{
				content = title;
				title = "提示";
			}
			hand=hand || noop;
			var ly = util.createModalLayer('<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title"></h4></div><div class="modal-body"><p></p></div><div class="modal-footer"><button type="button" class="btn">关闭</button></div></div></div>');
			ly.ctn.find(".modal-title").text(title);
			$content = ly.ctn.find("p").text(content);
			ly.ctn.find("button").on("click", function() {
				util.closeModalLayer();
				hand();
			});
		},
		/*
		 *弹出确认信息，不会自动消失    parent is body z - index 1000000 - 4999999 
		 * btns is Array 
		 * btns like [{catpion:"button caption",handler:function(){}},...]
		 */
		boxMsg: function(obj) {
			var ly = util.createModalLayer('<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title"></h4></div><div class="modal-body"><p></p></div><div class="modal-footer"></div></div></div>');
			ly.ctn.find(".modal-title").text(obj.title || "确认");
			ly.ctn.find("p").text(obj.content);
			var m_footer = ly.ctn.find(".modal-footer"),
				btnH = function(btn) {
					var $btn = $('<button type="button" class="btn"></button>').appendTo(m_footer);
					var caption = btn.caption || "未命名的",
						handler = btn.hand || noop;
					$btn.text(caption);
					$btn.on("click", function() {
						util.closeModalLayer();
						handler();
					});
				};

			for(var i = 0; i < obj.btns.length; ++i) {
				btnH(obj.btns[i]);
			}
		},

		/*
		 *弹出确认信息，不会自动消失    parent is body z - index 1000000 - 4999999 
		 * == Util.boxMsg(cnt,[{caption:"确定"，handler:yesHandler},{caption:"取消",handler:noHandler}]);
		 */
		confirmMsg: function(cnt, yesHandler, noHandler) {},

		loadScript: function(url) {
			var node = doc.createElement(EN_SCRIPT);
			node.async = CK_TRUE;
			node.src = url;
			node.charset = "UTF-8";
			var supportOnload = "onload" in node;
			util.showLoading();
			if(supportOnload) {
				//todo:dddd
				node.onload = function() {
					node.onerror = null;
					node.onload = null;
					util.hideLoading();
				};
				//todo:dddd
				node.onerror = function() {
					util.error("load script error:" + url);
					node.onload = null;
					node.onerror = null;
					util.hideLoading();
				};
			} else {
				//todo:dddd
				node.onreadystatechange = function() {
					if(/loaded|complete/.test(node.readyState)) {
						node.onreadystatechange = null;
						util.msg("load script over:" + url);
						util.hideLoading();
					}
				};
			}
			baseElement ?
				head.insertBefore(node, baseElement) :
				head.appendChild(node);
		},
		loadCSS: function(href) {
			var link = doc.createElement('link');

			link.rel = 'stylesheet';
			link.href = href;
			link.media = 'all';
			var id = "g_css_" + _g_css_ref;
			++_g_css_ref;
			link.id = id;
			head.appendChild(link);
			return id;
		},
		removeCSS: function(id) {
			var node = doc.getElementById(id);
			if(node) {
				head.removeChild(node);
			}
		},
		regErrorHandler: function(key, handler) {
			_g_err_msg[key] = handler;
		},
		ajax: function(method, pUrl, pData, sh, eh) {
			util.showLoading();
			$.ajax({
				type: method,
				url: pUrl,
				//cache: false,
				traditional:true,
				data: pData,
				contentType: method == "put" ? "application/json" : "application/x-www-form-urlencoded",
			}).done(function(rd) {
				if(rd.success) {
					sh(rd.data);
				} else {
					if(eh) {
						var eht = $.type(eh);
						if(eht == TN_FNC) {
							eh(rd.code, rd.msg, rd.detailMsg);
						} else if(eht == TN_BOOL) {
							if(eht) {
								util.error("load resource error:" + pUrl + "\n" + (rd.detailMsg ? rd.detailMsg : ""));
							}
						} else {
							var msg = eh["" + rd.code] || _g_err_msg["" + rd.code];
							if(msg) {
								if($.type(msg) == TN_FNC) {
									msg(rd.code, rd.msg, rd.detailMsg);
								} else {
									util.error(msg ? msg : "未定义的错误");
								}
							}
						}
					}
				}
			}).fail(function(jqXHR, textStatus, errorThrown) {
				util.msg("load resouce[" + pUrl + "] error:" + textStatus);
			}).always(util.hideLoading);
		},
		get: function(url, data, sh, eh) {
			util.ajax("get", url, data, sh, eh);
		},
		post: function(url, data, sh, eh) {
			util.ajax("post", url, data, sh, eh);
		},
		put: function(url, data, sh, eh) {
			if(data && ("string"!=$.type(data))){
				data =JSON.stringify(data);
			}
			util.ajax("put", url, data, sh, eh);
		},
		del: function(url, sh, eh) {
			util.ajax("post", url, null, sh, eh);
		},
	};

	//begin dropdown
	//QF == query flag
	//CC == css class 

	var dd_clearMenus = function(e) {
			if(e && e.which === 3) return
			$(QF_DROP_DOWN_BACKGROUP).remove()
			$(QF_DROP_DOWN_CONTAINER).each(function() {
				var $this = $(this)
				var relatedTarget = {
					relatedTarget: this
				}
				if(!$this.hasClass(CC_OPEN)) return
				$this.trigger(evt = $.Event('hide.jr.dropdown', relatedTarget))
				if(evt.isDefaultPrevented()) return
				$this.removeClass(CC_OPEN).trigger('hidden.jr.dropdown', relatedTarget)
				if(!$this.hasClass(CC_DROP_CLEAN)) return
				$this.find(QF_DROP_DOWN_PANEL).remove();
			});
		},
		dd_toggle = function(e) {
			var $this = $(this);
			var $ddc = $this.parents(QF_DROP_DOWN_CONTAINER);
			if(!$ddc.length) return;
			if($ddc.is(QF_DISABLED)) return;
			var isActive = $ddc.hasClass(CC_OPEN);
			dd_clearMenus();
			if($ddc.hasClass(CC_FORM_ITEM) && ($ddc.hasClass(CC_READONLY) || $ddc.hasClass(CC_SHOWONLY))) return;
			if(!isActive) {
				var relatedTarget = {
					relatedTarget: this
				}
				$ddc.trigger(e = $.Event('show.jr.dropdown', relatedTarget))
				if(e.isDefaultPrevented()) return
				$ddc.toggleClass(CC_OPEN).trigger('shown.jr.dropdown', relatedTarget)
			}
			return CK_FALSE
		},

		//end dropdown

		//begin dict
		dict_dictCache = {},
		dict_dictHandleCache = {},
		dict_dictGuid = 1,
		dict_handerArray = "handlers",
		dict_baseUri = "/ajax/sys/dict/item/",
		dict_load = function(dictCode) {
			util.showLoading();
			$.ajax({ url: dict_baseUri + dictCode, type: "get", dataType: "json" }).done(function(data) {
				util.hideLoading();
				if(data.success) {
					data = data.data;
					dict_dictCache[dictCode] = data;
					var handlers = dict_dictHandleCache[dictCode];
					if(handlers && handlers.length) {
						for(var i = 0; i < handlers.length; ++i) {
							handlers[i](data);
						}
						delete dict_dictHandleCache[dictCode];
					}
				} else {
					var m = "load dict[" + dictCode + "] error";
					util.error(m);
				}
			}).fail(function() {
				util.hideLoading();
				var m = "load dict[" + dictCode + "] error";
				util.error(m);
			});
		},
		dict_apply = function(dictCode, handler) {
			var dict = dict_dictCache[dictCode];
			if(!dict) {
				var hs = dict_dictHandleCache[dictCode];
				if(!hs) {
					dict_dictHandleCache[dictCode] = hs = [];
					dict_load(dictCode);
				}
				hs.push(handler);
			} else {
				handler(dict);
			}
		},
		dict_refresh = function(dictCode, handler) {
			if(handler) {
				var hs = dict_dictHandleCache[dictCode];
				if(!hs) {
					dict_dictHandlerCache[dictCode] = hs = [];
				}
				hs.push(handler);
			}
			var dict = dict_dictCache[dictCode];
			if(dict) {
				delete dict_dictCache[dictCode];
				util.loadScript(dict_baseUri + dictCode + ".js");
			}
		},
		/*
		 * content:[{code:"12345",caption:"",shortCode:"",enabled:true,children:[{code:"",catpion:"",enabled:true,children:[]]}},....]
		 * 
		 */
		dict_define = function(dictCode, content, dynamic) {
			if(!dynamic) {
				dict_dictCache[dictCode] = dict_dictCache[dictCode] || content;
			}
			var handlers = dict_dictHandleCache[dictCode];
			if(handlers && handlers.length) {
				for(var i = 0; i < handlers.length; ++i) {
					handlers[i](content);
				}
				delete dict_dictHandleCache[dictCode];
			}
		},
		dict_get = function(dict, code) {
			if(code) {
				for(var i = 0; i < dict.length; ++i) {
					var item = dict[i];
					if(code === item.code) {
						return item.caption;
					} else if(item.children && item.children.length) {
						var ret = dict_get(item.children, code);
						if(ret) return ret;
					}
				}
			}
			return CK_FALSE;
		},
		dict_display = function() {
			$(".do-dict-display").each(function() {
				var $this = $(this),
					dictCode = $this.attr("dict");
				if(dictCode) {
					dict_apply(dictCode, function(dict) {
						var dh = dict_get(dict, $this.attr("code"));
						$this.html(dh ? dh : "");
						$this.removeClass("do-dict-display");
					});
				}
			});
		},

		//end dict

		Jhidden = function(ele) {
			if($.type(ele) == CC_STRING) {
				this.name = ele;
			} else {
				this.name = ele.attr(AK_NAME) || ele.attr(AK_ID);
				if(!this.name) {
					throw "Attribute[name] is invalid";
				}
				ele.data(DK_FORM_VALUE, this);
			}
		},

		Jtext = function(ele) {
			this.name = ele.attr(AK_NAME) || ele.attr(AK_ID);
			if(!this.name) {
				throw "Attribute[name] is invalid";
			}
			this.trimed = ele.hasClass(CC_TRIM);
			this.readOnly = ele.hasClass(CC_READONLY);
			this.showOnly = ele.hasClass(CC_SHOWONLY);
			this.ele = ele;
			this.dv = ele.attr(AK_DEF_VAL) || "";
			this.dt = 0;
			if(ele.hasClass(CC_INT)) {
				this.dt = 1;
			} else if(ele.hasClass(CC_FLOAT)) {
				this.dt = 2;
			}
			ele.data(DK_FORM_VALUE, this);
		},
		Jtextarea = function(ele) {
			this.name = ele.attr(AK_NAME) || ele.attr(AK_ID);
			if(!this.name) {
				throw "Attribute[name] is invalid";
			}
			this.trimed = ele.hasClass(CC_TRIM);
			this.readOnly = ele.hasClass(CC_READONLY);
			this.showOnly = ele.hasClass(CC_SHOWONLY);
			this.ele = ele;
			this.dv = ele.attr(AK_DEF_VAL) || "";
			ele.data(DK_FORM_VALUE, this);
		},
		Jselect = function(ele) {
			this.name = ele.attr(AK_NAME) || ele.attr(AK_ID);
			if(!this.name) {
				throw "Attribute[name] is invalid";
			}
			this.readOnly = ele.hasClass(CC_READONLY);
			this.showOnly = ele.hasClass(CC_SHOWONLY);
			this.dictCode = ele.attr(AK_DICT_CODE);
			this.showInvalidItem = ele.attr("show-invalid-item");
			this.ele = ele;
			this.dv = ele.attr(AK_DEF_VAL) || "";
			this.isBool = ele.hasClass(CC_BOOL);
			this.isTree = ele.hasClass(CC_TREE);
			ele.data(DK_FORM_VALUE, this);
		},
		select_display = function(select, code, caption) {
			select.codeEle.val(code ? code : "");
			select.captionEle.text(code ? caption : "");
		},
		select_change = function(select, code) {
			if(select.codeEle.val() !== code) {
				select.codeEle.val(code);
				dict_apply(select.dictCode, function(dc) {
					var cap = code ? dict_get(dc, code) : "";
					select_display(select, cap ? code : null, cap);
				});
			}
		},
		Jmselect = function(ele) {
			this.name = ele.attr(AK_NAME) || ele.attr(AK_ID);
			if(!this.name) {
				throw "Attribute[name] is invalid";
			}
			this.readOnly = ele.hasClass(CC_READONLY);
			this.showOnly = ele.hasClass(CC_SHOWONLY);
			this.dictCode = ele.attr(AK_DICT_CODE);
			this.showInvalidItem = ele.attr("show-invalid-item");
			this.ele = ele;
			this.dv = [];
			var defV = ele.attr(AK_DEF_VAL);
			if(defV && defV != "[]") {
				this.dv = JSON.parse(defV);
			}
			this.isTree = ele.hasClass(CC_TREE);
			ele.data(DK_FORM_VALUE, this);
		},
		mselect_remove = function(e) {
			$(this).parent().remove();
		},
		mselect_add = function(mselect, code, init_add) {
			var found = false;
			if(!init_add) {
				mselect.captionEle.find(QF_SELECT_CAPTION).each(function() {
					if($(this).find(EN_INPUT).val() == code) {
						found = true;
						return false;
					}
				});
			}
			if(!found) {
				var $li = $("<li><div>x</div></li>");
				$li.addClass(CC_SELECT_CAPTION).append($(TK_HIDDEN_INPUT).val(code)).appendTo(mselect.captionEle);
				if((!mselect.readOnly) && (!mselect.showOnly)) {
					$li.children('div').on("click.jr_mselect_remove_api", mselect_remove);
				}
				dict_apply(mselect.dictCode, function(dict) {
					var cp = dict_get(dict, code);
					if(cp) {
						$li.append($(TK_SPAN).html(cp));
					} else {
						$li.append($("<span style='color:red;'></span>").html("error"));
					}
				});
				return true;
			}
		},
		mselect_change = function(mselect, value) {
			mselect.captionEle.empty();
			if(value && value.length) {
				for(var i = 0; i < value.length; ++i) {
					var cv = value[i];
					if(cv) {
						mselect_add(mselect, cv, true);
					}
				}
			}
		},
		select_buildListDrop = function(dict) {
			var $ul = $(TK_UL);
			for(var i = 0; i < dict.length; ++i) {
				var item = dict[i];
				if(item.enabled || this.showInvalidItem) {
					var $li = $("<li class='select-item'></li>");
					$li.attr(AK_CODE, item.code);
					$li.text(item.caption);
					$li.appendTo($ul);
				}
			}
			$ul.find(QF_SELECT_ITEM).on("click.jr_select_api", select_selectItem);
			return $ul;
		},
		select_buildTreeDrop = function(dict) {
			var $ul = $(TK_UL);
			for(var i = 0; i < dict.length; ++i) {
				var item = dict[i];
				if(item.enabled || this.showInvalidItem) {
					var $li = $(TK_LI);
					if(item.children && item.children.length) {
						var $ti = $("<a href='javascript:void(0)'><i class='icon'></a>");
						$ti.attr(AK_CODE, item.code).append($(TK_SPAN).text(item.caption));
						$li.addClass(CC_BRANCH_ITEM).append($ti).append(select_buildTreeDrop.call(this, item.children));
					} else {
						$li.addClass(CC_SELECT_ITEM).attr(AK_CODE, item.code).text(item.caption);
					}
					$li.appendTo($ul);
				}
			}
			$ul.find(QF_SELECT_ITEM).on("click.jr_select_api", select_selectItem);
			$ul.find(QF_BRANCH_ITEM).on("click.jr_select_api", select_branchItem);
			return $ul;
		},
		select_selectItem = function(e) {
			var $this = $(this);
			var select = $this.parents(QF_FORM_ITEM);
			if(select && select.length) {
				select = $(select).data(DK_FORM_VALUE);
				if(select && select.selectItem) {
					select.selectItem($this, e);
				}
			}
		},
		select_branchItem = function(evt) {
			$(this).toggleClass(CC_OPEN);
			evt.stopPropagation();
		},
		date_year = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		date_leapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		date_isleap = function(y) {
			return(y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
		},
		date_validDate = function(v) {
			if(v.length != 8) return false;
			for(var i = 0; i < 8; ++i) {
				var c = v.charAt(i);
				if(c > '9' || c < '0') return false;
			}
			var m = parseInt(v.substring(4, 6)) - 1;
			if(m < 0 || m > 11) return false;
			var d = parseInt(v.substring(6, 8));
			var ym = date_isleap(parseInt(v.substring(0, 4))) ? date_leapYear : date_year;
			if(d < 1 || d > ym[m]) return false;
			return true;
		},
		date_fmt = function(v) {
			return(v > 9 ? "" : "0") + v;
		},
		date_MS_IN_DAY = 24 * 60 * 60 * 1000,
		date_incDay = function(d) {
			return new Date(d.getTime() + date_MS_IN_DAY);
		},
		date_decDay = function(d) {
			return new Date(d.getTime() - date_MS_IN_DAY);
		},
		date_dayFmt = function(d) {
			return "" + d.getFullYear() + date_fmt(d.getMonth() + 1) + date_fmt(d.getDate());
		},
		date_now = function() {
			var d = new Date();
			return "" + d.getFullYear() + date_fmt(d.getMonth() + 1) + date_fmt(d.getDate()) + date_fmt(d.getHours()) + date_fmt(d.getMinutes()) + date_fmt(d.getSeconds());
		},
		date_change = function(date, val) {
			if(val) {
				if(val == "current") {
					val = date_now().substr(0, 8);
				}
				var dt = val.substring(0, 4) + "-" + val.substring(4, 6) + "-" + val.substring(6, 8);
				date.captionEle.text(dt);
				date.valEle.val(val);
			} else {
				date.valEle.val("");
				date.captionEle.text(date.nullVal ? date.nullVal : "");
			}
		},
		Jdate = function(ele) {
			this.name = ele.attr(AK_NAME) || ele.attr(AK_ID);
			if(!this.name) {
				throw "Attribute[name] is invalid";
			}
			this.readOnly = ele.hasClass(CC_READONLY);
			this.showOnly = ele.hasClass(CC_SHOWONLY);
			this.ele = ele;
			this.dv = ele.attr(AK_DEF_VAL);
			this.nullVal = ele.attr("nullVal");
			ele.data(DK_FORM_VALUE, this);
		},
		datetime_change = function(date, val) {
			if(val) {
				if(val == "current") {
					val = date_now();
				}
				var dt = val.sustring(0, 4) + "-" + val.substring(4, 6) + "-" + val.substring(6, 8) + " " + val.substring(8, 10) + ":" + val.substring(10, 12) + ":" + val.substring(12);
				date.captionEle.text(dt);
				date.valEle.val(val);
			} else {
				date.valEle.val("");
				date.captionEle.text(date.nullVal ? date.nullVal : "");
			}
		},
		Jdatetime = function(ele) {
			this.name = ele.attr(AK_NAME) || ele.attr(AK_ID);
			if(!this.name) {
				throw "Attribute[name] is invalid";
			}
			this.readOnly = ele.hasClass(CC_READONLY);
			this.showOnly = ele.hasClass(CC_SHOWONLY);
			this.ele = ele;
			this.dv = ele.attr(AK_DEF_VAL);
			this.nullVal = ele.attr("nullVal");
			ele.data(DK_FORM_VALUE, this);
		},
		FORM_ITEM_CREATER = [Jhidden, Jtext, Jselect, Jmselect, Jdate, Jdatetime, Jtextarea],

		serialize = function(obj, name, val, r) {
			var ret = r || "";
			var tn = $.type(val);
			if(tn == TN_BOOL) {
				ret = ret + name + "=" + (val ? "1" : "0") + "&";
			} else if(tn == TN_NUMBER) {
				ret = ret + name + "=" + val + "&";
			} else if(tn == TN_STRING) {
				if(val)
					ret = ret + name + "=" + encodeURIComponent(val) + "&";
			} else if(tn == TN_FNC) {
				ret = serialize(obj, name, val.call(obj), ret)
			} else if(tn == TN_ARRAY) {
				for(var i = 0; i < val.length; ++i) {
					ret = serialize(obj, name, val[i], ret);
				}
			} else if(tn == TN_OBJ) {
				ret = ret + name + "=" + encodeURIComponent(JSON.stringify(val)) + "&";
			}
			return ret;
		},
		g_form_uploader_file_ref = 1,
		upload_remove = function(form) {
			form.addClass("hide");
			setTimeout(function() { form.remove(); }, 1000);
		},
		upload_create = function(uploader) {
			var form, $form, finput, $file;
			form = doc.createElement("form");
			form.setAttribute("enctype", "multipart/form-data");
			form.setAttribute("class", "upload-form");
			form.setAttribute("testRef", "" + (new Date()).getTime());
			finput = doc.createElement("input");
			finput.setAttribute("type", "file");
			finput.setAttribute("name", "filename");
			if(uploader.accept) finput.setAttribute("accept", uploader.accept);
			form.appendChild(finput);
			$form = $(form);
			$file = $(finput);
			$file.on("change", function() {
				console.log("entry file change")
				var files = finput.files,
					file, fsize, xhr, formData, eobj, state;
				console.log("files.len=" + files.length);
				if(files.length) {
					file = files[0];
					fsize = file.size;
					if(uploader.maxSize && uploader.maxSize < fsize) {
						util.error("上传文件太大[size > " + fsize + "]");
						return;
					}
					$file.off("change");
					upload_remove($form);
					upload_create(uploader);
					var over = function() {
							xhr.onerror = null;
							xhr.onload = null;
							xhr.ontimeout = null;
							xhr.onabort = null;
							if(xhr.upload) xhr.upload.onprogress = null;
						},
						af = function() {
							if(!state) {
								xhr.abort();
								raiseError("abort");
							}
						},
						eContext = { name: file.name, size: file.size, type: file.type, abort: af },
						raiseError = function(er, data) {
							if(!state) {
								over();
								state = er;
								if(uploader.fail) uploader.fail.call(eContext, er, data);
							}
						},
						formData = new FormData(form);
					xhr = new XMLHttpRequest();
					xhr.onerror = function() {
						raiseError("error");
					};
					xhr.onabort = function() {
						raiseError("abort");
					};
					xhr.ontimeout = function() {
						raiseError("timeout");
					};
					xhr.onload = function() {
						if(!state) {
							if(xhr.status == 200) {
								var ro, rs = xhr.responseText;
								if(rs) {
									try {
										ro = JSON.parse(rs);
									} catch(err) {
										raiseError("parse", err);
									}
									if(ro.success) {
										over();
										state = "done";
										if(uploader.done) uploader.done.call(eContext, ro.data);
									} else {
										raiseError("logic", ro);
									}
								} else {
									raiseError("emptyResponseText");
								}
							} else {
								raiseError("invalidHttpStatus", xhr.statusText);
							}
						}
					};
					if(uploader.start) uploader.start.call(eContext);
					xhr.open("POST", uploader.uri);
					if(xhr.upload) xhr.upload.onprogress = function(event) {
						if(event.lengthComputable && uploader.notity) {
							uploader.notity.call(eContext, event.total, event.loaded);
						}
					};
					if(uploader.timeout) {
						try {
							xhr.timeout = uploader.timeout;
						} catch(er) {
							setTimeout(function() {
								raiseError("timeout");
							}, uploader.timeout);
						}
					}
					xhr.send(formData);
				}
			});
			$form.appendTo(uploader.ele);
		},
		upload_def_fail_hanler = function(etype, ep) {
			util.error("upload error[" + type + "]:" + (ep ? JSON.stringify(ep) : ""));
		},
		Jupload = function(pele) {
			this.ele = pele;
			console.log(pele)
			this.maxSize = parseInt(pele.attr("fileMaxSize") || "1048576");
			this.accept = pele.attr("accept");
			this.uri = pele.attr("uri");
			this.fail = upload_def_fail_hanler;
			pele.data(DK_FORM_VALUE, this);
		},
		Jform = function(ele) {
			this.items = {};
			var that = this;
			ele.find(QF_FORM_ITEM).each(function() {
				var $this = $(this);
				for(var i = 0; i < FORM_ITEM_CREATER.length; ++i) {
					var item = FORM_ITEM_CREATER[i].build($this);
					if(item) {
						that.items[item.name] = item;
						break;
					}
				}
			});
		},
		UploadPlugin = function(options) {
			if(this.length) {
				var ele = $(this[0]);
				var ret = ele.data(DK_FORM_VALUE);
				if(!ret) {
					ret = new Jupload(ele);
					if(options) {
						$.extend(ret, options);
					}
					upload_create(ret);
				}
				return ret;
			}
		},
		FormPlugin = function(val) {
			if(this.length) {
				var form = $(this[0]);
				var ret = form.data(DK_FORM_VALUE);
				if(!ret) {
					ret = new Jform(form);
					for(var key in ret.items) {
						ret.items[key].render();
					}
					if(val) {
						ret.init(val);
					}
					form.data(DK_FORM_VALUE, ret);
				}
				return ret;
			}
		},
		_version = "1.1";
	util.dictDisplay = dict_display;
	Jhidden.build = function(ele) {
		return ele.hasClass(CC_HIDDEN) ? new Jhidden(ele) : CK_FALSE;
	};
	Jtext.build = function(ele) {
		return ele.hasClass(CC_TEXT) ? new Jtext(ele) : CK_FALSE;
	};
	Jtextarea.build = function(ele) {
		return ele.hasClass("textarea") ? new Jtextarea(ele) : CK_FALSE;
	}
	Jselect.build = function(ele) {
		return ele.hasClass(CC_SELECT) ? new Jselect(ele) : CK_FALSE;
	};
	Jmselect.build = function(ele) {
		return ele.hasClass("mselect") ? new Jmselect(ele) : CK_FALSE;
	};
	Jdate.build = function(ele) {
		return ele.hasClass("date") ? new Jdate(ele) : CK_FALSE;
	};
	Jdatetime.build = function(ele) {
		return ele.hasClass("datetime") ? new Jdatetime(ele) : CK_FALSE;
	};
	$.extend(Jhidden.prototype, {
		val: function(val) {
			if(val) {
				this.value = val;
			} else {
				return this.value;
			}
		},
		reset: function() {
			return this.value = this.dv;
		},
		render: noop,
		validate: function() {
			return CK_TRUE
		},
		setDefaultValue: function(value) {
			this.dv = value;
		},
	});
	$.extend(Jtext.prototype, {
		render: function() {
			this.ele.empty();
			if(this.showOnly) {
				this.ele.html("");
			} else {
				this.valEle = $(TK_TEXT_INPUT);
				if(this.ele.hasClass("password")) {
					this.valEle.attr("type", "password");
				}
				var tmp = this.ele.attr(AK_PLACEHOLDER);
				if(tmp) this.valEle.attr(AK_PLACEHOLDER, tmp);
				if(this.readOnly) this.valEle.prop(AK_READONLY, AK_READONLY);
				this.valEle.appendTo(this.ele);
			}
			this.val(this.dv);
		},
		val: function(val) {
			if(arguments.length) {
				var ct = (val === null ? "" : ("" + val));
				this.showOnly ? this.ele.text(ct) : this.valEle.val(ct);
			} else if(!this.isShowOnly) {
				var v = this.valEle.val();
				v = this.trimed ? $.trim(v) : v;
				return this.dt == 0 ? v : (v ? (this.dt == 1 ? parseInt(v) : parseFloat(v)) : 0);
			}
		},
		reset: function() {
			if(arguments.length) {
				this.dv = arguments[0];
			} else {
				this.val(this.dv);
			}
		},
		validate: function() {
			//			var vtext = this.valEle.val();
			//			if(this.trimed && vtext) vtext = $.trim(vtext);
			//			if(this.ele.attr(AK_REQUIRED)) {
			//				if(!vtext) return "required";
			//			}
			return true;
		}
	});
	$.extend(Jtextarea.prototype, {
		render: function() {
			this.ele.empty();
			if(this.showOnly) {
				this.ele.html("");
			} else {
				this.valEle = $("<textarea></textarea>");
				this.valEle.attr("rows", this.ele.attr("rows") || "3");
				this.valEle.attr("cols", this.ele.attr("cols") || "20");
				var tmp = this.ele.attr(AK_PLACEHOLDER);
				if(tmp) this.valEle.attr(AK_PLACEHOLDER, tmp);
				if(this.readOnly) this.valEle.prop(AK_READONLY, AK_READONLY);
				this.valEle.appendTo(this.ele);
			}
			this.val(this.dv);
		},
		val: function(val) {
			if(arguments.length) {
				var ct = (val === null ? "" : ("" + val));
				this.showOnly ? this.ele.text(ct) : this.valEle.val(ct);
			} else if(!this.isShowOnly) {
				var v = this.valEle.val();
				return this.trimed ? $.trim(v) : v;
			}
		},
		reset: function() {
			if(arguments.length) {
				this.dv = arguments[0];
			} else {
				this.val(this.dv);
			}
		},
		validate: function() {
			//			var vtext = this.valEle.val();
			//			if(this.trimed && vtext) vtext = $.trim(vtext);
			//			if(this.ele.attr(AK_REQUIRED)) {
			//				if(!vtext) return "required";
			//			}
			return true;
		}
	});
	$.extend(Jselect.prototype, {
		render: function() {
			var that = this;
			this.ele.empty();
			if(!this.ele.hasClass(CC_DROP_DOWN_CONTAINER)) this.ele.addClass(CC_DROP_DOWN_CONTAINER);
			this.codeEle = $(TK_HIDDEN_INPUT).appendTo(this.ele);
			this.captionEle = $(TK_SPAN).appendTo($(TK_DD_HAND).appendTo(this.ele));
			var closeIcon = $("<i class='close'></i>");
			this.captionEle.parent().append(closeIcon);
			//this.ele.append(this.codeEle).append(this.captionEle);
			select_change(this, this.dv);
			if((!this.readOnly) && (!this.showOnly)) {
				this.selectItemEle = $(TK_DD_DROP).append($("<div class='select-loading'></div>"));
				this.selectItemEle.appendTo(this.ele);
				dict_apply(this.dictCode, function(dd) {
					that.selectItemEle.empty();
					if(that.dropItem) {
						that.dropItem.call(that, dd);
					} else {
						that.selectItemEle.append((that.isTree ? select_buildTreeDrop : select_buildListDrop).call(that, dd));
					}
				});
			}
			closeIcon.on("click", function() {
				that.codeEle.val("");
				that.captionEle.text("");
			});
		},
		val: function(val) {
			if(arguments.length) {
				select_change(this, this.isBool ? (true===val ? "1" :(false===val? "0":"")) : (val ? val : ""));
			} else if(!this.isShowOnly) {
				var v = this.codeEle.val();
				return this.isBool ? (v ? (v==='1') : CK_UNDEF) : (v ? v : CK_UNDEF);
			}
		},
		reset: function() {
			if(arguments.length) {
				var val = arguments[0];
				this.dv = this.isBool ? (val ? "1" : "0") : (val ? val : "")
			} else select_change(this, this.dv);
		},
		validate: function() {
			return true;
			//			var vtext = this.codeEle.val();
			//			if(this.ele.attr(AK_REQUIRED)) {
			//				if(!vtext) return "required";
			//			}
		},

		selectItem: function($item, evt) {
			var val = $item.attr(AK_CODE);
			select_change(this, val ? val : "");
		}
	});
	$.extend(Jmselect.prototype, {
		render: function() {
			this.ele.empty();
			if(!this.ele.hasClass(CC_DROP_DOWN_CONTAINER)) this.ele.addClass(CC_DROP_DOWN_CONTAINER);
			this.captionEle = $(TK_UL).appendTo($(TK_DD_HAND).appendTo(this.ele));
			mselect_change(this, this.dv);

			if((!this.readOnly) && (!this.showOnly)) {
				this.selectItemEle = $(TK_DD_DROP).append($("<div class='select-loading'></div>"));
				this.selectItemEle.appendTo(this.ele);
				dict_apply(this.dictCode, (function(that) {
					return function(dd) {
						that.selectItemEle.empty();
						if(that.dropItem) {
							that.dropItem.call(that, dd);
						} else {
							that.selectItemEle.append((that.isTree ? select_buildTreeDrop : select_buildListDrop).call(that, dd));
						}
					}
				})(this));
			}
		},
		val: function(val) {
			if(arguments.length) {
				mselect_change(this, val);
				return this;
			} else if(!this.isShowOnly) {
				var ret = [];
				this.captionEle.find(EN_INPUT).each(function() {
					ret.push($(this).val);
				})
				return ret;
			}
		},
		reset: function() {
			if(arguments.length) {
				var val = arguments[0];
				this.dv = val ? val : [];
			} else mselect_change(this, this.dv);
		},
		validate: returnTrue,
		selectItem: function($item, evt) {
			if(!mselect_add(this, $item.attr(AK_CODE)))
				evt.stopPropagation();
		}
	});
	$.extend(Jdate.prototype, {
		render: function() {
			this.ele.empty();
			if(!this.ele.hasClass(CC_DROP_DOWN_CONTAINER)) this.ele.addClass(CC_DROP_DOWN_CONTAINER);
			if(!this.ele.hasClass(CC_DROP_CLEAN)) this.ele.addClass(CC_DROP_CLEAN);
			this.valEle = $(TK_HIDDEN_INPUT);
			this.captionEle = $(TK_SPAN);
			var closeIcon = $("<i class='close'></i>");
			$(TK_DD_HAND).append(this.valEle).append(this.captionEle).append(closeIcon).appendTo(this.ele);
			date_change(this, this.dv);
			var that = this;
			closeIcon.on("click",function(){
				that.valEle.val("");
				that.captionEle.text("");
			});

		},
		val: function(val) {
			if(arguments.length) {
				date_change(this, val);
				return this;
			} else if(!this.isShowOnly) {
				var ret = this.valEle.val();
				return ret ? ret : CK_UNDEF;
			}
		},
		reset: function() {
			if(arguments.length) {
				this.dv = arguments[0];
			} else date_change(this, this.dv);
		},
		validate: returnTrue,
		show: function($ctn) {
			if(this.readOnly || this.showOnly) return;
			var val = this.valEle.val();
			var n = date_now();
			val = val ? (date_validDate(val) ? val : n) : n;
			var $div = $("<div class='dd-drop date'></div>").appendTo(this.ele);
			this.showDay($div, parseInt(val.substring(0, 4)), parseInt(val.substring(4, 6)) - 1);
		},
		showDay: function(div, y, m) {
			div.empty();
			var table = $("<table></table>").appendTo(div).addClass("day");
			table.attr("year", "" + y);
			table.attr("month", "" + (m + 1));
			var head = $("<thead></thead>").appendTo(table);
			var body = $("<tbody></tbody>").appendTo(table);
			var foot = $("<tfoot></tfoot>").appendTo(table);
			var caption = $("<tr><th class='prev-year'><i class='icon-arrow-left'></i></th><th class='prev-month'><i class='icon-chevron-left'></i></th><th colspan='3' class='switch'></th><th class='next-month'><i class='icon-chevron-right'></i></th><th class='next-year'><i class='icon-arrow-right'></i></th></tr><tr><th class='dow'>日</th><th class='dow'>一</th><th class='dow'>二</th><th class='dow'>三</th><th class='dow'>四</th><th class='dow'>五</th><th class='dow'>六</th></tr>").appendTo(head).find(".switch");
			caption.html(date_fmt(m + 1) + "月 " + y + "年");
			var dd = new Date();
			dd.setFullYear(y);
			dd.setMonth(m);
			dd.setDate(1);
			var dayInWeek = dd.getDay();
			var days = ["<tr>"];
			for(var i = 0; i < dayInWeek; ++i) {
				var cd = date_dayFmt(new Date(dd.getTime() - ((dayInWeek - i) * date_MS_IN_DAY)));
				days.push("<td class='no-current-month' day='" + cd + "'>" + cd.substring(6, 8) + "</td>");
			}
			var ld = date_isleap(y) ? date_leapYear[m] : date_year[m];
			for(var i = 0; i < ld; ++i) {
				var cd = date_dayFmt(dd);
				days.push("<td class='day-item' day='" + cd + "'>" + cd.substring(6, 8) + "</td>");
				if(dd.getDay() == 6) days.push("</tr><tr>");
				dd = date_incDay(dd);
			}
			dayInWeek = dd.getDay();
			if(dayInWeek) {
				for(var i = dayInWeek; i < 7; ++i) {
					var cd = date_dayFmt(dd);
					days.push("<td class='no-current-month' day='" + cd + "'>" + cd.substring(6, 8) + "</td>");
					dd = date_incDay(dd);
				}
			} else {
				days.pop();
			}
			days.push("</tr>");
			body.html(days.join(""));
		}
	});
	$.extend(Jform.prototype, {
		init: function(options) {
			if($.type(options) == TN_FNC) {
				options.call(this);
			} else {
				for(var key in options) {
					var io = this.items[key] || (this.items[key] = new Jhidden(key));
					io.val(options[key]);
				}
			}
		},
		item: function(name) {
			return this.items[name];
		},
		validate: function() {
			for(var key in this.items) {
				if(!this.items[key].validate()) return CK_FALSE;
			}
			return CK_TRUE;
		},
		reset: function(data) {
			if(data) {
				for(var key in data) {
					(this.items[key] || (this.items[key] = new Jhidden(key))).reset(data[key]);
				}
			} else {
				for(var key in this.items) {
					this.items[key].reset();
				}
			}
			return this;
		},
		val: function(data) {
			if(!data) {
				if(!this.validate()) return CK_FALSE;
				var ret = {};
				for(var key in this.items) {
					var val = this.items[key].val();
					if(val !== CK_UNDEF) {
						ret[key] = val;
					}
				}
				return ret;
			}
			for(var key in data) {
				(this.items[key] || (this.items[key] = new Jhidden(key))).val(data[key]);
			}
			return this;
		},
		queryString: function() {
			if(!this.validate()) return CK_FALSE;
			var qs = "";
			for(var key in this.items) {
				var obj = this.items[key];
				var val = obj.val();
				qs = serialize(obj, key, val, qs);
			}
			if(qs.length > 1) {
				qs.substr(0, qs.length - 1);
			}
			return qs;
		},
		get: function(url, data, check, eh) {
			if(CK_FALSE === data) return;
			var self = this;
			util.get(url, data, function(rd) {
				if(check(rd)) {
					self.reset();
					self.val(rd);
				}
			}, eh);
		},
		post: function(url, data, check, eh) {
			if(CK_FALSE === data) return;
			var self = this;
			util.post(url, data, function(rd) {
				if(check(rd)) {
					self.reset();
					self.val(rd);
				}
			}, eh);
		},
		doGet: function(url, sh, eh) {
			var data = this.val();
			if(data !== CK_FALSE) {
				util.get(url, data, sh, eh);
			}
		},
		doPost: function(url, sh, eh) {
			var data = this.val();
			if(data !== CK_FALSE) {
				util.post(url, data, sh, eh);
			}
		},
		doPut: function(url, sh, eh) {
			var data = this.val();
			if(data !== CK_FALSE) {
				util.put(url, data, sh, eh);
			}
		},
		doDel: function(url, sh, eh) {
			var data = this.val();
			if(data !== CK_FALSE) {
				util.del(url, data, sh, eh);
			}
		},
	});

	$.fn.form = FormPlugin;
	$.fn.form.Constructor = Jform;
	$.fn.upload = UploadPlugin;
	$.fn.upload.Constructor = Jupload;
	$.util = util;
	(function() {
		var DK_CODE_TEMPLATE_FUNC = "code_templat_func",
			reg_strikethrough_all = /-/g,
			g_codeRef = 1,
			qf = function(pnd) {
				var cr = pnd.children;
				for(var i = 0; i < cr.length; ++i) {
					var nd = cr[i];
					if(nd.nodeType == 1) {
						var $nd = $(nd);
						if($nd.hasClass("code-tpl")) {
							$nd.removeClass("code-tpl");
							return nd;
						}
						$nd = qf(nd);
						if($nd) return $nd;
					}
				};
				return null;
			},

			parseCodeTemplate = function(ele, handlers) {
				var hds = handlers;
				var childCode = null;
				while((childCode = qf(ele[0]))) {
					var $child = $(childCode);
					var key = $child.attr("code-func");
					if(key) {
						var cf = "_" + g_codeRef;
						++g_codeRef;
						hds[cf] = parseCodeTemplate($(childCode), hds);
						var ccode = "{{" + key + "-" + cf + "}}";
						if($child.hasClass("code-tag-hlod")) {
							$child.html(ccode);
						} else {
							//							console.log(childCode)
							//							console.log(childCode.parentNode);
							//doc.createTextNode("{{"+key+"-"+cf+"}}");
							//this.parentNode.replaceChild(this,doc.createTextNode("{{"+key+"-"+cf+"}}"));
							childCode.parentNode.insertBefore(document.createTextNode("{{" + key + "-" + cf + "}}"), childCode);
							//replaceChild(this,document.createTextNode("{{"+key+"-"+cf+"}}"));
							$child.remove();
						}
					}
				}
				var src = $.trim(ele.html());
				//				console.log(src);
				var ret = [],
					index = 0,
					len = src.length,
					b, e, ni;
				while(index < len) {
					b = src.indexOf('{{', index);
					if(b != -1) {
						ni = b + 2;
						var e = src.indexOf('}}', ni);
						if(e == -1) break;
						if(b > index) {
							ret.push({
								f: "_copy",
								k: null,
								sv: [src.substring(index, b)]
							});
						}
						if(e > ni) {
							var sh = src.substring(ni, e);
							var shlist = sh.split('-');
							var h = {
								pv: []
							};
							h.k = shlist[0];
							if(shlist.length == 1) {
								h.f = "toString";
							} else {
								h.f = shlist[1];
								for(var i = 2; i < shlist.length; ++i) {
									h.pv.push(shlist[i]);
								}
							}
							h.sv = sh;
							ret.push(h);
						}
						index = e + 2;
					} else {
						break;
					}
				}
				if(index < len) {
					ret.push({
						f: "_copy",
						k: null,
						sv: [src.substring(index, len)]
					});
				}
				//data
				return function(data, k, _index, pv, sv, hds) {
					var r = [];
					for(var i = 0; i < ret.length; ++i) {
						var h = ret[i];
						r.push((hds[h.f] || hds["_def"])(data, h.k, _index, h.pv, h.sv, hds));
						//.apply({"data":data,"key":h.k,"index":_index,"hds":hds}, h.pv));
					}
					return r.join("");
				}
			},
			hc_base_fnc = {
				"_def": function(data, key, _index, pv, sv, hds) {
					return "<!--" + sv.replace(reg_strikethrough_all, ' - ') + "-->";
				},
				"toString": function(data, key, _index, pv, sv, hds) {
					var v = data[key];
					return v ? v.toString() : (v === 0 ? "0" : (v === false ? "false" : ""));
				},
				"_copy": function(data, key, _index, pv, sv, hds) {
					return sv
				},
				"list": function(data, key, _index, pv, sv, hds) {
					var v = data[key] || [],
						fn = pv[0],
						r = [];
					if(v && v.length) {
						for(var i = 0; i < v.length; ++i) {
							var h = hds[fn] || hds["_def"];
							r.push(h(v[i], null, i, null, null, hds));
						}
					}
					return r.join("");
				},
				"emptylist": function(data, key, _index, pv, sv, hds) {
					var v = data[key] || [];
					if(!v.length) {
						return(hds[pv[0]] || hds["_def"])(data, null, null, null, null, hds);
					}
				},
				"[]": function(data, key, _index, pv, sv, hds) { return _index + 1 },
				"json": function(data, key, _index, pv, sv, hds) {
					return data ? (data[key] ? JSON.stringify(data[key]) : "") : "";
				},
				"bool": function(data, key) {
					return data ? (data[key] ? "是" : (data[key] === false ? "否" : "")) : "";
				},
			},
			HtmlCode = function(ele) {
				this.ele = ele;
				this.fnc = {};
				this.listener = [];
				$.extend(this.fnc, hc_base_fnc);
				ele.data(DK_CODE_TEMPLATE_FUNC, this);
			};

		$.extend(HtmlCode.prototype, {
			val: function(data) {
				if(!this.hand) {
					this.hand = parseCodeTemplate(this.ele, this.fnc);
				}
				this.ele.html(this.hand(data, null, -1, null, null, this.fnc));
				for(var i = 0; i < this.listener.length; ++i) {
					if(CK_FALSE === this.listener[i].call(this, data)) return;
				}
			},
			empty: function() {
				this.ele.empty();
			},
			shell: function(name, func) {
				if(name) {
					if(func) {
						this.fnc[name] = func;
					} else {
						return this.fnc[name];
					}
				} else {
					return this.fnc;
				}
			},
			addValueListener: function(h) {
				this.listener.push(h)
			},

		});
		var CodePlugin = function() {
			if(this.length) {
				var code = $(this[0]);
				var ret = code.data(DK_CODE_TEMPLATE_FUNC);
				if(!ret) {
					ret = new HtmlCode(code);
				}
				return ret;
			}
		};
		$.fn.code = CodePlugin;
		$.fn.code.Constructor = HtmlCode;
	})();
	(function() {
		var DK_DATA_TABLE = "dk_data_table",
			DataTable = function(ele) {
				this.ele = ele;
				this.codeRef = ele.find(".dt-tpl").code();
				this.formRef = ele.find(".dt-form").form();
				this.uri = ele.attr("loadUri");
				this.eh = true;
				this.ele.data(DK_DATA_TABLE, this);

			};
		$.extend(DataTable.prototype, {
			load: function() {
				var qd = this.formRef.val();
				if(qd === CK_FALSE) return;
				if(this.ch) {
					this.ch === true ? this.codeRef.empty() : this.ch();
				}
				var self = this;
				util.get(self.uri, qd, function(data) {
					self.codeRef.val({ "data": data, "length": data ? data.length : 0 });
				}, self.eh);
			},
			error: function(eh) {
				this.eh = eh;
			},
			beforLoad: function(ch) { this.ch = ch }
		});
		var DataTablePlugin = function() {
			if(this.length) {
				var dt = $(this[0]);
				var ret = dt.data(DK_DATA_TABLE);
				if(!ret) {
					ret = new DataTable(dt);
				}
				return ret;
			}
		}
		$.fn.dg = DataTablePlugin;
		$.fn.dg.Constructor = DataTable;
		var DK_PAGE_DATA_TABLE = "dk_page_data_table",
			pdt_pager_builder = function(data) {
				if(data.total) {
					var pages = Math.ceil(data.total / data.pageSize),
						no = data.pageNo,
						i = no - 2,
						hc = [];
					hc.push("<li class='");
					if(no > 1) {
						hc.push("active' no='" + (no - 1) + "'");
					} else {
						hc.push("disabled'");
					}
					hc.push("><a href='javascript:;'>«</a></li>");
					hc.push("<li class='" + (no == 1 ? "curr'" : "active' no='1'") + "><a href='javascript:;'>1</a></li>");
					if(no > 4) hc.push("<li><a href='javascript:;'>...</a></li>");
					for(i = Math.max(2, no - 2); i < no; ++i) {
						hc.push("<li class='active' no='" + i + "'><a href='javascript:;'>" + i + "</a></li>");
					}
					if(no != 1) {
						hc.push("<li class='curr'><a href='javascript:;'>" + no + "</a></li>");
					}
					i = no + 1;
					var min = Math.min(pages, no + 3);
					for(; i < min; ++i) {
						hc.push("<li class='active' no='" + i + "'><a href='javascript:;'>" + i + "</a></li>");
					}
					if(pages - no > 3) hc.push("<li><a href='javascript:;'>...</a></li>");
					if(pages != no) hc.push("<li class='active' no='" + pages + "'><a href='javascript:;'>" + pages + "</a></li>");
					hc.push("<li class='");
					if(no != pages) {
						hc.push("active' no='" + (no + 1) + "'");
					} else {
						hc.push("disabled'");
					}
					hc.push("><a href='javascript:;'>»</a></li>");
					this.pagerEle.html(hc.join(""));
					var self = this;
					this.pagerEle.children("li.active").on("click", function() {
						self.goPage(parseInt($(this).attr("no")));
					});
				} else {
					this.pagerEle.empty();
				}
			},
			pdt_build_pageIndex = function(data, key, pageSize, pageNo) {
				var bi = pageSize * (pageNo - 1) + 1;
				for(var i = 0; i < data.length; ++i) {
					data[i][key] = bi++;
				}
			},
			PageDataTable = function(ele) {
				this.ele = ele;
				this.codeRef = ele.find(".dt-tpl").code();
				this.formRef = ele.find(".dt-form").form();
				this.pagerEle = ele.find(".dt-pager");
				this.uri = ele.attr("loadUri");
				this.pagerPrefix = ele.attr("pagerPrefix") ? "_" : "";
				this.pageSize = parseInt(ele.attr("pageSize") || "1");
				this.pageNo = parseInt(ele.attr("pageNo") || "10");
				this.ph = pdt_pager_builder;
				this.ele.data(DK_PAGE_DATA_TABLE, this);
				this.eh = true;
				this.pageIndex = ele.attr("pageIndex");
			};
		$.extend(PageDataTable.prototype, {
			error: function(eh) { this.eh = eh },
			beforLoad: function(ch) { this.ch = ch },
			load: function() {
				var qd = this.formRef.val();
				if(qd === CK_FALSE) return;
				this.cache = qd || {};
				this.cache[this.pagerPrefix + "pageNo"] = this.pageNo;
				this.cache[this.pagerPrefix + "pageSize"] = this.pageSize;
				this.reload();
			},
			reload: function() {
				if(this.ch) {
					this.ch === true ? (this.codeRef.empty() || this.pagerEle.empty()) : this.ch();
				}
				var self = this;
				util.get(self.uri, this.cache, function(data) {
					self.total = data.total;
					data.length = data.data.length;
					if(self.pageIndex) {
						pdt_build_pageIndex(data.data, self.pageIndex, data.pageSize, data.pageNo);
					}
					self.codeRef.val(data);
					self.ph(data);
				}, self.eh);
			},
			goPage: function(pageNo, pageSize) {
				this.cache[this.pagerPrefix + "pageNo"] = pageNo;
				this.cache[this.pagerPrefix + "pageSize"] = (pageSize || this.cache[this.pagerPrefix + "pageSize"]);
				this.reload();
			},
			buildPager: function(ph) { this.ph = ph }
		});
		var PageDataTablePlugin = function() {
			if(this.length) {
				var dt = $(this[0]);
				var ret = dt.data(DK_PAGE_DATA_TABLE);
				if(!ret) {
					ret = new PageDataTable(dt);
				}
				return ret;
			}
		}
		$.fn.pdg = PageDataTablePlugin;
		$.fn.pdg.Constructor = PageDataTable;
	})();

	(function() {
		var spa_modal_index = 0,
			spa_load_res = function() {
				var self = this;
				if(this.resUri) {
					util.get(self.resUri, null, function(data) {
						/**
						 * res =[{id:"",uri:"",css:"",script:""},{id:"",uri:"",css:"",script:""},...........]
						 */
						self.res = {};
						for(var i = 0; i < data.length; ++i) {
							var item = data[i];
							self.res[item.id] = item;
						}
						if(self.menuUri) {
							spa_load_menu.call(self);
						} else {
							self.showMain();
						}
					}, {})
				}
			},
			spa_load_menu = function() {
				var self = this;
				util.get(this.menuUri, null, function(menu) {
					self.menu = menu;
					spa_build_menu.call(self);
					self.showMain();
				}, function(errCode, errMsg, errDetailMsg) {
					util.error("load spa menu data error");
				});
			},
			spa_build_menu = function() {
				if(this.menuEle && this.menu) {
					var pEle = $("<ul class='nav nav-root'></ul>");
					spa_build_menu_item(this, pEle, this.menu);
					pEle.appendTo(this.menuEle);
					var self = this;
					this.menuEle.find(".nav-hand").on("click", function(e) {
						var $this = $(this);
						pEle.find(".nav-hand.active").removeClass("active");
						$this.addClass("active");
						if($this.hasClass("spa-modal")) {
							self.showModal($this.attr("res"));
						} else {
							location.hash = "#" + $this.attr("res");
							self.showMain();
						}
					});
					this.menuEle.find(".nav-branch-hand").on("click", function(e) {
						var prt = $(this).parent();
						if(prt.hasClass("open")) {
							prt.removeClass("open");
						} else {
							prt.parent().children(".open").removeClass("open");
							prt.addClass("open");
						}
					});
				}
			},
			spa_build_menu_item = function(that, pEle, items) {
				var item, res, caption, iconClass;
				for(var i = 0; i < items.length; ++i) {
					item = items[i];
					var $li = $("<li></li>");
					var $a = $("<a href='javascript:;'></a>").appendTo($li);
					caption = item.caption;
					iconClass = item.icon || (item.res ? "book" : "branch");
					$a.html("<i class='icon-" + iconClass + "'></i>" + caption);
					if(item.res) {
						$a.attr("res", item.res).addClass("nav-hand");
						if(item.modal) {
							$a.addClass("spa-modal");
						}
					} else {
						$a.append($("<i class='icon fold'></i>")).addClass("nav-branch-hand");
						$li.addClass("nav-parent");
						var $ul = $("<ul class='nav'></ul>").appendTo($li);
						spa_build_menu_item(that, $ul, item.children);
					}
					$li.appendTo(pEle);
				}
			},
			spa_loadModelCss = function(model) {
				if(model.css) {
					var found = false;
					$("link").each(function() {
						if(model.css == this.getAttribute("href")) {
							var ref = parseInt(this.getAttribute("spa-css-ref") || "1");
							this.setAttribute("spa-css-ref", "" + (ref + 1));
							found = true;
							return false;
						}
					});
					if(!found) {
						var link = doc.createElement('link');
						link.rel = 'stylesheet';
						link.href = model.css;
						link.media = 'all';
						link.setAttribute("spa-css-ref", "1");
						head.appendChild(link);
					}
				}
			},
			spa_showMainInternal = function(model) {
				spa_cleanMain.call(this);
				this.main = model;
				if(model.css) spa_loadModelCss.call(this, model);
				if(model.html) this.mainEle.html(model.html);
				this.mainEle.attr("spa-model-id", model.id);
				if(model.factory && model.factory.main) {
					model.factory.main.call(this);
				}
			},
			spa_showModalInternal = function(model, data) {
				if(model.css) spa_loadModelCss.call(this, model);
				var ly = util.createModalLayer(model.html);
				++spa_modal_index;
				//				console.log(ly.ctn)
				ly.ctn.addClass("spa-modal").addClass("spa-modal-index-" + spa_modal_index).attr("spa-model-id", model.id);
				if(model.factory && model.factory.modal) {
					model.factory.modal.call(this, data);
				}
			},
			spa_cacheModel = function(model) {
				var m = this.cache[model.id] = {};
				m.html = model.html;
				m.factory = model.factory;
				m.css = model.css;
				m.id = model.id;
				m.data = model.data;
				delete this.res[model.id];
				return m;
			},
			spa_afterLoadByMain = function(model, data) {
				spa_showMainInternal.call(this, spa_cacheModel.call(this, model));
			},
			spa_afterLoadByModal = function(model, data) {
				spa_showModalInternal.call(this, spa_cacheModel.call(this, model), data);
			},
			spa_loadModel = function(model, handler, data) {
				var self = this;
				if(model.html) {
					model.state = 11;
					if(model.script) {
						spa_loadModelScript.call(self, model, handler, data);
					} else {
						handler.call(self, model, data);
					}
				} else if(model.uri) {
					util.showLoading();
					model.state = 10;
					$.ajax({ url: model.uri, dataType: "html", type: "GET" }).done(function(hc) {
						model.state = 11;
						model.html = hc;
						util.hideLoading();
						if(model.script) {
							spa_loadModelScript.call(self, model, handler, data);
						} else {
							handler.call(self, model, data);
						}
					}).fail(function() {
						model.state = 12;
						util.hideLoading();
						util.error("load resource[" + model.id + "] html error");
					});
				}
			},
			spa_removeModelCss = function(model) {
				if(model.css) {
					$("link").each(function() {
						if(model.css == this.getAttribute("href")) {
							var ref = parseInt(this.getAttribute("spa-css-ref") || "1");
							if(ref == 1) {
								this.parentNode.removeChild(this);
							} else {
								this.setAttribute("spa-css-ref", "" + (ref - 1));
							}
						}
					});
				}
			},
			spa_loadModelScript = function(model, handler, data) {
				var self = this;
				model.factory = this.scriptCache[model.script];
				if(model.factory) {
					model.state = 31;
					handler.call(this, model, data);
					return;
				}
				var node = doc.createElement(EN_SCRIPT);
				node.async = CK_TRUE;
				node.src = model.script;
				node.charset = "UTF-8";
				var supportOnload = "onload" in node;
				util.showLoading();
				window.spa_define = function(factoryBuilder) {
					model.state = 30;
					util.showLoading();
					try {
						self.scriptCache[model.script] = model.factory = factoryBuilder.call(null, self);
						model.state = 31;
						util.hideLoading();
					} catch(error) {
						model.state = 32;
						util.hideLoading();
						util.error("init model[" + model.id + "] error");
					}
					handler.call(self, model, data);
				}

				if(supportOnload) {
					node.onload = function() {
						if(model.state < 21) model.state = 21;
						node.onerror = null;
						node.onload = null;
						head.removeChild(node);
						util.hideLoading();
					};
					node.onerror = function() {
						if(model.state < 22) {
							model.state = 22;
							util.error("load script error:" + model.script);
							node.onload = null;
							node.onerror = null;
						}
						head.removeChild(node);
						util.hideLoading();
					};
				} else {
					node.onreadystatechange = function() {
						if(/loaded|complete/.test(node.readyState)) {
							node.onreadystatechange = null;
							if(model.state < 21) {
								model.state = 21;
								var to = model.timeout || 1000;
								setTimeout(function() {
									if(model.state == 21) {
										model.state = 22;
										util.error("load script error:" + model.script);
										head.removeChild(node);
										util.hideLoading();
									}
								}, model.timeout || 1000);
							} else {
								head.removeChild(node);
								util.hideLoading();
							}
						}
					};
				}
				model.state = 20;
				baseElement ?
					head.insertBefore(node, baseElement) :
					head.appendChild(node);
			},
			spa_cleanMain = function() {
				if(this.main) {
					spa_removeModelCss.call(this, this.main);
					if(this.main.factory && this.main.factory.mainDestory) this.main.factory.mainDestory.call(this);
					this.mainEle.empty();
				}
			},

			SPA = function(ele) {
				this.ele = ele;
				ele.data(DK_FORM_VALUE, this);
				this.menuEle = ele.find(".spa-menu");
				this.mainEle = ele.find(".spa-main");
				this.menuUri = ele.attr("menu");
				this.resUri = ele.attr("resource");
				this.cache = {};
				this.scriptCache = {};
			};

		$.extend(SPA.prototype, {
			init: function() {
				spa_load_res.call(this);
			},
			getModel: function(id) {
				return this.cache ? this.cache[id] : this.res[id];
			},
			showModal: function(id, data) {
				if(this.cache[id]) {
					spa_showModalInternal.call(this, this.cache[id], data);
				} else {
					var model = this.res[id];
					if(model) {
						spa_loadModel.call(this, model, spa_afterLoadByModal, data);
					} else {
						util.error("invalid resource id[" + id + "]");
					}
				}
			},
			showMain: function() {
				var id = location.hash;
				if(id && id.length > 1) {
					id = id.substring(1);
				} else return;
				if(this.main && id == this.main.id) return;
				if(this.cache[id]) {
					spa_showMainInternal.call(this, this.cache[id]);
				} else {
					var model = this.res[id];
					if(model) {
						spa_loadModel.call(this, model, spa_afterLoadByMain);
					} else {
						util.error("invalid resource id[" + id + "]");
					}
				}
			},
			getLastModalIndex: function() {
				return spa_modal_index;
			},
			getLastModalCtn: function() {
				return $(".spa-modal-index-" + spa_modal_index);
			},
			getLastModalModel: function() {
				var ctn = $(".spa-modal-index-" + spa_modal_index);
				var id = modalCtn.attr("spa-model-id");
				return getModel(id);
			},
			closeModal: function() {
				var ctn = $(".spa-modal-index-" + spa_modal_index);
				var id = ctn.attr("spa-model-id");
				var inx = _g_layer_curr.index + 1;
				if(ctn.hasClass("layer-" + inx)) {
					var model = this.cache ? this.cache[id] : this.res[id];
					if(model) {
						if(model.factory.modalDestory) model.factory.modalDestory.call(this);
						if(model.css) spa_removeModelCss.call(this, model);
						--spa_modal_index;
						util.closeModalLayer();
					}
				} else {
					util.error("can't close modal:has top layer ");
				}
			}
		});

		$.buildSpa = function() {
			var sbody = $("body");
			if(sbody.length == 1 && sbody.hasClass("spa-page")) {
				$.spa = new SPA(sbody);
				$.spa.init();
			}
		};
	})();
	$(doc).on("click.jr_dropdown_api", dd_clearMenus);
	$(doc).on("click.jr_dropdown_api", QF_DROP_DOWN_HAND, dd_toggle);

	$(doc).on("show.jr.dropdown", ".dd-ctn.date,.dd-ctn.datetime,.dd-ctn.time", function() {
		var $dateCtn = $(this);
		var date = $dateCtn.data(DK_FORM_VALUE);
		if(date && date.show) {
			date.show();
		}
	});
	$(doc).on("click", ".dd-ctn.date .day .day-item ,.dd-ctn.date .day .no-current-month", function() {
		var $this = $(this);
		var $dateCtn = $this.parents(".dd-ctn.date");
		var date = $dateCtn.data(DK_FORM_VALUE);
		if(date && date.val && $this.attr("day")) {
			date.val($this.attr("day"));
		}
	});
	$(doc).on("click", ".day .prev-year", function(e) {
		var $this = $(this);
		var table = $this.parents("table");
		if(table) {
			var year = table.attr("year");
			if(year) {
				var month = table.attr("month");
				if(month) {
					month = parseInt(month) - 1;
					year = parseInt(year) - 1;
					var dddrop = table.parents(".dd-drop.date");
					if(dddrop) {
						$ddc = dddrop.parents(".dd-ctn");
						if($ddc) {
							var date = $ddc.data(DK_FORM_VALUE);
							if(date && date.showDay) {
								date.showDay(dddrop, year, month);
								e.stopPropagation();
							}
						}
					}
				}
			}
		}
	});
	$(doc).on("click", ".day .prev-month", function(e) {
		var $this = $(this);
		var table = $this.parents("table");
		if(table) {
			var year = table.attr("year");
			if(year) {
				var month = table.attr("month");
				if(month) {
					month = parseInt(month) - 1;
					year = parseInt(year);
					if(month > 0) {
						month--;
					} else {
						year--;
						month = 11;
					}
					var dddrop = table.parents(".dd-drop.date");
					if(dddrop) {
						$ddc = dddrop.parents(".dd-ctn");
						if($ddc) {
							var date = $ddc.data(DK_FORM_VALUE);
							if(date && date.showDay) {
								date.showDay(dddrop, year, month);
								e.stopPropagation();
							}
						}
					}
				}
			}
		}
	});
	$(doc).on("click", ".day .next-year", function(e) {
		var $this = $(this);
		var table = $this.parents("table");
		if(table) {
			var year = table.attr("year");
			if(year) {
				var month = table.attr("month");
				if(month) {
					month = parseInt(month) - 1;
					year = parseInt(year) + 1;
					var dddrop = table.parents(".dd-drop.date");
					if(dddrop) {
						$ddc = dddrop.parents(".dd-ctn");
						if($ddc) {
							var date = $ddc.data(DK_FORM_VALUE);
							if(date && date.showDay) {
								date.showDay(dddrop, year, month);
								e.stopPropagation();
							}
						}
					}
				}
			}
		}
	});
	$(doc).on("click", ".day .next-month", function(e) {
		var $this = $(this);
		var table = $this.parents("table");
		if(table) {
			var year = table.attr("year");
			if(year) {
				var month = table.attr("month");
				if(month) {
					month = parseInt(month) - 1;
					year = parseInt(year);
					if(month == 11) {
						year++;
						month = 0;
					} else {
						month++;
					}
					var dddrop = table.parents(".dd-drop.date");
					if(dddrop) {
						$ddc = dddrop.parents(".dd-ctn");
						if($ddc) {
							var date = $ddc.data(DK_FORM_VALUE);
							if(date && date.showDay) {
								date.showDay(dddrop, year, month);
								e.stopPropagation();
							}
						}
					}
				}
			}
		}
	});
	$(doc).on("click", ".click-hide-parent", function() {
		$(this).parent().hide();
	});
}(jQuery);