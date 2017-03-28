$.define(["jQuery", "doc", "util"], "upload", function($, doc, util) {
	var g_upload_ref = 1,
		upload_remove = function(form) {
			form.addClass("hide");
			setTimeout(function() { form.remove(); }, 1000);
		},
		over = function(xhr) {
			xhr.onerror = null;
			xhr.onload = null;
			xhr.ontimeout = null;
			xhr.onabort = null;
			if(xhr.upload) {
				xhr.upload.onprogress = null;
			}
		},
		uploader_create = function(uploader) {
			var form = doc.createElement("form");
			form.setAttribute("enctype", "multipart/form-data");
			form.setAttribute("class", "upload-form");
			form.setAttribute("testRef", "" + (new Date()).getTime());
			finput = doc.createElement("input");
			finput.setAttribute("type", "file");
			finput.setAttribute("name", "filename");
			if(uploader.accept) finput.setAttribute("accept", uploader.accept);
			form.appendChild(finput);
			$form = $(form);
			$file = $(finput);
			$file.on("change", function() {
				var files = finput.files,
					file, fsize, xhr, formData, eobj,eContext = {},
					abortUpload = function() {
						if(!eContext.state) {
							xhr.abort();
							raiseError("abort");
						}
					},
					raiseError = function(er, data) {
						if(!eContext.state) {
							over(xhr);
							eContext.state = er;
							if(uploader.fail) uploader.fail.call(eContext, er, data);
							if(!uploader.async) {
								uploader_create(uploader);
							}
						}
					},
					formData;
				if(files.length) {
					file = files[0];
					fsize = file.size;
					if(uploader.maxSize && uploader.maxSize < fsize) {
						(uploader.invalid || util.raise)({ code: "upload_size", msg: "fsize", detailMsg: "上传文件太大[size > " + fsize + "]" });
						return;
					}
					g_upload_ref++;
					$file.off("change");
					upload_remove($form);
					if(uploader.async) {
						uploader_create(uploader);
					}
					eContext.name = file.name;
					eContext.size = file.size;
					eContext.type = file.type;
					eContext.id=g_upload_ref;
					eContext.abort = abortUpload;
					formData = new FormData(form);
					xhr = new XMLHttpRequest();
					xhr.onerror = function() {
						raiseError("error");
					};
					xhr.onabort = function() {
						raiseError("abort");
					};
					xhr.ontimeout = function() {
						raiseError("timeout");
					};
					xhr.onload = function() {
						if(!eContext.state) {
							if(xhr.status == 200) {
								var ro, rs = xhr.responseText;
								if(rs) {
									try {
										ro = JSON.parse(rs);
									} catch(err) {
										raiseError("parse", err);
									}
									if(ro.success) {
										over();
										state = "done";
										if(uploader.done) {
											uploader.done.call(eContext, ro.data);
										}
										if(!uploader.async) {
											uploader_create(uploader);
										}
									} else {
										raiseError("logic", ro);
									}
								} else {
									raiseError("emptyResponseText");
								}
							} else {
								raiseError("invalidHttpStatus", xhr.statusText);
							}
						}
					};
					if(uploader.start) uploader.start.call(eContext);
					xhr.open("POST", uploader.uri);
					if(xhr.upload && uploader.notity) {
						xhr.upload.onprogress = function(event) {
							if(event.lengthComputable) {
								uploader.notity.call(eContext, event.total, event.loaded);
							}
						};
					}
					if(uploader.timeout) {
						try {
							xhr.timeout = uploader.timeout;
						} catch(er) {
							setTimeout(function() {
								raiseError("timeout");
							}, uploader.timeout);
						}
					}
					xhr.send(formData);
				}
			});
			$form.appendTo(uploader.render);
		};

	return {
		build: function(options) {
			if(options.render) {
				if(!options.render.jquery) {
					options.render = $(options.render);
				}
				if(options.render.length === 1) {
					uploader_create(options);
					return true;
				}
			}
		}
	};
});