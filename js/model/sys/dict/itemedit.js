;
spa_define(function() {
	return $.use(["util", "form", "dict", "spa", "code", "form"], function(util, form, dict, spa, code, form) {
		var ahref = { an: "href", av: "javascript:;" };
		return {
			modal: function(data) {
				var root = spa.findInModal(".sys_dict_itemedit");
				root.find(".modal-ctrl .icon-times").on("click", function() {
					spa.closeModal();
				});
				var treeCnt = root.find(".main .nav"),
					dictData = data.data,
					hand = code.parseCode(root.find(".info")),
					editForm = {};

				var findByCode = function(c, items) {
					var ret;
					for(var i = 0; i < items.length; ++i) {
						var item = items[i];
						if(item.code === c) return item;
						if(item.children && item.children.length) {
							ret = findByCode(c, item.children);
							if(ret) return ret;
						}
					}
				};
				var paint = function(ul, items, pc) {
					items.forEach(function(item) {
						var li = { tn: "li" },
							attrs = li.attrs = [{ an: "class", av: "leaf-item" }];
						chs = li.chs = [];
						ul.chs.push(li);
						attrs.push({ an: "code", av: item.code });
						attrs.push({ an: "pcode", av: pc || "" });
						var icon = {
							tn: "i",
							attrs: [{ an: "class", av: "icon icon-star" }]
						};
						chs.push(icon);
						chs.push({ tn: "a", attrs: [ahref], chs: [item.code + ":" + item.caption] });
						if(item.children && item.children.length) {
							icon.attrs[0].av = "icon icon-dict-toggle";
							li.attrs[0].av = "branch-item";
							var cul = { tn: "ul", chs: [] };
							chs.push(cul);
							paint(cul, item.children,item.code);
						}
					});
				};
				var refreshTree = function() {
					var ul = { tn: "ul", chs: [] };
					paint(ul, dictData);
					treeCnt.empty();
					util.appendChild(treeCnt[0], ul);
					hand.empty();
					editForm.oc = null;
					editForm.pc = null;
					editForm.form = null;
				};
				var findParentArray = function(pc) {
					if(pc) {
						var items = findByCode(pc, dictData);
						return items ? (items.children ? items.children : null) : null;
					}
					return dictData;
				};
				var movePrev = function() {
					if(editForm.oc) {
						var items = findParentArray(editForm.pc);
						if(items) {
							var i = 0;
							for(; i < items.length; ++i) {
								if(items[i].code === editForm.oc) {
									break;
								}
							}
							if(i > 0 && i < items.length) {
								var item1 = items[i],
									item0 = items[i - 1];
								items.splice(i - 1, 2, item1, item0);
								refreshTree();
							}
						}
					}
				};
				var moveNext = function() {
					if(editForm.oc) {
						var items = findParentArray(editForm.pc);
						if(items) {
							var i = 0;
							for(; i < items.length; ++i) {
								if(items[i].code === editForm.oc) {
									break;
								}
							}
							if(i < (items.length - 1)) {
								var item1 = items[i],
									item0 = items[i + 1];
								items.splice(i, 2, item0, item1);
								refreshTree();
							}
						}
					}
				};
				var deleteItem = function(pc, oc) {
					if(editForm.oc) {
					var items = findParentArray(editForm.pc);
					if(items) {
						var i = 0;
						for(; i < items.length; ++i) {
							if(items[i].code === editForm.oc) {
								break;
							}
						}
						if(i < items.length) {
							items.splice(i, 1);
							refreshTree();
						}
					}
					}
				};

				var fillEdit = function(pc, di) {
					hand.val();
					editForm.form = form.build(root.find(".info"));
					editForm.pc = pc;
					editForm.oc = di.code;
					editForm.form.val(di);
				};

				root.on("click", ".nav li", function(evt) {
					var $this = $(this);
					if($this.hasClass("branch-item")) {
						$this.toggleClass("open");
					}
					var di = findByCode($this.attr("code"), dictData);
					if(di) {
						fillEdit($this.attr("pcode"), di);
					}
					evt.stopPropagation();
				});
				root.on("click", ".opt-newroot", function() {
					fillEdit("", {});
				});
				root.on("click", ".opt-new", function() {
					fillEdit(editForm.oc, {});
				});
				root.on("click", ".opt-prev", function() {
					movePrev();
				});
				root.on("click", ".opt-next", function() {
						moveNext();
				});
				root.on("click", ".opt-del", function() {
						deleteItem();
				});
				root.on("click", ".opt-ok", function() {
					if(editForm.form.validate()) {
						var item = editForm.form.val();
						if(editForm.oc) {
							var di = findByCode(item.code, dictData);
							if(item.code !== editForm.oc) {
								if(di) {
									util.alert("存在重复的CODE");
									return;
								}
								di = findByCode(editForm.oc, dictData);
							}
							if(di) {
								di.caption = item.caption;
								di.shortCode = item.shortCode;
								di.enabled = item.enabled;
								di.system = item.system;
								di.descp = item.descp;
								di.code = item.code;
								refreshTree();
							}
						} else {
							var items = dictData;
							if(findByCode(item.code, dictData)) {
								util.alert("存在重复的CODE");
								return;
							}
							if(editForm.pc) {
								items = findByCode(editForm.pc,dictData);
								if(items) {
									if(items.children) {
										items = items.children;
									} else {
										items = items.children = [];
									}
								} else {
									items = dictData;
								}
							}
							var di = { code: item.code, caption: item.caption, shortCode: item.shortCode, enabled: item.enabled, system: item.system, descp: item.descp };
							items.push(di);
							refreshTree();
						}
					}
				});
				root.find(".opt-save").on("click", function() {
					util.put("../ajax/sys/dict/item/" + data.code, dictData, function() {
						spa.closeModal();
						if(data.hand) {
							data.hand();
						}
					}, {});
				});

				refreshTree();

			}
		};
	});
});