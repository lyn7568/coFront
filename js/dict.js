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
		apply = function(code, hand) {
			var dict = cache[code];
			if(!dict) {
				var hs = handCache[dictCode];
				if(!hs) {
					handCache[code] = hs = [];
					load(dictCode);
				}
				hs.push(hand);
			} else {
				hand(dict);
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