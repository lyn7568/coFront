$.define(["jQuery", "util"], "dict", function($, util) {
	var cache = { bool: [{ code: "0", caption: "否", enabled: true }, { code: "1", caption: "是", enabled: true }] },
		handCache = {},
		uri = "/ajax/sys/dict/item/",
		eh = {},
		config = { mask: false },
		set = function(code, items) {
			cache[code] = items;
			var hs = handCache[code];
			if(hs && hs.length) {
				hs.forEach(function(h) {
					h(items);
				});
				delete handCache[code];
			}
		},
		load = function(code) {
			util.get(uri + code, null, function(data) {
				set(code, data);
			}, eh, config);
		},
		dyn_load=function(obj){
			util.get(obj.uri, null, function(data) {
			obj.ready=true;
			obj.items =obj.transfer?obj.transfer(data):data;
			if(obj.listen){
				obj.listen.forEach(function(item){
					item.call(null,obj.items);
				});
			}
			delete obj.listen;
			}, obj.ajaxEh, obj.ajaxCfg);
		}
		
		apply = function(code, hand) {
			var dict = cache[code];
			if(!dict) {
				var hs = handCache[code];
				if(!hs) {
					handCache[code] = hs = [];
					load(code);
				}
				hs.push(hand);
			} else {
				hand(dict);
			}
		},
		
		dyn_apply=function(obj,hand){
			if(!obj.ready) {
				var hs = obj.listen;
				if(!hs) {
					obj.listen = hs = [];
					dyn_load(obj);
				}
				hs.push(hand);
			} else {
				hand(obj.items);
			}
		},
		refresh = function(code, hand) {
			if(hand) {
				var hs = handCache[code];
				if(!hs) {
					handCache[code] = hs = [];
				}
				hs.push(hand);
			}
			var dict = cache[code];
			if(dict) {
				delete cache[code];
				load(code);
			}
		},
		getCap = function(items, code) {
			for(var i = 0; i < items.length; ++i) {
				var item = items[i];
				if(code === item.code) {
					return item.caption;
				} else if(item.children && item.children.length) {
					var ret = getCap(item.children, code);
					if(ret) return ret;
				}
			}
			return false;
		},
		get = function(code) {
			return cache[code];
		},

		ret = {
			set: set,
			apply: apply,
			dynApply:dyn_apply,
			refresh: refresh,
			getCap: getCap,
			get: get,
			transfer: function($e, dict, code) {
				dict = dict || $e.attr("dict") || $e.attr("dictCode");
				code = code || $e.attr("code") || $e.attr("itemCode");
				if(dict && code) {
					apply(dict, function(items) {
						var cp = getCap(items, code);
						if(cp) {
							$e.removeClass("invalid-dict").text(cp);
						} else {
							$e.addClass("invalid-dict").text("不可翻译的");
						}
					});
				}
			},
			dynTransfer:function(obj,$e,code){
				code = code || $e.attr("code") || $e.attr("itemCode");
				if(code){
					dyn_apply(obj,function(items){
						var cp = getCap(items, code);
						if(cp) {
							$e.removeClass("invalid-dict").text(cp);
						} else {
							$e.addClass("invalid-dict").text("不可翻译的");
						}
					});
				}
			},
			doTransfer: function() {
				$(".hand-dict").each(function() {
					var $e = $(this);
					var dict = $e.attr("dict") || $e.attr("dictCode"),
						code = $e.attr("code") || $e.attr("itemCode");
					if(dict && code) {
						apply(dict, function(items) {
							var cp = getCap(items, code);
							if(cp) {
								$e.removeClass("invalid-dict").text(cp);
							} else {
								$e.addClass("invalid-dict").text("不可翻译的");
							}
						});
					}
					$e.removeClass("hand-dict");
				});
			}
		};
		$.dict=ret;
	return ret;
});