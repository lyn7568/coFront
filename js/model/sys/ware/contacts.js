/**
 * Created by TT on 2018/4/20.
 */
;
spa_define(function() {
    return $.use(["spa","code","form","util"],function(spa,code,form,util){
        return {
            modal: function(data) {
                var root = spa.findInModal(".sys_ware_contacts");
                var qf = form.build(root.find(".queryForm"));
                var cr = code.parseCode(root.find(".dt-tpl"));
                var queryBtn = root.find(".queryForm .icon-search");
                cr.shell("bool",function(env){
                    var v = env.cd[this.k];
                    return v===true?"是":(v===false?"否":"");
                });
                var tableData = { data: [] },
                    allData = [];
                var query = function() {
                    tableData.data = allData;
                    cr.val(tableData.data);
                };
                var load = function() {
                    util.get("http://www.ekexiu.com/ajax/professor/qaOrgAuth", {orgId:data.data.orgId,orgAuth: "1"}, function(data) {
                        allData = data || [];
                        query();
                    }, {});
                };
                root.find(".dt-tpl").on("click", "th.opt-check>i.icon-st-check", function () {
                    var $this = $(this);
                    $this.toggleClass("checked");
                    if ($this.hasClass("checked")) {
                        root.find(".dt-tpl td.opt-check>i.icon-st-check").addClass("checked");
                    } else {
                        root.find(".dt-tpl td.opt-check>i.icon-st-check").removeClass("checked");
                    }
                });
                root.find(".dt-tpl").on("click", "td.opt-check>i.icon-st-check", function () {
                    var $this = $(this);
                    $this.toggleClass("checked");
                });
                root.find(".modal-ctrl .icon-times").on("click",function(){
                    spa.closeModal();
                });
                root.find(".opt-save").on("click",function(){
                    var $pro = root.find("td.opt-check>i.checked");
                    if($pro.length){
                        if($pro.length>5){
                            util.alert("联系人不超过五个");
                            return;
                        }
                        var professors = [];
                        $pro.each(function () {
                            professors.push($(this).attr("proId"));
                        });
                        util.post("../ajax/ware/contacts", {id: data.data.ids, professor: professors},function () {
                            spa.closeModal();
                            if(data.hand) {
                                data.hand();
                            }
                        });
                    }else {
                        util.alert("请选择一个联系人");
                    }
                });
                queryBtn.on("click", query);
                load();
            }
        };
    });
});