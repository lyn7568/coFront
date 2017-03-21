$.define(["jQuery", "util"], "dict", function($, util) {
	var cache = {},
		handCache = {},
		uri = "/ajax/sys/dict/item/",
		eh = {},
		config = { mask: false };
		load: function(code) {
			util.get(uri + code, null, function(data) {
				cache[code] = data;
				var hs = handCache[code];
				if(hs && hs.length) {
					for(var i = 0; i < hs.length; ++i) {
						hs[i](data);
					}
					delete handCache[code];
				}
			}, eh, config);
		};
	return {
		apply: function(code, hand) {
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
		refresh: function(code, hand) {
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
		getCap: function(items, code) {
			for(var i = 0; i < items.length; ++i) {
				var item = items[i];
				if(code === item.code) {
					return item.caption;
				} else if(item.children && item.children.length) {
					var ret = get(item.children, code);
					if(ret) return ret;
				}
			}
			return false;
		},
		get:function(code){
			return cache[code];
		},
		transfer: function($e, dict, code) {
			dict = dict || $e.attr("dict");
			code = code || $e.attr("code");
			if(dict && code) {
				this.apply(dict, function(items) {
					var cp = get(items, code);
					if(cp) {
						$e.removeClass("invalid-dict").text(cp);
					} else {
						$e.addClass("invalid-dict").text("不可翻译的");
					}
				});
			}
		},
		doTransfer: function() {
			$(".hand_dict").each(function() {
				var $this = $this;
				var dict = $this.attr("dictCode") || $this.attr("dict"),
					code = $this.attr("itemCode") || $this.attr("code");
				if(dict && code) {
					this.apply(dict, function(items) {
						var cp = this.getCap(items, code);
						if(cp) {
							$e.removeClass("invalid-dict").text(cp);
						} else {
							$e.addClass("invalid-dict").text("不可翻译的");
						}
					});
				}
				$this.removeClass("hand_dict");
			});
		}
	};
});