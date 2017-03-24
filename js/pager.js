$.define(["jQuery", "util"], "pager", function($, util) {
	var sli = { tn: "li", chs: [{ tn: "a", attrs: [{ an: "href", av: "javascript:;" }], chs: ["..."] }] };

	function li(clses, dpn, rpn) {
		return { tn: "li", attrs: [{ an: "class", av: clses }, { an: "no", av: "" + rpn }], chs: [{ tn: "a", attrs: [{ an: "href", av: "javascript:;" }], chs: ["" + dpn] }] };
	}

	function calc(data) {
		var pages = Math.ceil(data.total / data.pageSize),
			no = data.pageNo,
			i = no - 2,
			ret = [],
			clses, dpn, rpn;

		ret.push(li(no > 1 ? "active":"disabled", "«", no - 1));
		ret.push(li(no === 1 ? "curr" :"active", "1", 1));

		if(no > 4) {
			ret.push(sli);
		}
		for(i = Math.max(2, no - 2); i < no; ++i) {
			ret.push(li("active", i, i));
		}
		if(no != 1) {
			ret.push(li("curr", no, no));
		}
		i = no + 1;
		var min = Math.min(pages, no + 3);
		for(; i < min; ++i) {
			ret.push(li("active", i, i));
		}
		if(pages - no > 3) {
			ret.push(sli);
		}
		if(pages != no) {
			ret.push(li("active", pages, pages));
		}
		ret.push(li(no != pages ? "active" :"disabled", "»", no + 1));
		return ret;

	}

	return function($e) {
		var e = $e,
			h = util.noop;
		e.empty();
		return {
			paint: function(data) {
				e.empty();
				if(data.total) {
					util.appendChild(e[0], calc(data));
					e.children("li.active").on("click", function() {
						h(parseInt($(this).attr("no")));
					});
				}
			},
			onGo: function(goh) {
				if(goh) {
					h = goh;
				}
			}
		};
	};
});