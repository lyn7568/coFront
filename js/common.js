if(typeof jQuery === 'undefined') {
	throw new Error('this JavaScript requires jQuery')
} +

!(function($, win, doc) {
	var mds = {};
	mds["jQuery"] = $;
	mds["win"] = win;
	mds["doc"] = doc;
	mds["body"] = $("body");
	$.define = function(deps, id, factory) {
		var dm = [];
		for(var i = 0; i < deps.length; ++i) {
			var dep = mds[deps[i]];
			if(dep) {
				dm.push(dep);
			} else {
				throw new Error("no found model [" + deps[i] + "]");
			}
		}
		try {
			var md = factory.apply(win, dm);
			mds[id] = md;
		} catch {
			throw new Error("build model[" + id + "] error");
		}
	};
	$.use = function(deps, handle) {
		var dm = [];
		for(var i = 0; i < deps.length; ++i) {
			var dep = mds[deps[i]];
			if(dep) {
				dm.push(dep);
			} else {
				throw new Error("no found model [" + deps[i] + "]");
			}
		}
		handle.apply(win, dm);
	};
})(jQuery, window, document);
