jQuery($ => {
  $(window).on('load', () => {
    setTimeout(() => {
      $('#loader_main').fadeOut('slow', function () {
        $(this).remove();
      });
    }, 3000);
  });
});
