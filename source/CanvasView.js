define(['jquery', 'jQueryKit'],  function ($) {

/* ----- 星空图 ----- */

    function CanvasView($_View) {

        this.$_View = $( $_View );

        this.init();

        $( self ).on('resize',  $.throttle(this.init.bind( this )));

        return this;
    }

    $.Class.extend(CanvasView, null, {
        init:    function () {

            var $_View = this.$_View.offsetParent();

            this.width = this.$_View[0].width = $_View.width();
            this.height = this.$_View[0].height = $_View.height();
        }
    });

    return CanvasView;

});
