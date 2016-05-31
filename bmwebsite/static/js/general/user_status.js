$(document).ready(function() {
		$.getJSON("/account/userstatus/",
        function(data){
			$('#guest_nav').empty().html(data.status_html).fadeIn();
        });
        var search_q = $("#websearchfield");
        var search_m = $("#sitesearchradio_id");
        search_q.bind('focus',function(e){
        if (search_q.val() == default_text[search_m.val()]) {
            search_q.val("");
            search_q.css({color:"#000"});
        }
        });
        search_q.bind('blur',function(e){
            if (search_q.val() == "") {
                search_q.val(default_text[search_m.val()]);
                search_q.css({color:"#AAA"});
            }
        });
        
       // prepareSearchFields();
  });

function user_status_checklogin(){
	
	$.getJSON("/account/userstatus/",
        function(data){
        	if(data.is_authenticated){
        		var htmlcontent='<li class="tiny">'+gettext("Hello")+'&nbsp;&nbsp;'+data.username +'</li><li><a href="/account/profile/">'+gettext("My Account")+'</a></li><li><a href="/account/signout/">'+gettext("Sign out")+'</a></li>'
            	$("#guest_nav ul").html(htmlcontent);
          	}
          	else{
        		$("#guest_nav ul").html('<li><a href="/account/signin/">'+gettext("Sign in")+'</a></li><li><a href="/account/signup/">'+gettext("Register")+'</a></li>');
        		//$("#id_footer_sign").show();
          	}
        });
        var search_q = $("#websearchfield");
        var search_m = $("#sitesearchradio_id");
        search_q.bind('focus',function(e){
        if (search_q.val() == default_text[search_m.val()]) {
            search_q.val("");
            search_q.css({color:"#000"});
        }
        });
        search_q.bind('blur',function(e){
            if (search_q.val() == "") {
                search_q.val(default_text[search_m.val()]);
                search_q.css({color:"#AAA"});
            }
        });
  }

















