
function display_settings(id){
	$('.dev_settingsdrpdwn').hide();
	$('span.item-manage').removeClass('active')
	$('#settings_id_'+id).toggle();
	$('#id_span_settings_'+id).toggleClass('active')
	$('.dev_hide_list_status ul.dropdown-list').hide();
	$('span.status-inside').removeClass('active')
}
function display_change_status(id,state){
	$('.dev_hide_list_status ul.dropdown-list').hide();
	$('span.status-inside').removeClass('active')
	$('#change_status_id_'+id).toggle();
	$('#id_span_chge_sts_'+id).toggleClass('active')
	$('.dev_settingsdrpdwn').hide();
	$('span.item-manage').removeClass('active')
	status_function(id,state);
}

function save_tenant_status(id,status){
	 swal({title: "Are you sure?",text: "It will change the status of selected Tenant!",
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes, update it!",
		  closeOnConfirm: false
		},
		function(){
		    $('#id_change_status_span_icon_'+id).addClass('loading');
		    var dataString="id="+id;
			dataString+='&status='+status;
		    var url = $('#id_change_status_url').val();
		    swal({ title: "Tenant configurations", text: "updating...", imageUrl: "/static/ui/images/global/wifi-loader.gif", showConfirmButton: false });
		    $.ajax({
		        type: "GET",
		        url: url,
		        data: dataString,
		        dataType:'JSON',
		        success: function(data){
		            if(data.success){
		                $('#id_change_status_span_icon_'+id).removeClass('loading');
		                $('#id_change_status_span_icon_'+id).removeClass('icon-active-user icon-inactive-user icon-pending-user')
						$('#id_change_status_span_icon_'+id).addClass(data.status_class);
		                $('#id_change_status_ul_'+id).hide();
						$('#id_change_status_ul_'+id).empty().html(data.html);
		                $('#id_change_status_span_'+id).removeClass('active');
		                $('#id_change_status_text_'+id).text(gettext(data.status_text));
		                if (data.tenant_created && data.msg != "" ){
							swal("Schema Created", data.msg, "success");	
						}
						else{
							swal("Done", 'Tenant status has been updated successfully', "success");
						}			
						
		            }else{
		                show_msg(gettext('Oops!!! Not able to process your request.'),'alert-error');
		            }
		        }
		    });    
	 });			
														
	}
