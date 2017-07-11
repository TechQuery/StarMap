define(['jquery'],  function ($) {

/* ----- RGB 颜色 ----- */

    function Color(min) {

        min = min || 0;

        var _Self_ = this.constructor;

        this.red = _Self_.random( min );
        this.green = _Self_.random( min );
        this.blue = _Self_.random( min );

        this.style = _Self_.getStyle(this.red, this.green, this.blue);
    }

    return  $.extend(Color, {
        random:      function (min) {

            return  Math.random() * 255 + min;
        },
        getStyle:    function (red, green, blue) {

            return  'rgba(' + [
                Math.floor(red), Math.floor(green), Math.floor(blue), 0.8
            ].join(', ') + ')';
        }
    });
});