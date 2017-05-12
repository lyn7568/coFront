;
spa_define(function() {
	return $.use(["spa", "pagedatagrid", "util"], function(spa, pdgf, util) {
		return {
			main: function() {
				var root = spa.findInMain(".sys_customer_myindex");
				var pdg = pdgf.build(root);
				pdg.code.shell("showDay", function(env) {
					if (env.cd && env.cd[this.k]) {
						var day = env.cd[this.k];
						return day.substring(0, 4) + "-" + day.substring(4, 6) + "-" + day.substring(6, 8);
					}
					return "";
				});
				pdg.code.listen($.dict.doTransfer);
				root.find(".opt-query").on("click", function() {
					pdg.load();
				});
				pdg.load();
                root.find(".dt-tpl").on("click", "th.opt-check>i.icon-st-check", function() {
                    var $this = $(this);
                    $this.toggleClass("checked");
                    if($this.hasClass("checked")) {
                        root.find(".dt-tpl td.opt-check>i.icon-st-check").addClass("checked");
                    } else {
                        root.find(".dt-tpl td.opt-check>i.icon-st-check").removeClass("checked");
                    }
                });
                root.find(".dt-tpl").on("click", "td.opt-check>i.icon-st-check", function() {
                    var $this = $(this);
                    $this.toggleClass("checked");
                });
                root.find(".opt-mail").on("click", function() {
                    var $org = root.find("td.opt-check>i.checked");
                    if($org.length) {
                        var emails = [];
                        var phones = [];
                        var inviteCodes = [];
                        var names = [];
                        $org.each(function() {
                            emails.push($(this).attr("email"));
                            phones.push($(this).attr("phone"));
                            inviteCodes.push($(this).attr("inviteCode"));
                            names.push($(this).attr("name"));
                        });
                        var rd = {emails: emails, phones: phones,inviteCodes:inviteCodes,names:names};
                        spa.showModal("sys_customer_myindex_mail", rd);
                        // util.boxMsg({
                        // });
                    } else {
                        util.alert("请选择一个用户");
                    }
                });
				root.on("click", ".icon-edit", function() {
					var $this = $(this);
					var powerId = $this.parent().attr("powerId");
					util.get("../ajax/sys/mycustomer/id/" + powerId, null, function(rd) {
						if (rd) {
							spa.showModal("sys_customer_myedit", {
								data: rd,
								hand: function() {
									pdg.load()
								}
							})
						} else {
							util.alert("客户选择有误", function() {
								pdg.load();
							});
						}
					}, {});
				});
                root.on("click",".table-opt a.name", function () {
                    var professorId = $(this).parent().attr("professorId");
                    window.open('http://www.ekexiu.com/information-brow.html?professorId=' + professorId);
                });
			}
		};
	});
});