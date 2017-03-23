$.define(["jQuery", "body", "win","doc"], "util", function($, $body, win,doc) {
	var rclass = /[\t\r\n\f]/g,
		noop = function() {},
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
		fh = function(e) {
			$(this).parent().hide();
		},
		bh = function($p) {
			$p.find(".click-hide-parent").on("click", fh);
		},
		fillContent = function($c /* child node [String|Function｜jQObj] */ , $p) {
			if($c) {
				if(typeof $c === "string") {
					$p.html(p);
				} else if(typeof p == "function") {
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
		fem = function($c, $t) {
			var $e = $(
					"<div class='err-ctn'><i class='icon click-hide-parent'></i></div>")
				.appendTo(errDiv);
			$("<span></span>").appendTo($e).html($c);
			bh($e);
			setTimeout(function() {
				$e.remove()
			}, $t ? $t : 10000);
		},
		// function warn message
		fwm = function($c, $t) {
			var $w = $(
					"<div class='warn-ctn'><i class='icon click-hide-parent'></i></div>")
				.appendTo(warnDiv);
			$("<span></span>").appendTo($w).html($c);
			bh($w);
			setTimeout(function() {
				$w.remove()
			}, $t ? $t : 3000);
		},
		fm = function($c, $t) {
			var $m = $(
					"<div class='warn-ctn'><i class='icon click-hide-parent'></i></div>")
				.appendTo(warnDiv);
			$("<span></span>").appendTo($w).html($c);
			bh($m);
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
		am = function(title, content, hand) {
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
			b.text($cp).on("click", function() {
				rmModal(), $h()
			});
		},
		bm = function(obj) {
			var ly = modal('<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title"></h4></div><div class="modal-body"><p></p></div><div class="modal-footer"></div></div></div>');
			ly.ctn.find(".modal-title").text(obj.title || "确认");
			ly.ctn.find("p").text(obj.content);
			var m_footer = ly.ctn.find(".modal-footer"),
				btnH = function(btn) {
					var $btn = $('<button type="button" class="btn"></button>')
						.appendTo(m_footer);
					var caption = btn.caption || "未命名的",
						handler = btn.hand || noop;
					$btn.text(caption);
					$btn.on("click", function() {
						util.closeModalLayer();
						handler();
					});
				};
			for(var i = 0; i < obj.btns.length; ++i) {
				bm_addBtn(m_footer, btns[i].caption || "no name", btns[i].hand ||
					noop);
			}
		},
		g_def_err_hand = function(ep) {
			fem("http access error:\r\n" + JSON.stirngify(ep));
		},
		g_err = {
			"defErrHand": function(ep) {

			},
			"0": "未定义的错误",
		},
		/**
		 * ep={code:"",msg:"",detailMsg:"",url:""} pa=function(code,msg,detailMsg)
		 * pa=boolean
		 */
		ajaxErrHand = function(ep, eh) {
			if(eh) {
				var pt = $.type(eh);
				if(pt == "booean") {
					g_def_err_hand(ep);
				} else if(pt == "function") {
					eh(ep);
				} else {
					var ph = eh[ep.code] || g_err[ep.code] || eh["defErrHand"] ||
						g_err["defErrHand"];
					if(typeof ph === "string") {
						fem(ph);
					} else {
						ph(ep);
					}
				}
			}
		},
		ajaxAccess = function(method, pUrl, pData, sh, eh, config) {
			config = config || {};
			if(false !== config.mask)
				loading();
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
					ajaxErrHand(rd, eh);
				}
			};
			config.error = function(jqXHR, textStatus, errorThrown) {
				ajaxErrHand({
					code: "err_"+(textStatus || ""),
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
			}else{
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
			}}
		};

	return {
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
			return lay_curr.index + 1;
		},
		error: fem,
		warn: fwm,
		msg: fm,
		alert: am,
		boxMsg: bm,
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
			ajaxAccess("get", url, data, sh, eh, config);
		},
		post: function(url, data, sh, eh, config) {
			ajaxAccess("post", url, data, sh, eh, config);
		},
		put: function(url, data, sh, eh, config) {
			ajaxAccess("post", url, data ? JSON.stringify(data) : "", sh, eh,
				config);
		},
		del: function(url, sh, eh, pObj) {
			ajaxAccess("post", url, null, sh, eh, pOjb);
		},
		noop: noop,
		nochange:function(d){return d},
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
				target.concat(rule);
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
			$e.removeClass("invald");
		},
		invalid: function($e) {
			$e.addClass("invald");
		},
		appendChild: function(e, obj) {
			var docf = doc.createDocumentFragment();
			buildElement(docf, obj);
			e.appendChild(docf);
		},

	};
});