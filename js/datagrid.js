$.define(["jQuery", "util", "form", "code"], "dataGrid", function($, util, form, code) {
	var qf = ".dt-form",
		qt = ".dt-tpl",
		derr = {},
		dajaxCfg = {},
		build = function($e, options) {
			if($e.length && $e.length === 1) {
				var config = { e: derr, ajax: dajaxCfg };
				var ele = config.ele = $($e[0]);
				config.f = form.build(ele.find(qf));
				config.c = code.parseCode(ele.find(qt)[0]);
				config.uri = ele.attr("loadUri");
				if(options) {
					//						if(option.error) {
					//							config.e = option.error;
					//						}
					//						if(option.ajax) {
					//							config.ajax = option.ajax;
					//						}
					//						if(option.beforeFill) {
					//							config.c.before(option.beforeFill);
					//						}
					$.extend(config, options);
				}
				return {
					code: config.c;
					form: config f;
					load: function() {
						config.f.doGet(config.uri, function(data) {
							config.c.val(data);
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
				}
			}
		};

	$.fn.dg = function(option) {
		if(this.length && this.length === 1) {
			return build(this, option);
		}
	};
	return { build: build };
});