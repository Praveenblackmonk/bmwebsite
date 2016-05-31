$(document).ready(function(){

	function positionbox() {
        var $ip_bx = $("#info-box").outerHeight() + 20 + "px";
        var $windowWidth = $(window).width();
        if( $windowWidth < 992){
          $('#info-box').addClass('ip-bx');
          $('#admin-cotrol').css('margin-top', $ip_bx);
        }else{
          $('#info-box').removeClass('ip-bx');
          $('#admin-cotrol').css('margin-top', '0');
        }
      }

      positionbox();

      $(window).on("resize", function(){
        positionbox();
      });

      $('#info-box a').on('click', function(event) {
        var target = $($(this).attr('href'));
        if( target.length ) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top + -15
            }, 800, 'swing');

        }
      });

      function posfix(){
        var $windowWidth = $(window).width();
        var $footer_actions = $('.footer-actions').outerHeight();
        var $infoBoxHeight = $("#info-box-mrg").outerHeight();

        if( $windowWidth > 991){
          if ($(this).scrollTop() > 330 ) {
            var $osWidth = $('.info-box').width();
            $('.info-box').addClass('fix-div');
            $('.info-box').width($osWidth);
             if ($(document).scrollTop() >= $infoBoxHeight) {
                $('.info-box').removeClass('fix-div');
              }
          } else {
            $('.info-box').removeClass('fix-div');
          }
        }
      }

      var $infoMenu = $("#info-menu"),
      menuItems = $infoMenu.find("a"),
      scrollItems = menuItems.map(function(){
        var $item = $($(this).attr("href"));
        if ($item.length) { 
          return $item; 
        }
      });


      posfix();

      $(window).on("scroll", function(){
        posfix();
        if ($(this).scrollTop() > 330 ) {
          var fromTop = $(this).scrollTop() + 20;
          var cur = scrollItems.map(function(){
            if ($(this).offset().top < fromTop){
              return this;
            }
          });
          cur = cur[cur.length-1];
          var id = cur && cur.length ? cur[0].id : "";
          menuItems.parent().removeClass("active").end().filter("[href=#"+id+"]").parent().addClass("active");
          
        }
      });

      });