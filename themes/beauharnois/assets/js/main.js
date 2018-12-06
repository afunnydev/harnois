jQuery( document ).ready(function($) {
  // Select all links with hashes
  $('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
      // On-page links
      if (
        location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
        && 
        location.hostname == this.hostname
      ) {
        // Figure out element to scroll to
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        // Does a scroll target exist?
        if (target.length) {
          // Only prevent default if animation is actually gonna happen
          event.preventDefault();
          $('html, body').animate({
            scrollTop: target.offset().top - 50
          }, 1000, function() {
            // Callback after animation
            // Must change focus!
            var $target = $(target);
            $target.focus();
            if ($target.is(":focus")) { // Checking if the target was focused
              return false;
            } else {
              $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
              $target.focus(); // Set focus again
            };
          });
        }
      }
    });
  $('.triggering-modal .close-btn').click(function(e){
    e.stopPropagation();
    $('.triggering-modal-wrapper').toggleClass('hidden');
  });
  $( window ).load(function() {
    if ($('body').hasClass('attach-scroll-handler')) {
      // Cache selectors
      var topMenu = $("#main-nav"),
          topMenuHeight = topMenu.outerHeight()+15,
          // All list items
          menuItems = topMenu.find(".inner-menu-link a"),
          // Anchors corresponding to menu items
          scrollItems = menuItems.map(function(){
            var item = $($(this).attr("href"));
            if (item.length) { return item; }
          });
      // Bind to scroll
      $(window).scroll(function(){
         // Get container scroll position
         var fromTop = $(this).scrollTop()+topMenuHeight;

         // Get id of current scroll item
         var cur = scrollItems.map(function(){
           if ($(this).offset().top < fromTop)
             return this;
         });
         // Get the id of the current element
         cur = cur[cur.length-1];
         var id = cur && cur.length ? cur[0].id : "";
         // Set/remove active class
         menuItems
           .parent().removeClass("current-menu-item")
           .end().filter("[href='#"+id+"']").parent().addClass("current-menu-item");
      });​
    }
  });
});
