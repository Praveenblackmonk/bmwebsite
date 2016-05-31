function file_upload(url,limit) {
    'use strict';
    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
 	   dropZone:$("#bm-dropzone"),
 	   sequentialUploads:true,
	   maxNumberOfFiles:limit,
	   autoUpload:true,
	   url:url,
	   acceptFileTypes:/(\.|\/)(gif|jpe?g|png)$/i,
 	   drop:function (e, data) {
 	   	  	$("#bm-dropzone_area").hide();
 	   }
 	  
    });
	$(document).bind('dragover', function (e) {
		$("#bm-dropzone_area").show();
    	e.preventDefault();
	});
	$(document).bind('drop', function (e) {
		$("#bm-dropzone_area").hide();
		e.preventDefault();
    	
	});
 // Load existing files:
    get_images(url)
    // Open download dialogs via iframes,
    // to prevent aborting current uploads:
    $('#fileupload .files a:not([target^=_blank])').live('click', function (e) {
        e.preventDefault();
        $('<iframe style="display:none;"></iframe>')
            .prop('src', this.href)
            .appendTo('body');
        setTimeout(function(){
        	inline_text()
        },1000);
    });
   //inline_text()
}
function get_images(url){
     var noCache = Date();
	 $.getJSON(url, { "noCache": noCache }, function (files) {
	        var fu = $('#fileupload').data('fileupload');
	        fu._adjustMaxNumberOfFiles(-files.length);
	        fu._renderDownload(files)
	            .appendTo($('#fileupload .files'))
	            .fadeIn(function () {
	                // Fix for IE7 and lower:
	                $(this).show();
	            });
	    });
}
function inline_text(){
	try{
		$.colorbox.resize();
		//if($('.bm-uploader-file').length>=1){$('.upload-button').html(gettext('Upload More Photos'));}
		//else{$('.upload-button').html(gettext('Add Images'));}
	}catch(ex){}
}


function config_logo_uploader(aspectRatio){
	alert('hello');
	console.log("the config logo uploader is called ");
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
		//	console.log(data);	
        	maxnum = $("#coverUploader .file-upload-cont li").length;
            if(maxnum <= imagelimit){
               console.log($("#coverUploader .file-upload-cont li").length)
 				var uploadErrors = [];
                var acceptFileTypes = /^image\/(gif|jpe?g|jpg|png)$/i;
                
				if(!acceptFileTypes.test(data.originalFiles[0]['type'])) 
				{
                    uploadErrors.push('Not an accepted file type');
                }
                if(data.originalFiles[0]['size'] > 5000000) 
				{
                    uploadErrors.push('Filesize is too big');
                }
					
           		if(uploadErrors.length > 0)
				{
                alert(uploadErrors.join("\n"));
            	} 
				else 
				{
                console.log("loading cropper ");	
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
            }
		else{
				show_alert_msg(gettext('You can upload only one cover photo!'),'e');
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
                    	$("#coverUploader .cropper_controls.cropper-preview")
                    		.css("width", preview_width)
        		    		.css("height", preview_width / aspectRatio)
        		    		.css("overflow", "hidden");
                    	$("#coverUploader .preview_holder")
                    		.css("width", preview_width)
                    		.css("height", preview_width / aspectRatio);
                    	$("#coverUploader .preview_holder .img-cont").css("height", preview_width - 10);
                    	if(enable_cropping){	
	                    	$("#coverUploader .cropper").cropper({
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
                    		$("#coverUploader .cropper").cropper({
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
        		    		$("#coverUploader .cropper_controls.cropper-preview img").css("max-width", 'none');
                    	}, 2000);
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


function cropandsave(updateUrl){
	$.ajax({
		type: "POST",
		url: updateUrl,
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
function cover_photo_upload(coverUploadUrl, aspectRatio) {
	console.log("Cover Photo Upload Called");
	console.log(coverUploadUrl);
	var preview_height = 200;
    // Initialize the jQuery File Upload widget:
    $('#fileuploadcover').fileupload({
 	   dropZone: $("#bm-dropzone"),
 	   sequentialUploads: true,
	   maxNumberOfFiles: 1,
	   autoUpload: true,
	   downloadTemplate: $('#cover-download-template'),
	   url: coverUploadUrl,
	   acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
	   complete: function () {
		    setTimeout(function(){
		    	$(".cropper_controls.cropper-preview").css("width", preview_height);
		    	$(".cropper_controls.cropper-preview").css("height", preview_height / aspectRatio);
				$(".cropper").cropper({
				    aspectRatio: aspectRatio,
				    preview: ".cropper-preview",
				    done: function(data) {
				    	$('#cover_x1').val(data.x1);
				    	$('#cover_y1').val(data.y1);
				    	$('#cover_x2').val(data.x2);
				    	$('#cover_y2').val(data.y2);
				    	$('#cover_height').val(data.height);
				    	$('#cover_width').val(data.width);
				    }
				});
	        },1000);
	   },
 	   drop: function (e, data) {
 	   	  	$("#bm-dropzone_area").hide();
 	   }
    });
	$(document).bind('dragover', function (e) {
		$("#bm-dropzone_area").show();
    	e.preventDefault();
	});
	$(document).bind('drop', function (e) {
		$("#bm-dropzone_area").hide();
		e.preventDefault();
	});
	// Load existing files:
    get_cover_images(coverUploadUrl)
    setTimeout(function(){
    	$('.cropper_controls').hide();
    	$(".cropper_ajax_ctrl img").css("width", preview_height);
    	$(".cropper_ajax_ctrl img").css("height", preview_height / aspectRatio);
	},300);
    $('#fileuploadcover .files a:not([target^=_blank])').live('click', function (e) {
        e.preventDefault();
        $('<iframe style="display:none;"></iframe>')
            .prop('src', this.href)
            .appendTo('body');
        setTimeout(function(){
        	inline_text()
        },1000);
    });
}
function get_cover_images(url){
     var noCache = Date();
	 $.getJSON(url, { "noCache": noCache }, function (files) {
	        var fu = $('#fileuploadcover').data('fileupload');
	        fu._adjustMaxNumberOfFiles(-files.length);
	        fu._renderDownload(files)
	            .appendTo($('#fileuploadcover .files'))
	            .fadeIn(function () {
	                // Fix for IE7 and lower:
	                $(this).show();
	        });
	 });
}