$.use(["jQuery", "form", "doc", "util", "dropdown"], function($, form, doc, util, dd) {
	var m_rd = "必选的",
		readOnly = "readOnly",
		dd_ctn = "dd-ctn",
		dd_clean = "dd-clean",
		showOnly = "showOnly",
		modelName = 'date',
		def = "defVal",
		placeholder = "placeholder",
		required = "required",

		date_year = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		date_leapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		date_isleap = function(y) {
			return(y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
		},
		date_validDate = function(v) {
			if(v.length != 8) return false;
			for(var i = 0; i < 8; ++i) {
				var c = v.charAt(i);
				if(c > '9' || c < '0') return false;
			}
			var m = parseInt(v.substring(4, 6)) - 1;
			if(m < 0 || m > 11) return false;
			var d = parseInt(v.substring(6, 8));
			var ym = date_isleap(parseInt(v.substring(0, 4))) ? date_leapYear : date_year;
			if(d < 1 || d > ym[m]) return false;
			return true;
		},
		date_fmt = function(v) {
			return(v > 9 ? "" : "0") + v;
		},
		date_MS_IN_DAY = 24 * 60 * 60 * 1000,
		date_incDay = function(d) {
			return new Date(d.getTime() + date_MS_IN_DAY);
		},
		date_decDay = function(d) {
			return new Date(d.getTime() - date_MS_IN_DAY);
		},
		date_dayFmt = function(d) {
			return "" + d.getFullYear() + date_fmt(d.getMonth() + 1) + date_fmt(d.getDate());
		},
		date_now = function() {
			var d = new Date();
			return "" + d.getFullYear() + date_fmt(d.getMonth() + 1) + date_fmt(d.getDate()) + date_fmt(d.getHours()) + date_fmt(d.getMinutes()) + date_fmt(d.getSeconds());
		},
		table_year = { an: "year", av: "" },
		table_month = { an: "month", av: "" },
		daySwitch = [""],
		thead = {
			tn: "thead",
			chs: [{
				tn: "tr",
				chs: [
					{ tn: "th", attrs: [{ an: "class", av: "prev-year" }], chs: [{ tn: "i", attrs: [{ an: "class", av: "icon-arrow-left" }] }] },
					{ tn: "th", attrs: [{ an: "class", av: "prev-month" }], chs: [{ tn: "i", attrs: [{ an: "class", av: "icon-chevron-left" }] }] },
					{ tn: "th", attrs: [{ an: "class", av: "switch" }, { an: "colspan", av: "3" }], chs: daySwitch },
					{ tn: "th", attrs: [{ an: "class", av: "next-month" }], chs: [{ tn: "i", attrs: [{ an: "class", av: "icon-chevron-right" }] }] },
					{ tn: "th", attrs: [{ an: "class", av: "next-year" }], chs: [{ tn: "i", attrs: [{ an: "class", av: "icon-arrow-right" }] }] }
				]
			}, {
				tn: "tr",
				chs: [
					{ tn: "th", attrs: [{ an: "class", av: "dow" }], chs: ["日"] },
					{ tn: "th", attrs: [{ an: "class", av: "dow" }], chs: ["一"] },
					{ tn: "th", attrs: [{ an: "class", av: "dow" }], chs: ["二"] },
					{ tn: "th", attrs: [{ an: "class", av: "dow" }], chs: ["三"] },
					{ tn: "th", attrs: [{ an: "class", av: "dow" }], chs: ["四"] },
					{ tn: "th", attrs: [{ an: "class", av: "dow" }], chs: ["五"] },
					{ tn: "th", attrs: [{ an: "class", av: "dow" }], chs: ["六"] },
				]
			}]
		},
		tbody = { tn: "tbody" },
		tfoot = { tn: "tfoot" },
		table = { tn: "table", attrs: [{ an: "class", av: "day" }, table_year, table_month], chs: [thead, tbody, tfoot] },
		date_drop = { tn: "div", attrs: [{ an: "class", av: "dd-drop date" }], chs: [table] },
		show_day = function($e, y, m) {
			table_year.av = "" + y;
			table_month.av = "" + (m + 1);
			daySwitch[0] = date_fmt(m + 1) + "月 " + y + "年";
			var dd = new Date();
			dd.setFullYear(y);
			dd.setMonth(m);
			dd.setDate(1);
			var dayInWeek = dd.getDay();
			tbody.chs = [];
			var weekDays = { tn: "tr" };
			var days = weekDays.chs = [];
			for(var i = 0; i < dayInWeek; ++i) {
				var cd = date_dayFmt(new Date(dd.getTime() - ((dayInWeek - i) * date_MS_IN_DAY)));
				days.push({ tn: "td", attrs: [{ an: "class", av: "no-current-month" }, { an: "day", av: "" + cd }], chs: [cd.substring(6, 8)] });
			}
			var ld = date_isleap(y) ? date_leapYear[m] : date_year[m];
			for(var i = 0; i < ld; ++i) {
				var cd = date_dayFmt(dd);
				days.push({ tn: "td", attrs: [{ an: "class", av: "day-item" }, { an: "day", av: "" + cd }], chs: [cd.substring(6, 8)] });
				if(dd.getDay() == 6) {
					tbody.chs.push(weekDays);
					weekDays = { tn: "tr" };
					days = weekDays.chs = [];
				}
				dd = date_incDay(dd);
			}
			dayInWeek = dd.getDay();
			if(dayInWeek) {
				for(var i = dayInWeek; i < 7; ++i) {
					var cd = date_dayFmt(dd);
					days.push({ tn: "td", attrs: [{ an: "class", av: "no-current-month" }, { an: "day", av: "" + cd }], chs: [cd.substring(6, 8)] });
					dd = date_incDay(dd);
				}
				tbody.chs.push(weekDays);
			}
			$e.find(".dd-drop").remove();
			util.appendChild($e[0], date_drop);
		},

		handCode = { an: "code", av: "" },
		pa = [""],
		jhref = { an: "href", av: "javascript:;" },
		dd_hand = { an: "class", av: "dd-hand" },
		icon_drop = { tn: "i", attrs: [{ an: "class", av: "icon icon-drop" }] },
		icon_close = { tn: "i", attrs: [{ an: "class", av: "icon icon-close" }] },
		a_placeHolder = { tn: "a", attrs: [jhref, { an: "class", av: placeholder }], chs: pa },
		hand = {
			tn: "a",
			attrs: [
				dd_hand,
				jhref,
				handCode,
			],
			chs: [
				icon_drop,
				{ tn: "span" },
				icon_close,
				a_placeHolder,
			]
		};
	form.register(function($e) {
		var cls = util.classCheck($e[0], [readOnly, showOnly, modelName, required]),
			rv;
		if(cls[modelName]) {
			var n = $e.attr("name") || $e.attr("id"),
				rules = [];
			if(!n) {
				throw "Attribute[name] is invalid";
			}
			var dv = $e.attr(def) || "";

			$e.empty().addClass(dd_ctn).addClass(dd_clean);
			pa[0] = $e.attr(placeholder) || "请选择日期......";
			util.appendChild($e[0], hand);
			var $h = $e.children("a");
			var $span = $h.children("span");
			var date_change = function(val) {
				if(val) {
					if(val == "current") {
						val = date_now().substr(0, 8);
					}
					var dt = val.substring(0, 4) + "-" + val.substring(4, 6) + "-" + val.substring(6, 8);
					if(rv !== val) {
						$h.attr("code", val);
						$span.text(dt);
						rv = val;
					}
				} else {
					rv = "";
					$h.attr("code", "");
					$span.text("");
				}
			};
			date_change(dv);

			if(!(cls[readOnly] || cls[showOnly])) {
				$e.on("shown.dropdown", function(evt) {
					var dp_chs = [];
					var n = date_now();
					var val = rv ? (date_validDate(rv) ? rv : n) : n;
					show_day($e, parseInt(val.substring(0, 4)), parseInt(val.substring(4, 6)) - 1);

				});
				$e.find(".icon-close").on("click", function(evt) {
					date_change("");
					$e.addClass("dd-hold-once");
				});
				$e.on("click", ".day .day-item , .day .no-current-month", function() {
					date_change(this.getAttribute("day"));
				});
				$e.on("click", ".day .prev-year", function(e) {
					var date_tb = $e.find("table"),
						yv = parseInt(date_tb.attr("year")) - 1,
						mv = parseInt(date_tb.attr("month")) - 1;
					$e.addClass("dd-hold-once");
					show_day($e, yv, mv);
				});
				$e.on("click", ".day .prev-month", function(e) {
					var date_tb = $e.find("table"),
						yv = parseInt(date_tb.attr("year")),
						mv = parseInt(date_tb.attr("month")) - 2;
					if(0 > mv) {
						yv -= 1;
						mv = 11
					}
					$e.addClass("dd-hold-once");
					show_day($e, yv, mv);

				});
				$e.on("click", ".day .next-year", function(e) {
					var date_tb = $e.find("table"),
						yv = parseInt(date_tb.attr("year")) + 1,
						mv = parseInt(date_tb.attr("month")) - 1;
					$e.addClass("dd-hold-once");
					show_day($e, yv, mv);
				});
				$e.on("click", ".day .next-month", function(e) {
					var date_tb = $e.find("table"),
						yv = parseInt(date_tb.attr("year")),
						mv = parseInt(date_tb.attr("month"));
					if(mv === 12) {
						yv += 1;
						mv = 0
					}
					$e.addClass("dd-hold-once");
					show_day($e, yv, mv);
				});
			}

			return {
				name: n,
				get: function() {
					return rv ? rv : undefined;
				},
				set: function(data) {
					change_date(data ? data : "");
				},
				validate: function() {
					if(cls[required]) {
						if(!rv) {
							this.invalid(m_rd);
							return m_rd;
						}
					}
					return util.validate(rules, this);
				},
				addRules: function(rule) {
					util.addRules(rules, rule);
				},
				reset: function() {
					this.set(dv);
				},
				valid: function() { util.valid($e); },
				invalid: function(reson) {
					util.invalid($e);
					util.error(reson);
				}
			};
		}

	});
});