function are_cookies_enabled(){var cookieEnabled=navigator.cookieEnabled?true:false;if(typeof navigator.cookieEnabled=="undefined"&&!cookieEnabled){document.cookie="testcookie";cookieEnabled=document.cookie.indexOf("testcookie")!=-1?true:false}return cookieEnabled}
$(document).ready(function(){if(are_cookies_enabled()){var referrer=document.referrer;var trackString="referrer="+referrer+"&page="+window.location.pathname;trackString+="&browser="+$.client.browser;if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))trackString+="&os=Mobile";else trackString+="&os=Computer";$.ajax({url:track_url,data:trackString,success:function(data){return true},error:function(data){return true}})}});
$(window).on("beforeunload",function(){if(are_cookies_enabled())$.ajax({url:track_url,data:"unload=1"+"&page="+window.location.pathname,async:false,success:function(data){return true},error:function(data){return true}})});
//$(window).on("unload",function(){if(are_cookies_enabled())$.ajax({url:track_url,data:"unload=1"+"&page="+window.location.pathname,async:false,success:function(data){return true},error:function(data){return true}})});
window.onpagehide = function() {if(are_cookies_enabled())$.ajax({url:track_url,data:"unload=1"+"&page="+window.location.pathname,async:false,success:function(data){return true},error:function(data){return true}})};