$.define(["jQuery", "doc", "body", "util"], "code", function($, doc, $body, util) {
	/**
	 * env={ ce:current Element; cd:current Data; ci:current index in
	 * ListElement array[ci=index] or object[ci=key] es:Element stack; Array
	 * ds:Data stack; Array is:index stack;Array sh:value handler
	 * function(env,key){return [String]} dir:directive handler
	 * Aarray(function(env){}.call(elementObj={},env) }
	 */
	var ch_val_buider = {
			/*{{111-222-333-444}}=={k:111,h:222,p:[333,444]}   */
			/*{{111}}=={k:111,h:s}   */
			/*{{111-222}}=={k:111,h:222,p:undefined}   */

			"c": function( /* env */ ) {
				return this.k;
			},
			"s": function(env) {
				var v = env.cd;
				if(v) v = this.k ? v[this.k] : v;
				if(v) return v;
				return "";
			},
			"_index": function(env) {
				return env.ci+1;
			},
			"bool":function(env){
				return env.cd[this.k]?"是":"否";
			},
			"date":function(env){
				var v = env.cd[this.k];
				return v?(v.substring(0,4)+"年"+v.substring(4,6)+"月"+v.substring(6,8)+"日"):((this.p && this.p[0])||"");
			}
		},
		simpleAttrHandler = function(env) {
			env.ce.setAttribute(this.n, this.v);
		},
		AttrHandler = function(env) {
			var ret = [],
				va = this.v;
			for(var i = 0; i < va.length; ++i) {
				var item = va[i];
				ret.push[env.sh[item.h].call(this, env)];
			}
			env.ce.setAttribute(this.n, ret.join(""));
		},
		/**
		 * r:array s:text value f:lslast value in array Is * Text
		 */
		strSplit_s = function(r, s, f) {
			if(f) {
				var tmp = r[r.length - 1];
				tmp.k = tmp.k + s;
			} else {
				r.push({ k: s, h: "c" });
			}
		},
		strSplit_o = function(r /* array */ , shell /* trim value like {{shell}} */ ) {
			var tmp = shell.split("-");
			var obj = { k: tmp.shift(), h: "s" };
			if(tmp.length) { obj.h = tmp.shift(); }
			if(tmp.length) { obj.p = tmp; }
			r.push(obj);
		},
		strSplit = function(s) { // s.length>4
			var r = [],
				len = s.length,
				si = 0,
				/* parse start index */
				ei, /* end shell ei = s.indexOf("}}",bi+2) */
				shell, /* {{shell}} */
				tmp, /* last shell */
				f /* prev is not shell */ ,
				bi = s.indexOf("{{"); /* begin shell bi = s.indexOf("{{",si) */
			if(bi >= 0) {
				ei = s.indexOf("}}", bi);
				if(ei>0){
				while(true) {
					if(bi > si) {
						r.push({ k: s.substring(si, bi), h: "c" });
						f = true;
					}
					shell = s.substring(bi + 2, ei).trim();
					si = ei + 2;
					if(shell.length) {
						f = false;
						strSplit_o(r, shell);
					} else {
						strSplit_s(r, s.substring(bi, si), f);
						f = true;
					}
					if(si >= len) return r;
					bi = s.indexOf("{{", si);
					if(bi < 0) { strSplit_s(r, s.substring(si), f); return r; }
					ei = s.indexOf("}}", bi);
					if(ei < 0) { strSplit_s(r, s.substring(si), f); return r; }
				}}
			}
			return s;
		},
		strCompile = function(s) {
			var r = strSplit(s);
			if(typeof r != "string") {
				return r.length > 1 ? r : r[0];
				/*
				 * [{k:"",h:"",p:[]},...] :
				 * {k:"",h:"",p:[]}
				 */
			}
			return s; // String;
		},
		simpleAttrHand = function(env) {
			env.ce.setAttribute(this.n, this.v);
		},
		singleAttrHand = function(env) {
			env.ce.setAttribute(this.n, env.sh[this.v.h].call(this.v, env));
		},
		arrayAttrHand = function(env) {
			var item, ret = [],
				vs = this.v,
				len = vs.length;
			for(var i = 0; i < len; ++i) {
				item = vs[i];
				ret.push(env.sh[item.h].call(item, env));
			}
			env.ce.setAttribute(this.n, ret.join(""));
		},
		/* ret.h(env); attribute compiler */
		attrCompile = function(attr) {
			var s = attr.value || "",
				ret = { n: attr.name, v: s, h: simpleAttrHand };
			if(s.length > 4) {
				s = strCompile(s);
				if(typeof s != "string") {
					ret.v = s;
					// is Array
					ret.h = s.length ? arrayAttrHand : singleAttrHand;
				}
			}
			return ret;
		},
		/* ret.h(env); textNode compiler */
		textCompile = function(s /* s = textNode.nodeValue */ ) {
			var len = s.length,
				ret = { v: s, h: "_t" };
			if(len > 4) {
				s = strCompile(s);
				if(typeof s != "string") {
					ret.v = s;
					// is Array
					ret.h = s.length ? "_at" : "_st";
				}
			}
			return ret;
		},
		ch_dir_container = {
			/* simpleTextHand= */
			"_t": function(env) { env.ce.appendChild(doc.createTextNode(this.v)); },
			/* singleTextHand= */
			"_st": function(env) { env.ce.appendChild(doc.createTextNode(env.sh[this.v.h].call(this.v, env))); },
			/* arrayTextHand= */
			"_at": function(env) {
				var item, ret = [],
					vs = this.v,
					len = vs.length;
				for(var i = 0; i < len; ++i) {
					item = vs[i];
					ret.push(env.sh[item.h].call(item, env));
				}
				env.ce.appendChild(doc.createTextNode(ret.join("")));
			},
			"_": function(env) {
				var ele = doc.createElement(this.n),
					as = this.as,
					es = this.es,
					item;
				env.ce.appendChild(ele);
				env.es.push(env.ce);
				env.ce = ele;
				for(var i = 0; i < as.length; ++i) {
					as[i].h(env);
				}
				for(var i = 0; i < es.length; ++i) {
					item = es[i];
					env.dir[item.h].call(item, env);
				}
				env.ce = env.es.pop();
			},
			"list": function(env) {
				var hand = env.dir["_"],
					as = this.as,
					es = this.es,
					item, data = env.cd,
					p = this.p;
				if(data && p && p.length && p[0]) {
					env.ds.push(data);
					data = env.cd = data[p[0]] || [];
					env.is.push(env.ci);
					for(var i = 0; i < data.length; ++i) {
						env.ci = i;
						env.cd = data[i];
						hand.call(this, env);
					}
					env.ci = env.is.pop();
					env.cd = env.ds.pop();
				} else if(data && data.length) {
					env.is.push(env.ci);
					env.ds.push(data);
					for(var i = 0; i < data.length; ++i) {
						env.ci = i;
						env.cd = data[i];
						hand.call(this, env);
					}
					env.cd=env.ds.pop();
					env.ci = env.is.pop();
				}
			},
			"array.empty":function(env){
				if((!env.cd) || (!env.cd.length)){
					env.dir["_"].call(this,env);
				}
			},
			"each": function(env) {
				var hand = env.dir["_"],
					as = this.as,
					es = this.es,
					item, data = env.cd,
					p = this.p;
				if(data && p && p.length && p[0]) {
					env.ds.push(data);
					env.is.push(env.ci);
					for(var i = 0; i < p.length; ++i) {
						env.ci = p[i];
						env.cd = data[env.ci];
						hand.call(this, env);
					}
					env.ci = env.is.pop();
					env.cd = env.ds.pop();
				} else if(data) {
					env.is.push(env.ci);
					env.ds.push(data);
					for(var key in data) {
						env.ci = k;
						env.cd = data[key];
						hand.call(this, env);
					}
					env.cd = env.ds.pop();
					env.ci = env.is.pop();
				}
			},
			"val": function(env) {
				var hand = env.dir["_"],
					items, item, data = env.cd,
					p = this.p;
				if(p && p.length && p[0]) {
					items = p[0].split("\\.");
					env.ds.push(data);
					while(items.length && data) {
						data = data[items.shift()];
					}
					if(items.length === 0) {
						env.cd = data;
				t
					}
					env.cd = env.ds.pop();
				}
			},
			"valTag": function(env) {
				var items, item, data = env.cd,
					p = this.p,es = this.es;
				if(p && p.length && p[0]) {
					items = p[0].split("\\.");
					env.ds.push(data);
					while(items.length && data) {
						data = data[items.shift()];
					}
					if(items.length === 0) {
						env.cd = data;
						for(var i = 0; i < es.length; ++i) {
							item = es[i];
							env.dir(item.h).call(item, env);
						}
					}
					env.cd = env.ds.pop();
				}
			}
		},
		childCompile = function(chs) {
			var ret = [],stack = [],ev, as, es, attrs, ch, ele;
			hObj = { r: ret, i: 0, c: chs, t: false, s: "", l: chs.length };
			while(hObj) {
				while(hObj.i < hObj.l) {
					ele = hObj.c[hObj.i++];
					if(ele.nodeType == 1) {
						if(hObj.t) {
							hObj.r.push(textCompile(hObj.s));
						}
						hObj.t = false;
						attrs = ele.attributes;
						ch = (ele.getAttribute("ch-dir") || "_").split("-");
						ev = { n: ele.nodeName, h: (ch.shift()||"_"), p: ch };
						as = ev.as = [];
						es = ev.es = [];
						hObj.r.push(ev);
						for(var i = 0; i < attrs.length; ++i) {
							as.push(attrCompile(attrs[i]));
						}
						as = ele.childNodes.length;
						if(as) {
							stack.push(hObj);
							hObj = { r: es, i: 0, c: ele.childNodes, t: false, s: "", l: as };
							stack.push(hObj);
							break;
						}
						
					} else if(ele.nodeType == 3) {
						hObj.s = hObj.t ? (hObj.s + ele.nodeValue) : ele.nodeValue;
						if(hObj.i>=hObj.l){
							hObj.r.push(textCompile(hObj.s));							
						}else{
							hObj.t = true;
						}
					}
				}
				hObj = stack.pop();
			}
			return ret;
		},
		//		/* ret.h(env) Element compiler */
		//		eleCompile = function(ele) {
		//			var attrs = ele.attributes,
		//				cdir = ele.getAttribute("ch-dir") || "_",
		//				ret = { n: ele.nodeName },
		//				as = ret.as = [],
		//				es = ret.es = [],
		//				lisT, s, ch;
		//			ch = cdir.split("-");
		//			ret.h = ch.shift();
		//			if(ch.length) ret.p = ch;
		//			for(var i = 0; i < attrs.length; ++i) {
		//				as.push(attrCompile(attrs[i]));
		//			}
		//			childCompile(ele.childNodes, ret.es);
		//			return ret;
		//		},
		parseElement = function(ele) {
			var env = { sh: {}, dir: {} },
				chs = childCompile(ele.childNodes);
			$.extend(env.sh, ch_val_buider);
			$.extend(env.dir, ch_dir_container);
			return {
				"shell": function(name, hand) {
					if(hand) {
						env.sh[name] = hand;
						return this;
					} else return env.sh[name];
				},
				"dir": function(name, hand) {
					if(hand) {
						env.dir[name] = hand;
						return this;
					} else return env.dir[name];
				},
				"fill": function(pe, data) {
					env.es = [];
					env.ds = [];
					env.is = [];
					env.ce = pe, env.cd = data;
					for(var i = 0; i < chs.length; ++i) {
						var ch = chs[i];
						env.dir[ch.h].call(ch, env);
					}
					return this;
				}
			};
		},
		parseCode = function(ele) {
			var ele=ele.jquery?ele[0]:ele, hand = parseElement(ele),
				$ele = $(ele),
				bh = util.nochange,
				lses = [];
			return $.extend(hand, {
				"val": function(data) {
					data = bh(data);
					if(false === data) return this;
					$ele.empty();
					var docf = doc.createDocumentFragment();
					this.fill(docf, data);
					ele.appendChild(docf);
					for(var i = 0; i < lses.length; ++i) {
						lses[i]();
					}
					return this;
				},
				"empty": function() {
					$(ele).empty();
					return this;
				},
				"listen": function(h) {
					if(h) lses.push(h);
					return this;
				},
				"before": function(h) {
					if(h) {
						bh = h;
					}
				}
			});
		},
		parseHtmlTemplate = function(c) {
			var $div = $("<div style='display:none;'></div>");
			$div.appendTo($body).html(c);
			var h = parseCode($div[0]);
			$div.remove();
			return $.extend(h, {
				"appendTo": function(pe, data) {
					var docf = doc.createDocumentFragment();
					this.fill(docf, data);
					pe.appendChild(docf);
				}
			});
		};
	return {
		"parse": parseElement,
		"parseCode": parseCode,
		"template": parseHtmlTemplate
	};
});