
var enable_cropping = false //Toggle b/w true or false to enable/disable cropping. Do clear cache and ctr+f5 to see changes.


function deletePhoto(photoId){
	$.ajax({
	    type: "POST",
	    url: "/staff/photos/ajaxdeletephoto/" + photoId,
	    dataType:'html',
	    success: function(data){
	    	if(data=='true'){
		    	$('#photo_'+photoId).remove();
	    	}else{
	    		alert(data);
	    	}
        }
    });
}
function deleteCoverPhoto(photoId){
	$.ajax({
	    type: "POST",
	    url: "/staff/utils/delete-cover-photo/" + photoId + "/",
	    dataType:'html',
	    success: function(data){
	    	if(data=='true'){
		    	$('#id_coverphoto').remove();
	    	}else{
	    		alert(data);
	    	}
        }
    });
}
function saveCoverPhoto(photoId){
	$.ajax({
		type: "POST",
		url: "/staff/utils/update-cover-photo/"+photoId+"/",
		data: "cover_x1="+$('#cover_x1').val()+"&cover_y1="+$('#cover_y1').val()+"&cover_x2="+$('#cover_x2').val()+"&cover_y2="+$('#cover_y2').val()+"&cover_height="+$('#cover_height').val()+"&cover_width="+$('#cover_width').val(),
		dataType:'HTML',
		success: function(data){
			if(data=="Success"){
				$('#cover_x1').val('');
				$('#cover_y1').val('');
				$('#cover_x2').val('');
				$('#cover_y2').val('');
				$('#cover_height').val('');
				$('#cover_width').val('');
				$('.cropper_ajax_ctrl').hide();
			}
		}
	});
}
function config_image_uploader(limit, imgUploaderId){
	var container = true;
	var maxnum = $("#"+imgUploaderId+" .file-upload-cont li").length;
	var imagelimit = limit;
	var cont = $('#'+imgUploaderId+' .file-upload-cont');
    $('#'+imgUploaderId+' .file-upload').fileupload({
        limitConcurrentUploads: 6,
        //uploadedBytes:100,
        //loadImageMaxFileSize:100,
        //maxChunkSize:100,
        add: function (e, data) {
        	maxnum = $("#"+imgUploaderId+" .file-upload-cont li").length;
            if(maxnum < imagelimit){
                var uploadErrors = [];
                var acceptFileTypes = /^image\/(gif|jpe?g|png)$/i;
                if(!acceptFileTypes.test(data.originalFiles[0]['type'])) {
                    uploadErrors.push('Not an accepted file type');
                }
                if(data.originalFiles[0]['size'] > 5000000) {
                    uploadErrors.push('Filesize is too big');
                }
                if(uploadErrors.length > 0) {
                    alert(uploadErrors.join("\n"));
                } else {
                    if(container === false){
                        cont = $('<div class="tMbS tWcL pDfX file-upload-cont"/>').appendTo('#'+imgUploaderId);
                        container = true;
                    }
                    data.list = $('<li/>').html('<div class="up-list"><div class="img-cont"><div class="cont"><div class="progress fade in"><div class="bar" style="width: 0%;"></div></div></div></div><div class="img-details"><input class="caption" type="text" placeholder="Write a Caption"/><a class="delete" href="javascript:void(0)"><i class="bUi-iCn-rCyL-16" aria-hidden="true"></i></a></div></div>')
                    cont.append(data.list);
                    data.submit();
                }
            }else{
				show_alert_msg(gettext('You can upload only ('+limit+') photos!'),'e');
            }
        },
        progress : function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            data.list.find('.bar').css('width', progress+'%');
        },
        done: function (e, data) {
        	var jsondata = JSON.parse(data._response.result);
       		if (data.files && data.files[0]) {
                //var reader = new FileReader();
                //reader.onload = function(e) {
                    data.list.find('.progress').removeClass('in');
                    data.list.find('.img-cont .cont').append('<img src="'+jsondata.imgurl+'" class="fade"/> <!-- span class="lBl">Primary image</span -->');
                    data.list.find('.img-cont .cont').append('<input type="hidden" name="photo_id" value="'+jsondata.id+'">');
                    data.list.find('.img-details input.caption').val(jsondata.caption);
                    data.list.find('.img-details input.caption').attr('name', "photo_caption_" + jsondata.id);
                    data.list.find('.img-details a.delete').attr('onclick', 'deletePhoto('+jsondata.id+')');
                    data.list.attr('id', 'photo_'+jsondata.id);
                    setTimeout(function(){data.list.find('img').addClass('in');},300);
                }
                //reader.readAsDataURL(data.files[0]);
            //}
        }

    });
	$('#'+imgUploaderId+' .file-upload-btn').click(function(event) {
	    $(this).parent().find('.file-upload').trigger('click');
	});
}

function config_cover_uploader(aspectRatio){
	var maxnum = $("#coverUploader .file-upload-cont li").length;
	var imagelimit = 1;
	var preview_width = 200;
	var min_cropper_width = 300;
	var cont = $('#coverUploader .file-upload-cont');
	$('#coverUploader .file-upload-cont .img-cont').css('width', preview_width);
	$('#coverUploader .file-upload-cont .img-cont').css('height', preview_width / aspectRatio);
    $('#coverUploader .file-upload').fileupload({
        limitConcurrentUploads: 6,
        add: function (e, data) {
        	maxnum = $("#coverUploader .file-upload-cont li").length;
            if(maxnum < imagelimit){
                var uploadErrors = [];
                var acceptFileTypes = /^image\/(gif|jpe?g|png)$/i;
                if(!acceptFileTypes.test(data.originalFiles[0]['type'])) {
                    uploadErrors.push('Not an accepted file type');
                }
                if(data.originalFiles[0]['size'] > 5000000) {
                    uploadErrors.push('Filesize is too big');
                }
                if(uploadErrors.length > 0) {
                    alert(uploadErrors.join("\n"));
                } else {
                	
                    var template = "";
                    template += '<p style="color: #B8B8B8;" class="cropper_controls cropper_ajax_ctrl">Crop your image:</p>'
                    template += '<div class="cropper_ajax_ctrl img_holder"></div>'
                    template += '<p class="cropper_ajax_ctrl controls" style="visibility: visible; width: 96px; float: right; bottom: -4px;">'
                    template += '    <small class="cropper_controls save_button" style="float: right;"><a href="javascript: void(0);" onclick="" style="text-indent: unset; font-size: 14px; color: white; border-radius: 4px; display: block; height: 21px; background: none repeat scroll 0% 0% gray; padding-left: 5px; width: 37px;">Save</a></small>'
                    template += '    <small class="cropper_controls delete_button" style="float: left;"><a href="javascript: void(0);" onclick="" style="text-indent: unset; font-size: 14px; color: white; border-radius: 4px; height: 21px; background: none repeat scroll 0% 0% gray; padding-left: 5px; width: 45px; display: block;">Delete</a></small>'
                    template += '</p>'
                    template += '<span class="icon-tick"></span>'
                    template += '<p style="color: #B8B8B8; margin: 5px 0 10px;" class="cropper_controls cropper_ajax_ctrl">Preview:</p>'
                    template += '<div class="up-list preview_holder"><div class="img-cont"><div class="cont"><div class="cropper-preview cropper_controls"></div></div></div><div class="img-details"><a href="javascript:void(0)" class="delete delete_button" onclick=""><i aria-hidden="true" class="bUi-iCn-rCyL-16"></i></a></div></div>'
                    
                    data.list = $('<li id="id_coverphoto" class="bm-uploader-file finished template-download" style="width: 100%;" />').html(template)
                    cont.append(data.list);
                    data.submit();
                }
            }else{
				show_alert_msg(gettext('You can upload only one cover photo!'));
            }
        },
        progress : function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            data.list.find('.bar').css('width', progress+'%');
        },
        done: function (e, data) {
        	var jsondata = JSON.parse(data._response.result);
       		if (data.files && data.files[0]) {
                //var reader = new FileReader();
                //reader.onload = function(e) {
                    data.list.find('.progress').removeClass('in');
                    data.list.find('.img_holder').append('<img src="'+jsondata.imgurl+'" id="cover_img" class="cropper fade"/>');
                    data.list.find('.img_holder').append('<input type="hidden" name="cover_id" value="'+jsondata.id+'">');
                    data.list.find('.save_button').attr('onclick', 'saveCoverPhoto('+jsondata.id+')');
                    data.list.find('.delete_button').attr('onclick', 'deleteCoverPhoto('+jsondata.id+')');
                    setTimeout(function(){
                    	data.list.find('img').addClass('in');
                    	$("#coverUploader .cropper_controls.cropper-preview")
                    		.css("width", preview_width)
        		    		.css("height", preview_width / aspectRatio)
        		    		.css("overflow", "hidden");
                    	$("#coverUploader .preview_holder")
                    		.css("width", preview_width + 10)
                    		.css("height", (preview_width / aspectRatio) + 10);
                    	$("#coverUploader .preview_holder .img-cont").css("height", preview_width / aspectRatio);
                    	if(enable_cropping){
                    		$("#coverUploader .cropper").cropper({
            				    aspectRatio: aspectRatio,
            				    minWidth: min_cropper_width,
            				    minHeight: min_cropper_width / aspectRatio,
            				    preview: ".cropper-preview",
            				    done: function(data) {
            				    	$('#cover_x1').val(data.x);
            				    	$('#cover_y1').val(data.y);
            				    	$('#cover_x2').val(data.x + data.width);
            				    	$('#cover_y2').val(data.y + data.height);
            				    }
            				});
                    	}else{
                    		$("#coverUploader .cropper").cropper({
            				    //minWidth: min_cropper_width,
            				    //minHeight: min_cropper_width / aspectRatio,
            				    preview: ".cropper-preview",
            				    done: function(data) {
            				    	$('#cover_x1').val(data.x);
            				    	$('#cover_y1').val(data.y);
            				    	$('#cover_x2').val(data.x + data.width);
            				    	$('#cover_y2').val(data.y + data.height);
            				    }
            				});
                    	}
                    },300);
                //}
                //reader.readAsDataURL(data.files[0]);
            }
        }

    });
	$('#coverUploader .file-upload-btn').click(function(event) {
	    $(this).parent().find('.file-upload').trigger('click');
	});
}

function deleteFile(fileId){
	$.ajax({
	    type: "POST",
	    url: "/staff/articles/deletefiles/" + fileId + "/",
	    dataType:'html',
	    success: function(data){
	    	if(data=='true'){
		    	$('#file_'+fileId).remove();
	    	}else{
	    		alert(data);
	    	}
        }
    });
}
function config_file_uploader(limit, imgUploaderId){
	var maxnum = $("#"+imgUploaderId+" .file-upload-cont li").length;
	var imagelimit = limit;
	var cont = $('#'+imgUploaderId+' .file-upload-cont');
    $('#'+imgUploaderId+' .file-upload').fileupload({
        limitConcurrentUploads: 6,
        add: function (e, data) {
        	maxnum = $("#"+imgUploaderId+" .file-upload-cont li").length;
            if(maxnum < imagelimit){
                var uploadErrors = [];
                var acceptFileTypes = /(\.|\/)(plain|msword|pdf)$/i;
                if(!acceptFileTypes.test(data.originalFiles[0]['type'])) {
                    uploadErrors.push('Not an accepted file type');
                }
                if(data.originalFiles[0]['size'] > 5000000) {
                    uploadErrors.push('Filesize is too big');
                }
                if(uploadErrors.length > 0) {
                    alert(uploadErrors.join("\n"));
                } else {
                    data.list = $('<li/>').html('<div class="up-list"><div class="img-details"></div></div>')
                    cont.append(data.list);
                    data.submit();
                }
            }else{
				show_alert_msg(gettext('You can upload only ('+limit+') photos!'),'e');
            }
        },
        progress : function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            data.list.find('.bar').css('width', progress+'%');
        },
        done: function (e, data) {
        	var jsondata = JSON.parse(data._response.result);
       		if (data.files && data.files[0]) {
                //var reader = new FileReader();
                //reader.onload = function(e) {
                    data.list.find('.progress').removeClass('in');
                    data.list.find('.img-details').append('<input type="hidden" name="new_files" value="'+jsondata.id+'">');
                    data.list.find('.img-details').append('<input type="text" disabled="disabled" value="'+jsondata.title+'" class="caption" style="color: black;">');
                    data.list.find('.img-details').append('<a onclick="deleteFile('+jsondata.id+')" class="delete" href="javascript:void(0)"><i class="bUi-iCn-rCyL-16" aria-hidden="true"></i></a>');
                    data.list.attr('id', 'file_'+jsondata.id);
                    setTimeout(function(){data.list.find('img').addClass('in');},300);
                }
                //reader.readAsDataURL(data.files[0]);
            //}
        }

    });
	$('#'+imgUploaderId+' .file-upload-btn').click(function(event) {
	    $(this).parent().find('.file-upload').trigger('click');
	});
}


var enable_cropping = false //Toggle b/w true or false to enable/disable cropping. Do clear cache and ctr+f5 to see changes.

function saveBizLogo(photoId){
	$.ajax({
		type: "POST",
		url: "/staff/utils/update-cover-logo/"+photoId+"/",
		data: "logo_x1="+$('#logo_x1').val()+"&logo_y1="+$('#logo_y1').val()+"&logo_x2="+$('#logo_x2').val()+"&logo_y2="+$('#logo_y2').val()+"&logo_height="+$('#logo_height').val()+"&logo_width="+$('#logo_width').val(),
		dataType:'HTML',
		success: function(data){
			if(data=="Success"){
				$('#logo_x1').val('');
				$('#logo_y1').val('');
				$('#logo_x2').val('');
				$('#logo_y2').val('');
				$('#logo_height').val('');
				$('#logo_width').val('');
				$('.cropper_ajax_ctrl').hide();
			}
		}
	});
}


function deleteBizLogo(logoId){
	$.ajax({
	    type: "POST",
	    url: "/staff/clients/deletelogo/" + logoId + "/",
	    dataType:'html',
	    success: function(data){
	    	if(data=='true'){
		    	$('#id_coverphoto').remove();
	    	}else{
	    		alert(data);
	    	}
        }
    });
}


function config_logo_uploader(aspectRatio){
	var maxnum = $("#logoUploader .file-upload-cont li").length;
	var imagelimit = 1;
	var preview_width = 200;
	var min_cropper_width = 300;
	var cont = $('#logoUploader .file-upload-cont');
	$('#logoUploader .file-upload-cont .img-cont').css('width', preview_width);
	$('#logoUploader .file-upload-cont .img-cont').css('height', preview_width / aspectRatio);
    $('#logoUploader .file-upload').fileupload({
        limitConcurrentUploads: 6,
        add: function (e, data) {
        	maxnum = $("#logoUploader .file-upload-cont li").length;
            if(maxnum < imagelimit){
                var uploadErrors = [];
                var acceptFileTypes = /^image\/(gif|jpe?g|png)$/i;
                if(!acceptFileTypes.test(data.originalFiles[0]['type'])) {
                    uploadErrors.push('Not an accepted file type');
                }
                if(data.originalFiles[0]['size'] > 5000000) {
                    uploadErrors.push('Filesize is too big');
                }
                if(uploadErrors.length > 0) {
                    alert(uploadErrors.join("\n"));
                } else {
                	
                    var template = "";
                    template += '<p style="color: #B8B8B8;" class="cropper_controls cropper_ajax_ctrl">Crop your image:</p>'
                    template += '<div class="cropper_ajax_ctrl img_holder"></div>'
                    template += '<p class="cropper_ajax_ctrl controls" style="visibility: visible; width: 96px; float: right; bottom: -4px;">'
                    template += '    <small class="cropper_controls save_button" style="float: right;"><a href="javascript: void(0);" onclick="" style="text-indent: unset; font-size: 14px; color: white; border-radius: 4px; display: block; height: 21px; background: none repeat scroll 0% 0% gray; padding-left: 5px; width: 37px;">Save</a></small>'
                    template += '    <small class="cropper_controls delete_button" style="float: left;"><a href="javascript: void(0);" onclick="" style="text-indent: unset; font-size: 14px; color: white; border-radius: 4px; height: 21px; background: none repeat scroll 0% 0% gray; padding-left: 5px; width: 45px; display: block;">Delete</a></small>'
                    template += '</p>'
                    template += '<span class="icon-tick"></span>'
                    template += '<p style="color: #B8B8B8; margin: 5px 0 10px;" class="cropper_controls cropper_ajax_ctrl">Preview:</p>'
                    template += '<div class="up-list preview_holder"><div class="img-cont"><div class="cont"><div class="cropper-preview cropper_controls"></div></div></div><div class="img-details"><a href="javascript:void(0)" class="delete delete_button" onclick=""><i aria-hidden="true" class="bUi-iCn-rCyL-16"></i></a></div></div>'
                    
                    data.list = $('<li id="id_coverphoto" class="bm-uploader-file finished template-download" style="width: 100%;" />').html(template)
                    cont.append(data.list);
                    data.submit();
                }
            }else{
				show_alert_msg(gettext('You can upload only one logo!'),'e');
            }
        },
        progress : function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            data.list.find('.bar').css('width', progress+'%');
        },
        done: function (e, data) {
        	var jsondata = JSON.parse(data._response.result);
       		if (data.files && data.files[0]) {
                //var reader = new FileReader();
                //reader.onload = function(e) {
                    data.list.find('.progress').removeClass('in');
                    data.list.find('.img_holder').append('<img src="'+jsondata.imgurl+'" id="cover_img" class="cropper fade"/>');
                    data.list.find('.img_holder').append('<input type="hidden" name="new_pic" value="'+jsondata.id+'">');
                    data.list.find('.save_button').attr('onclick', 'saveBizLogo('+jsondata.id+')');
                    data.list.find('.delete_button').attr('onclick', 'deleteBizLogo('+jsondata.id+')');
                    setTimeout(function(){
                    	data.list.find('img').addClass('in');
                    	$("#logoUploader .cropper_controls.cropper-preview")
                    		.css("width", preview_width)
        		    		.css("height", preview_width / aspectRatio)
        		    		.css("overflow", "hidden");
                    	$("#logoUploader .preview_holder")
                    		.css("width", preview_width)
                    		.css("height", preview_width / aspectRatio);
                    	$("#logoUploader .preview_holder .img-cont").css("height", preview_width - 10);
                    	if(enable_cropping){	
	                    	$("#logoUploader .cropper").cropper({
	        				    aspectRatio: aspectRatio,
	        				    minWidth: min_cropper_width,
	        				    minHeight: min_cropper_width / aspectRatio,
	        				    preview: ".cropper-preview",
	        				    done: function(data) {
	        				    	$('#logo_x1').val(data.x);
	        				    	$('#logo_y1').val(data.y);
	        				    	$('#logo_x2').val(data.x + data.width);
	        				    	$('#logo_y2').val(data.y + data.height);
	        				    }
	        				});
                    	}else{
                    		$("#logoUploader .cropper").cropper({
	        				    //minWidth: min_cropper_width,
	        				    //minHeight: min_cropper_width / aspectRatio,
	        				    preview: ".cropper-preview",
	        				    done: function(data) {
	        				    	$('#logo_x1').val(data.x);
	        				    	$('#logo_y1').val(data.y);
	        				    	$('#logo_x2').val(data.x + data.width);
	        				    	$('#logo_y2').val(data.y + data.height);
	        				    }
	        				});
                    	}
                    	setTimeout(function(){
        		    		$("#logoUploader .cropper_controls.cropper-preview img").css("max-width", 'none');
                    	}, 2000);
                    },300);
                //}
                //reader.readAsDataURL(data.files[0]);
            }
        }

    });
	$('#logoUploader .file-upload-btn').click(function(event) {
	    $(this).parent().find('.file-upload').trigger('click');
	});
}