$(document).ready(function(){
	dataString='url='+$(location).attr('href');

	try{
		$.ajax({
			type: "GET",
			url: "/banners/ajax-get-banner/",
			data: dataString,
			dataType:'JSON',
			success: function(data){
			  try{if(typeof data.right_banner_html != 'undefined'){postscribe('#banner_placement_right', data.right_banner_html);$('#banner_placement_right').show();}}
			  catch(e){}
			}
		});
    }
    catch(e){}
/*
    try{
		$.ajax({
			type: "GET",
			url: "/banners/ajax-get-top-banner/",
			data: dataString,
			dataType:'JSON',
			success: function(data){
			  try{if(typeof data.top_banner_html != 'undefined'){postscribe('#banner_placement_top', data.top_banner_html);}}
			  catch(e){}	
			}
		});
     }
     catch(e){}
	*/
});

function update_banner_views(){
	/* Banner Views Updates  */
	var senddata='';
	var bannerids=[];/* active banner id array*/
	$('.ds_banner_ids').each(function(){
		bannerids.push($(this).val());
	});
	senddata='bannerids='+bannerids;
	$.ajax({
			type: "GET",
			url: "/banners/ajax-update-views/",
			data: senddata,
			success: function(response){
				if(response==1){return true;}
				else{return false;}
			}
	});

}

function update_banner_clicks(bid){
	senddata='bid='+bid;
	$.ajax({
			type: "GET",
			url: "/banners/ajax-update-clicks/",
			data: senddata,
			success: function(response){
				if(response==1){return true;}
				else{return false;}
			}
	});
}