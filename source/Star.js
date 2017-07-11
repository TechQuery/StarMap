define(['jquery', './Color'],  function ($, Color) {

/* ----- 恒星点 ----- */

    function Star(Max_X, Max_Y, iContext) {

        this.x = Math.random() * Max_X;
        this.y = Math.random() * Max_Y;

        this.vx = Math.random() - 0.5;
        this.vy = Math.random() - 0.5;

        this.radius = Math.random();

        this.color = new Color();

        this.context = iContext;
    }

    Star.mixValue = function (comp1, weight1, comp2, weight2) {

        return  (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
    };

    $.extend(Star.prototype, {
        draw:        function () {

            this.context.beginPath();

            this.context.fillStyle = this.color.style;

            this.context.arc(
                this.x,  this.y,  this.radius,  0,  Math.PI * 2,  false
            );
            this.context.fill();
        },
        mixColor:    function (iOther) {

            return Color.getStyle(
                Star.mixValue(
                    this.color.red, this.radius, iOther.color.red, iOther.radius
                ),
                Star.mixValue(
                    this.color.green, this.radius, iOther.color.red, iOther.radius
                ),
                Star.mixValue(
                    this.color.blue, this.radius, iOther.color.red, iOther.radius
                )
            );
        }
    });

    return Star;

});