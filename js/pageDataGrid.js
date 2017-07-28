$.define(["jQuery", "util", "form", "code", "pager"], "pagedatagrid", function($, util, form, code, pager) {
	var qf = ".dt-form",
		qt = ".dt-tpl",
		qp = ".dt-pager",
		derr = {},
		dajaxCfg = {},
		configPageIndex = function(fn, data) {
			if(fn && data && data.data && data.data.length) {
				var b = (data.pageNo - 1) * data.pageSize;
				data.data.forEach(function(obj) {
					++b;
					obj[fn] = b;
				});
			}
		},
		build = function($e, options) {
			if($e.length && $e.length === 1) {
				var config = { e: derr, ajax: dajaxCfg };
				var ele = config.ele = $($e[0]);
				config.f = form.build(ele.find(qf));
				config.c = code.parseCode(ele.find(qt)[0]);
				config.p = pager(ele.find(qp));
				config.uri = ele.attr("loadUri");
				config.pnn = ele.attr("pagerPrefix") ? "_pageNo" : "pageNo";
				config.psn = ele.attr("pagerPrefix") ? "_pageSize" : "pageSize";
				config.pageSize = parseInt(ele.attr("pageSize") || "1");
				config.pageNo = parseInt(ele.attr("pageNo") || "10");
				config.pageIndex = ele.attr("pageIndex");
				if(options) {
					$.extend(config, options);
				};
				var ret = {
					code: config.c,
					form: config.f,
					queryParam:function(){
						return config.cache;
					},
					load: function() {
						if(config.f.validate()) {
							config.cache = config.f.val();
							config.cache[config.pnn] = config.pageNo;
							config.cache[config.psn] = config.pageSize;
							this.reload();
						}
					},
					reload: function() {
						util.get(config.uri, config.cache, function(data) {
							configPageIndex(config.pageIndex, data);
							config.c.val(data.data);
							config.p.paint(data);
						}, config.e, config.ajax);
					},
					error: function(eh) {
						config.e = eh;
					},
					beforeFill: function(h) {
						config.c.before(h);
					},
					ajaxConfig: function(cfg) {
						config.ajax = cfg;
					}
				};
				config.p.onGo(function(no) {
					config.cache[config.pnn] = no;
					ret.reload();
				});
				return ret;
			};
		};

	$.fn.pdg = function(option) {
		if(this.length && this.length === 1) {
			return build(this, option);
		}
	};
	return { build: build };
});