$.define(["jQuery", "util", "doc"], "dropdown", function($, util, doc) {

	var dd_bg = "dd_bg",
		q_dd_bg = ".dd_bg",
		dd_ctn = ".dd-ctn",
		q_dd_ctn = ".dd-ctn",
		dd_hand = "dd-hand",
		q_dd_hand = ".dd-hand",
		open = "open",
		dd_clean = "dd-clean",
		dd_drop = "dd-drop",
		q_dd_drop = ".dd-drop",
		dd_hold = "dd-hold",
		dd_hold_once = "dd-hold-once",
		readOnly = "readOnly",
		showOnly = "showOnly",
		clearMenus = function(e) {
			if(e && e.which === 3) return
			$(q_dd_bg).remove();
			$(q_dd_ctn).each(function() {
				var $this = $(this),cls = util.classCheck(this, [open, dd_hold, dd_hold_once, dd_clean]);
				relatedTarget = {
					relatedTarget: this
				};
				if(!cls[open]) return; //hasClass('open')
				if(cls[dd_hold]) return; //hasClass('dd-hold')
				if(cls[dd_hold_once]) { //hasClass('dd-hold-once')
					$this.removeClass(dd_hold_once);
					return;
				}
				$this.trigger(evt = $.Event('hide.dropdown', relatedTarget));
				if(evt.isDefaultPrevented()) return;
				$this.removeClass(open).trigger('hidden.dropdown', relatedTarget);
				if(cls[dd_clean]) {
					$this.find(q_dd_drop).remove();
				}
			});
		},
		toggle = function(e) {
			var $this = $(this),
				$ddc = $this.parents(q_dd_ctn);
			if(!$ddc.length) return;
			var cls = util.classCheck($ddc[0], [open, readOnly, showOnly, dd_hold, dd_hold_once]);
			clearMenus();
			if(!cls[open]) {
				if(cls[readOnly] || cls[showOnly]) return;
				if(cls[dd_hold]) return false;
				if(cls[dd_hold_once]) {
					$ddc.removeClass(dd_hold_once);
					return false;
				}
				var relatedTarget = {
					relatedTarget: this
				}
				$ddc.trigger(e = $.Event('show.dropdown', relatedTarget));
				if(e.isDefaultPrevented()) return
				$ddc.addClass(open).trigger('shown.dropdown', relatedTarget);
			}
			return false;
		};
	$(doc).on("click.dropdown", clearMenus).on("click.dropdown", q_dd_hand, toggle);

	return {
		hold: function($e) {
			var $p = $e.parents(q_dd_ctn);
			if($p.length) {
				$($p[0]).addClass(dd_hold);
			}
		},
		holdOnce: function($e) {
			var $p = $e.parents(q_dd_ctn);
			if($p.length) {
				$($p[0]).addClass(dd_hold_once);
			}
		}
	};
});