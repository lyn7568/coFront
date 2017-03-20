!(function($) {
	$.define(["jQuery", "doc", "body"], "code", function($, doc, $body) {
		/**
		 * env={ ce:current Element; cd:current Data; ci:current index in
		 * ListElement array[ci=index] or object[ci=key] es:Element stack; Array
		 * ds:Data stack; Array is:index stack;Array sh:value handler
		 * function(env,key){return [String]} dir:directive handler
		 * Aarray(function(env){}.call(elementObj={},env) }
		 */
		var ch_val_buider = {
				"c": function( /* env */ ) {
					return this.k;
				},
				"s": function(env) {
					var v = env.cd;
					if(v) v = this.k ? v[this.k] : v;
					if(v) return v;
					return "";
				},
				"date": function(env) {}
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
					bi = nv.indexOf("{{"); /* begin shell bi = s.indexOf("{{",si) */
				if(bi >= 0) {
					ei = nv.indexOf("}}", bi);
					while(si < len) {
						if(bi > si) { r.push({ k: s.substring(si, bi), h: "c" });
							f = true; }
						shell = s.substring(bi + 2, ei).trim();
						si = ei + 2;
						if(shell.length) {
							f = false;
							strSplit_o(r, shell);
						} else { strSplit_s(r, s.substring(bi, si), f);
							f = true; }
						if(si >= len) return r;
						bi = s.indexOf("{{", si);
						if(bi < 0) { strSplit_s(r, s.substring(si), f); return r; }
						ei = s.indexOf("}}", bi);
						if(ei < 0) { strSplit_s(r, s.substring(si), f); return r; }
					}
				}
				return s;
			},
			strCompile = function(s) {
				var r = strSplit(s);
				if(typeof s != "string") {
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
				env.ce.setAttribute(this.n, env.sh[this.h].call(this.v, env));
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
			simpleTextHand = function(env) {
				env.ce.appendChild(doc.createTextNode(this.v));
			},
			singleTextHand = function(env) {
				env.ce.appendChild(doc.createTextNode(env.sh[this.h].call(this.v, env)));
			},
			arrayTextHand = function(env) {
				var item, ret = [],
					vs = this.v,
					len = vs.length;
				for(var i = 0; i < len; ++i) {
					item = vs[i];
					ret.push(env.sh[item.h].call(item, env));
				}
				env.ce.appendChild(doc.createTextNode(ret.join("")));
			},
			/* ret.h(env); textNode compiler */
			textCompile = function(s /* s = textNode.nodeValue */ ) {
				var len = s.length,
					ret = { v: s, h: "_t" };
				if(len > 4) {
					s = textCompile(s);
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
				"_st": function(env) { env.ce.appendChild(doc.createTextNode(env.sh[this.h].call(this.v, env))); },
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
						env.dir(item.h).call(item, env);
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
						for(var i = 0; i < data.length; ++i) {
							env.ci = i;
							hand.call(this, env);
						}
						env.ci = env.is.pop();
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
						for(var key in data) {
							env.ci = k;
							hand.call(this, env);
						}
						env.ci = env.is.pop();
					}
				},
				"val": function(env) {
					var hand = env.dir["_"],
						as = this.as,
						es = this.es,
						items, item, data = env.cd,
						p = this.p;
					if(p && p.length && p[0]) {
						items = p[0].split("\\.");
						env.ds.push(data);
						while(items.length && data) {
							data = data[items.shift()];
						}
						if(items.length === 0 && data) {
							env.cd = data;
							hand.call(this, env);
						}
						env.cd = env.ds.pop();
					}
				},
				"valTag": function(env) {
					var hand = env.dir["_"],
						as = this.as,
						es = this.es,
						items, item, data = env.cd,
						p = this.p;
					if(p && p.length && p[0]) {
						items = p[0].split("\\.");
						env.ds.push(data);
						while(items.length && data) {
							data = data[items.shift()];
						}
						if(items.length === 0 && data) {
							env.cd = data;
							var ele = doc.createElement(this.n);
							env.ce.appendChild(ele);
							env.es.push(env.ce);
							env.ce = ele;
							for(var i = 0; i < as.length; ++i) {
								as[i].h(env);
							}
							for(var i = 0; i < es.length; ++i) {
								item = es[i];
								env.dir(item.h).call(item, env);
							}
							env.ce = env.es.pop();
						}
						env.cd = env.ds.pop();
					}
				}
			},
			childCompile = function(chs, ret) {
				var lisT = false;
				for(var i = 0; i < chs.length; ++i) {
					var ch = chs[i];
					if(ch.nodeType == 1) {
						if(lisT) {
							ret.push(textCompile(s));
						}
						ret.push(eleCompile(ch));
						lisT = false;
					} else if(ch.nodeType == 3) {
						s = listT ? (s + ch.nodeValue) : ch.nodeValue;
						listT = true;
					}
				}
				if(listT) {
					ret.push(textCompile(s));
				}
			},
			/* ret.h(env) Element compiler */
			eleCompile = function(ele) {
				var attrs = ele.attributes,
					cdir = ele.getAttribute("ch-dir") || "_",
					ret = { n: ele.node },
					as = ret.as = [],
					es = ret.es = [],
					lisT, s, ch;
				ch = cdir.split("-");
				ret.h = ch.shift();
				if(ch.length) ret.p = ch;
				for(var i = 0; i < attrs.length; ++i) {
					as.push(attrCompile(attrs[i]));
				}
				childCompile(ele.children, ret.es);
				return tet;
			},
			parseElement = function(ele) {
				var env = { sh: {}, dir: {} },
					chs = [];
				childCompile(ele.children, chs);
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
			defBh = function(data) { return data; },
			parseCode(ele) = function(ele) {
				var hand = parseElement(ele),
					$ele = $(ele),
					bh = defBh,
					lses = [];
				return $.extend(hand, {
					"val": function(data) {
						$ele.empty();
						data = bh(data);
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
			"element": parseCode,
			"template": parseHtmlTemplate
		};
	});

})(jQuery);