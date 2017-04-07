$.define(["jQuery", "util", "doc", "win", "body"], "spa", function($, util, doc, win, body) {
	var head = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement,
		baseElement = head.getElementsByTagName("base")[0],
		ahref = { an: "href", av: "javascript:;" },
		spa_modal_index = 0,
		spa_css_ref = 0,
		resCache = {},
		cssCache = {},
		htmlCache = { "#": "#" },
		modelCache = {"_def_error_form":{}},
		scriptCache = {}, resUri, menuUri, menuEle,
		main, mainEle,
		cfg = {
			ajaxCfg: { mask: true },
			mask: true,
			loadEnabled: true
		},
		load_res = function() {
			if(resUri) {
				util.get(resUri, null, function(data) {
					/**
					 * res =[{id:"",uri:"",css:"",script:""},{id:"",uri:"",css:"",script:""},...........]
					 */
					if(data && data.length) {
						data.forEach(function(item) {
							resCache[item.id] = item;
						});
					}
					menuUri ? load_menu() : showMain();
				},false, cfg.ajaxCfg);
			}
		},
		load_menu = function() {
			util.get(menuUri, null, function(menu) {
				build_menu(menu);
				showMain();
			},false, cfg.ajaxCfg);
		},
		build_menu = function(menu) {
			if(menuEle && menuEle.length && menu && menu.length) {
				var ul = { tn: "ul", attrs: [{ an: "class", av: "nav nav-root" }], chs: [] };
				build_menu_item(ul.chs, menu);
				menuEle.empty();
				util.appendChild(menuEle[0], ul);
				menuEle.find(".nav-hand").on("click", function(e) {
					var $this = $(this);
					menuEle.find(".nav-hand.active").removeClass("active");
					$this.addClass("active");
					if($this.hasClass("spa-modal")) {
						showModal($this.attr("res"));
					} else {
						location.hash = "#" + $this.attr("res");
						showMain();
					}
				});
				menuEle.find(".nav-branch-hand").on("click", function(e) {
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
		build_menu_item = function(po, items) {
			var item, res, caption, iconClass;
			items.forEach(function(item) {
				var li = { tn: "li" },
					attrs = li.attrs = [],
					chses = li.chs = [],
					lia = { tn: "a", attrs: [ahref], chs: [] };
				chses.push(lia);
				var ic = "icon-" + (item.icon || (item.res ? "book" : "branch"));
				lia.chs.push({ tn: "i", attrs: [{ an: "class", av: ic }] });
				lia.chs.push(item.caption);
				var lac = "";
				if(item.res) {
					lia.attrs.push({ an: "res", av: item.res });
					lac = lac + (item.modal ? " nav-hand spa-modal" : " nav-hand");
					lia.attrs.push({ an: "class", av: lac })
				} else {
					lia.chs.push({ tn: "i", attrs: [{ an: "class", av: "icon fold" }] });
					lac = lac + " nav-branch-hand";
					attrs.push({ an: "class", av: "nav-parent" });
					var ul = { tn: "ul", attrs: [{ an: "class", av: "nav" }], chs: [] };
					chses.push(ul);
					build_menu_item(ul.chs, item.children);
				}
				lia.attrs.push({ an: "class", av: lac });
				po.push(li);
			});
		},
		loadModelCss = function(model) {
			if(model.css) {
				var uri = model.css;
				if(cssCache[uri]) {
					cssCache[uri]['ref'] = cssCache[uri]['ref'] + 1;
				} else {
					++spa_css_ref;
					var css_id = "___spa_css_id_" + spa_css_ref;
					cssCache[uri] = { ref: 1, id: css_id };
					var link = doc.createElement('link');
					link.rel = 'stylesheet';
					link.href = model.css;
					link.media = 'all';
					link.setAttribute("id", css_id);
					head.appendChild(link);
				}
			}
		},
		showMainInternal = function(model) {
			cleanMain();
			main = model;
			loadModelCss(model);
			if(model.uri) {
				mainEle.html(htmlCache[model.uri]);
			}
			mainEle.attr("spa-model-id", model.id);
			if(model.factory && model.factory.main) {
				model.factory.main.call();
			}
		},
		showModalInternal = function(model, data) {
			loadModelCss(model);
			var ly = util.showModal(model.uri ? htmlCache[model.uri] : null);
			++spa_modal_index;
			ly.ctn.addClass("spa-modal").addClass("spa-modal-index-" + spa_modal_index).attr("spa-model-id", model.id);
			if(model.factory && model.factory.modal) {
				model.factory.modal(data);
			}
		},
		cacheModel = function(model) {
			var m = modelCache[model.id] = {};
			m.uri = model.uri;
			m.factory = model.factory;
			m.css = model.css;
			m.id = model.id;
			m.data = model.data;
			delete resCache[model.id];
			return m;
		},
		afterLoadByMain = function(model, data) {
			showMainInternal(cacheModel(model));
		},
		afterLoadByModal = function(model, data) {
			showModalInternal(cacheModel(model), data);
		},
		loadModel = function(model, handler, data) {
			if(htmlCache[model.uri || "#"]) {
				model.state = 11;
				if(model.script) {
					loadModelScript(model, handler, data);
				} else {
					handler(model, data);
				}
			} else {
				if(cfg.mask) {
					util.showLoading();
				}
				model.state = 10;
				$.ajax({ url: model.uri, dataType: "html", type: "GET" }).done(function(hc) {
					model.state = 11;
					htmlCache[model.uri] = hc;
					if(cfg.mask) {
						util.hideLoading();
					}
					if(model.script) {
						loadModelScript(model, handler, data);
					} else {
						handler(model, data);
					}
				}).fail(function(jqXHR, textStatus, errorThrown) {
					model.state = 12;
					if(cfg.mask) { util.hideLoading(); }
					util.raise({
						code: "loadModelHtml_" + (textStatus || ""),
						msg: textStatus,
						detailMsg: textStatus,
						xhr: jqXHR,
						eObj: errorThrown,
						url: model.uri
					});
				});
			}
		},
		removeModelCss = function(model) {
			if(model.css) {
				var cm = cssCache[model.css];
				if(cm) {
					cm.ref = cm.ref - 1;
					if(!cm.ref) {
						var link = doc.getElementById(cm.id);
						if(link) link.parentNode.removeChild(link);
						delete cssCache[model.css];
					}
				}
			}
		},
		loadModelScript = function(model, handler, data) {
			model.factory = scriptCache[model.script];
			if(model.factory) {
				model.state = 31;
				handler.call(model, data);
				return;
			}
			var node = doc.createElement("script");
			node.async = true;
			node.src = model.script;
			node.charset = "UTF-8";
			var supportOnload = "onload" in node;
			if(cfg.mask) {
				util.showLoading();
			}
			window.spa_define = function(factoryBuilder) {
				model.state = 30;
				if(cfg.mask) {
					util.showLoading();
				}
				try {
					scriptCache[model.script] = model.factory = factoryBuilder(spa);
					model.state = 31;
					if(cfg.mask) {
						util.hideLoading();
					}
				} catch(err) {
					model.state = 32;
					if(cfg.mask) {
						util.hideLoading();
					}
					util.raise({
						code: "buildModelFactory_" + err.toString(),
						msg: err.toString() || "",
						detailMsg: err.toString() || "",
						url: model.script
					});
				}
				handler(model, data);
			};

			if(supportOnload) {
				node.onload = function() {
					if(model.state < 21) model.state = 21;
					node.onerror = null;
					node.onload = null;
					head.removeChild(node);
					if(cfg.mask) {
						util.hideLoading();
					}
				};
				node.onerror = function() {
					node.onload = null;
					node.onerror = null;
					head.removeChild(node);
					if(cfg.mask) {
						util.hideLoading();
					}
					if(model.state < 22) {
						model.state = 22;
						util.raise({
							code: "loadModelScript_",
							msg:"",
							detailMsg: "",
							url: model.script
						});
					}
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
									head.removeChild(node);
									if(cfg.mask) {
										util.hideLoading();
									}
									util.raise({
										code: "loadModelScript_timeout",
										msg: "",
										detailMsg: "",
										url: model.script
									});
								}
							}, model.timeout || 1000);
						} else {
							head.removeChild(node);
							if(cfg.mask) {
								util.hideLoading();
							}
						}
					}
				};
			}
			model.state = 20;
			baseElement ?
				head.insertBefore(node, baseElement) :
				head.appendChild(node);
		},
		cleanMain = function() {
			if(main) {
				removeModelCss(main);
				if(main.factory && main.factory.mainDestory) { main.factory.mainDestory() };
				mainEle.empty();
				main = null;
			}
		},
		getModel = function(id) {
			return modelCache[id];
		},
		showModal = function(id, data) {
			var model = modelCache[id];
			if(model) {
				showModalInternal(model, data);
			} else {
				model = resCache[id];
				if(model) {
					loadModel(model, afterLoadByModal, data);
				} else {
					util.raise({ code: "invalid_model", msg: "不正确的模块[" + id + "]", detailMsg: "不正确的模块[" + id + "]" });
				}
			}
		},
		showMain = function() {
			var id = win.location.hash;
			if(id && id.length > 1) {
				id = id.substring(1);
			} else return;
			if(main && id == main.id) return;
			var model = modelCache[id];
			if(model) {
				showMainInternal(model);
			} else {
				var model = resCache[id];
				if(model) {
					loadModel(model, afterLoadByMain);
				} else {
					util.raise({ code: "invalid_model", msg: "不正确的模块[" + id + "]", detailMsg: "不正确的模块[" + id + "]" });
				}
			}
		},
		getLastModalIndex = function() {
			return spa_modal_index;
		},
		getLastModalCtn = function() {
			return $(".spa-modal-index-" + spa_modal_index);
		},
		getLastModalModel = function() {
			var ctn = $(".spa-modal-index-" + spa_modal_index);
			var id = modalCtn.attr("spa-model-id");
			return getModel(id);
		},
		closeModal = function() {
			var ctn = $(".spa-modal-index-" + spa_modal_index);
			var id = ctn.attr("spa-model-id");
			var inx = util.listModalIndex();
			if(ctn.hasClass("layer-" + inx)) {
				var model = modelCache[id];
				if(model) {
					if(model.factory.modalDestory) {
						model.factory.modalDestory.call(this);
					}
					if(model.css) {
						removeModelCss(model);
					}
					--spa_modal_index;
					util.closeModal();
				}
			} else {
				util.raise({ code: "invalid_dir", msg: "can't close modal:has top layer", detailMsg: "can't close modal:has top layer" });
			}
		},
		build = function(config) {
			$.extend(cfg, config);
			resUri = cfg.resUri || body.attr("resource");
			menuUri = cfg.menuUri || body.attr("menu");
			mainEle = cfg.mainEle || $(".spa-main");
			menuEle = cfg.menuEle || $(".spa-menu");
			resCache = cfg.resCache || resCache;
			htmlCache = cfg.htmlCache || htmlCache;
			htmlCache["#"] = "#";
			if(cfg.loadEnabled) load_res();
		},
	    spa = {
			build: build,
			closeModal: closeModal,
			getLastModalModel: getLastModalModel,
			getLastModalCtn: getLastModalCtn,
			getLastModalIndex: getLastModalIndex,
			showMain: showMain,
			showModal: showModal,
			mainChildren:function(selector){
				return mainEle.children(selector);
			},
			modalChildren:function(selector){
				return getLastModalCtn.children(selector);
			},
			findInMain:function(selector){
				return mainEle.find(selector);
			},
			findInModal:function(selector){
				return getLastModalCtn().find(selector);
			}
		};
		$.spa=spa;
	return spa;
});