;
spa_define(function() {
	return $.use(["spa", "code", "util", "form"], function(spa, code, util, form) {
		return {
			modal: function(data) {
				var root = spa.findInModal(".sys_customer_myedit");
				root.find(".modal-ctrl .icon-times").on("click", function() {
					spa.closeModal();
				});
				var ef = form.build(root.find(".opt-form"));
				ef.val(data.data);
				var addf = form.build(root.find(".opt-addform"));
				var userid = util.data("loginUser").id;
				var cusername = util.data("loginUser").name;

				addf.val({
					professorId: data.data.id,
					cuserId: userid,
					cuserName: cusername
				});
				root.find(".opt-save").on("click", function() {
					addf.doPost("../ajax/sys/crecord", function() {
						var date = new Date(),
							month = date.getMonth() + 1,
							day = date.getDate();

						var myDate = "" + date.getFullYear() + (month > 9 ? month : ("0" + month)) + (day > 9 ? day : ("0" + day));
						var dd = {
							descp: addf.val().descp,
							cuserName: cusername,
							createTime: myDate
						};
						//var dd =;
						allData.push(dd);
						cr.val(allData);

						ef.doPost("../ajax/sys/cpow/updatacpow", function() {}, {});

					}, {});
				});
				var cr = code.parseCode(root.find(".dt-tpl"));
				cr.shell("showDay", function(env) {
					if (env.cd && env.cd[this.k]) {
						var day = env.cd[this.k];
						return day.substring(0, 4) + "-" + day.substring(4, 6) + "-" + day.substring(6, 8);
					}
					return "";
				});
				var allData;
				util.get("../ajax/sys/crecord/qrecord?professorId=" + data.data.id, null, function(data) {
					allData = data || [];
					cr.val(data);
				}, {});

			}
		};
	});
});