if(typeof jQuery === 'undefined') {
	throw new Error('this JavaScript requires jQuery')
} +

!(function($, win, doc) {
	var mds = {};
	mds["jQuery"] = $;
	mds["win"] = win;
	mds["doc"] = doc;
	mds["body"] = $("body");
	$.define = function(deps, id, factory) {
		var dm = [];
		for(var i = 0; i < deps.length; ++i) {
			var dep = mds[deps[i]];
			if(dep) {
				dm.push(dep);
			} else {
				throw new Error("no found model [" + deps[i] + "]");
			}
		}
		try {
			var md = factory.apply(win, dm);
			mds[id] = md;
			return md;
		} catch(err) {
			throw new Error("build model[" + id + "] error:"+err);
		}
	};
	$.use = function(deps, handle) {
		var dm = [];
		for(var i = 0; i < deps.length; ++i) {
			var dep = mds[deps[i]];
			if(dep) {
				dm.push(dep);
			} else {
				throw new Error("no found model [" + deps[i] + "]");
			}
		}
		return handle.apply(win, dm);
	};

	$.define(["jQuery", "body", "win", "doc"], "util", function($,body, win, doc) {
		var rclass = /[\t\r\n\f]/g,
			noop = function() {},
			valCache ={},
			infoDiv = $("#g_info"),
			errDiv = $("#g_err"),
			warnDiv = $("#g_warn"),
			msgDiv = $("#g_msg"),
			err_msg = {},
			layer_curr = {
				index: 5000000,
				remove: noop,
				css: noop
			},
			layer_remove = function() {
				this.shade.remove();
				this.ctn.empty();
				this.ctn.remove();
				this.prev.css("display", "block");
				layer_curr = this.prev;
			},
			hideMsg = function(e) {
				$(this).parent().hide();
			},
			bindHide = function($p) {
				$p.find(".click-hide-parent").on("click", hideMsg);
			},
			fillContent = function($c /* child node [String|Function｜jQObj] */ , $p) {
				if($c) {
					if(typeof $c === "string") {
						$p.html($c);
					} else if(typeof $c == "function") {
						$c.call($p);
					} else if($c.jquery) {
						$p.append($c);
					}
				}
			},
			modal = function(ctn) {
				var inx = layer_curr.index + 2,
					ly = {
						index: inx,
						remove: layer_remove,
						prev: layer_curr
					};
				ly.shade = $(
					"<div class='layer-shade layer-" + inx + "' style='z-index:" +
					inx + ";'></div>").appendTo(body);
				++inx;
				ly.ctn = $(
					"<div class='layer-ctn layer-" + inx + "' style='z-index:" +
					inx + ";'></div>").appendTo(body);
				ly.prev = layer_curr;
				layer_curr = ly;
				fillContent(ctn, ly.ctn);
				return ly;
			},
			rmModal = function() {
				layer_curr.remove();
			},

			// function error message
			errMsg = function($c, $t) {
				var $e = $(
						"<div class='err-ctn'><i class='icon click-hide-parent'></i></div>")
					.appendTo(errDiv);
				$("<span></span>").appendTo($e).html($c);
				bindHide($e);
				setTimeout(function() {
					$e.remove()
				}, $t ? $t : 10000);
			},
			// function warn message
			warnMsg = function($c, $t) {
				var $w = $(
						"<div class='warn-ctn'><i class='icon click-hide-parent'></i></div>")
					.appendTo(warnDiv);
				$("<span></span>").appendTo($w).html($c);
				bindHide($w);
				setTimeout(function() {
					$w.remove()
				}, $t ? $t : 3000);
			},
			msg = function($c, $t) {
				var $m = $(
						"<div class='warn-ctn'><i class='icon click-hide-parent'></i></div>")
					.appendTo(warnDiv);
				$("<span></span>").appendTo($w).html($c);
				bindHide($m);
				setTimeout(function() {
					$w.remove()
				}, $t ? $t : 3000);
			},
			loadref = 0,
			loadingDiv = $("#g_loading"),
			loading = function() {
				++loadref;
				if(loadref === 1) {
					loadingDiv.show()
				}
			},
			unLoading = function() {
				--loadref;
				if(loadref === 0) {
					loadingDiv.hide()
				}
			},
			alertMsg = function(title, content, hand) {
				if(content) {
					if($.isFunction(content)) {
						hand = content;
						content = title;
						title = "提示";
					}
				} else {
					content = title;
					title = "提示";
				}
				hand = hand || noop;
				var ly = modal('<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title"></h4></div><div class="modal-body"><p></p></div><div class="modal-footer"><button type="button" class="btn">关闭</button></div></div></div>');
				ly.ctn.find(".modal-title").text(title);
				$c = ly.ctn.find("p").text(content);
				ly.ctn.find("button").on("click", function() {
					rmModal();
					hand();
				});
			},
			bm_addBtn = function($p, $cp, $h) {
				var $b = $('<button type="button" class="btn"></button>').appendTo($p);
				$b.text($cp).on("click", function() {
					rmModal();
					$h();
				});
			},
			boxMsg = function(obj) {
				var ly = modal('<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title"></h4></div><div class="modal-body"><p></p></div><div class="modal-footer"></div></div></div>');
				ly.ctn.find(".modal-title").text(obj.title || "确认");
				ly.ctn.find("p").text(obj.content);
				var m_footer = ly.ctn.find(".modal-footer");
				for(var i = 0; i < obj.btns.length; ++i) {
					bm_addBtn(m_footer, obj.btns[i].caption || "no name", obj.btns[i].hand ||
						noop);
				}
			},
			serInArray = function(val, key, ret) {
				var t = $.type(val);
				if("boolean" === t) {
					ret.push(key + "=" + (val ? "1" : "0"));
				} else if("string" === t) {
					if(val) {
						ret.push(key + "=" + encodeURIComponent(val));
					}
				} else if("number" === t) {
					ret.push(key + "=" + val);
				} else {
					ret.push(key + "=" + encodeURIComponent(JSON.stringify(val)));
				}
			},
			serialize = function(obj) {
				var ret = [];
				if(obj) {
					for(key in obj) {
						var val = obj[key];
						var t = $.type(val);
						if("boolean" === t) {
							ret.push(key + "=" + (val ? "1" : "0"));
						} else if("string" === t) {
							if(val) {
								ret.push(key + "=" + encodeURIComponent(val));
							}
						} else if("number" === t) {
							ret.push(key + "=" + val);
						} else if("array" === t) {
							val.forEach(function(item) {
								serInArray(item, key, ret);
							});
						} else if("object" === t) {
							ret.push(key + "=" + encodeURIComponent(JSON.stringify(val)));
						}
					}
				}
				return ret.join("&");
			},
			g_def_err_hand = function(ep) {
				errMsg("http access error:\r\n" + JSON.stirngify(ep));
			},
			g_err = {
				"defErrHand": function(ep) {
					errMsg(JSON.stringify(ep));
				},
				"0": "未定义的错误",
				"1": function() {
					window.location.href = "login.html#" + encodeURIComponent(window.location.href);
				},
			},
			/**
			 * ep={code:"",msg:"",detailMsg:"",url:""} pa=function(code,msg,detailMsg)
			 * pa=boolean
			 */
			defErrHand = function(errparam, errHand) {
				if(errHand) {
					var pt = $.type(errHand);
					if(pt == "booean") {
						g_def_err_hand(errparam);
					} else if(pt == "function") {
						errHand(errparam);
					} else {
						var ph = errHand[errparam.code] || g_err[errparam.code] || errHand["defErrHand"] ||
							g_err["defErrHand"];
						if(typeof ph === "string") {
							errMsg(ph);
						} else {
							ph(errparam);
						}
					}
				} else {
					var ph = g_err[errparam.code] || g_err["defErrHand"];
					if(typeof ph === "string") {
						errMsg(ph);
					} else {
						ph(errparam);
					}
				}
			},
			ajaxAccess = function(method, pUrl, pData, sh, eh, config) {
				config = config || {};
				if(false !== config.mask) {
					loading();
				}
				config.traditional = true;
				config.type = method;
				config.url = pUrl, config.data = pData;
				config.contentType = method === "put" ? "application/json" : "application/x-www-form-urlencoded";
				config.success = function(rd) {
					if(rd.success) {
						sh(rd.data);
					} else {
						rd.code = "" + rd.code;
						rd.url = pUrl;
						defErrHand(rd, eh);
					}
				};
				config.error = function(jqXHR, textStatus, errorThrown) {
					defErrHand({
						code: "err_" + (textStatus || ""),
						msg: textStatus,
						detailMsg: textStatus,
						xhr: jqXHR,
						eObj: errorThrown,
						url: pUrl
					}, eh);
				};
				$.ajax(config).always(false !== config.mask ? unLoading : noop);
			},
			buildElement = function(pe, obj) {
				if($.isArray(obj)) {
					obj.forEach(function(item) {
						buildElement(pe, item);
					});
				} else {
					var e;
					if(typeof obj === 'string') {
						e = doc.createTextNode(obj);
						pe.appendChild(e);
					} else {
						e = doc.createElement(obj.tn);
						pe.appendChild(e);
						if(obj.attrs && obj.attrs.length) {
							obj.attrs.forEach(function(attr) {
								e.setAttribute(attr.an, attr.av);
							});
						}
						if(obj.chs && obj.chs.length) {
							obj.chs.forEach(function(ch) {
								buildElement(e, ch);
							});
						}
					}
				}
			},

		ret= {
			classCheck: function(ele, clses) {
				var ret = {},
					cs = " " + (ele.getAttribute("class") || "") + " ",
					cls;
				for(var i = 0; i < clses.length; ++i) {
					var cls = clses[i];
					ret[cls] = cs.indexOf(" " + cls + " ") > -1;
				}
				return ret;
			},
			showModal: modal,
			closeModal: rmModal,
			showLoading: loading,
			hideLoading: unLoading,
			listModalIndex: function() {
				return layer_curr.index + 1;
			},
			error: errMsg,
			warn: warnMsg,
			msg: msg,
			alert: alertMsg,
			boxMsg: boxMsg,
			confirm: function(msg, yes, no) {
				bm({
					content: msg,
					btns: [{
						caption: "取消",
						hand: no || noop
					}, {
						caption: "确认",
						hand: yes
					}]
				});
			},
			get: function(url, data, sh, eh, config) {
				ajaxAccess("GET", url, data, sh, eh, config);
			},
			post: function(url, data, sh, eh, config) {
				ajaxAccess("POST", url, data, sh, eh, config);
			},
			put: function(url, data, sh, eh, config) {
				ajaxAccess("PUT", url, data ? JSON.stringify(data) : null, sh, eh,
					config);
			},
			del: function(url, sh, eh, pObj) {
				ajaxAccess("DELETE", url, null, sh, eh,pObj);
			},
			noop: noop,
			nochange: function(d) { return d },
			returnTrue: function() {
				return true;
			},
			returnFalse: function() {
				return false;
			},
			addRules: function(target, rule) {
				var te = $.type(rule);
				if("function" === te) {
					target.push(rule);
				} else if("array" === te) {
					rule.forEach(function(item){target.push(item)});
				}
			},
			validate: function(rules, obj) {
				for(var i = 0; i < rules.length; ++i) {
					var ret = rules[i](obj);
					if(ret) {
						if(obj.invalid) {
							obj.invalid(ret);
						}
						return false;
					}
				}
				if(obj.valid) {
					obj.valid();
				}
				return true;
			},
			valid: function($e) {
				$e.removeClass("invalid");
			},
			invalid: function($e) {
				$e.addClass("invalid");
			},
			appendChild: function(e, obj) {
				var docf = doc.createDocumentFragment();
				buildElement(docf, obj);
				e.appendChild(docf);
			},
			serialize: serialize,
			data:function(k,v){
				if(arguments.length>1){
					valCache[k]=v;
				}else if(k){
					return valCache[k];
				}
			},
			raise:function(err){defErrHand(err)}
		};
		$.util=ret;
		return ret;
	});
})(jQuery, window, document);