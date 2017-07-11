define(['jquery', 'jQueryKit'],  function ($) {

/* ----- RGB 颜色 ----- */

    function Color(min) {

        min = min || 0;

        var _Self_ = this.constructor;

        this.red = _Self_.random( min );
        this.green = _Self_.random( min );
        this.blue = _Self_.random( min );

        this.style = _Self_.getStyle(this.red, this.green, this.blue);
    }

    $.extend(Color, {
        random:      function (min) {

            return  Math.random() * 255 + min;
        },
        getStyle:    function (red, green, blue) {

            return  'rgba(' + [
                Math.floor(red), Math.floor(green), Math.floor(blue), 0.8
            ].join(', ') + ')';
        }
    });

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

/* ----- 星空图 ----- */

    function CanvasView($_View) {

        this.$_View = $( $_View );

        this.init();

        $( self ).on('resize',  $.throttle(this.init.bind( this )));

        return this;
    }

    CanvasView.prototype.init = function () {

        var $_View = this.$_View.offsetParent();

        this.width = this.$_View[0].width = $_View.width();
        this.height = this.$_View[0].height = $_View.height();
    };

    function StarMap($_View, iMax, iDistance, iRadius) {

        $.extend(CanvasView.call(this, $_View),  {
            length:      0,
            max:         iMax || 250,
            distance:    iDistance || 100,
            radius:      iRadius || 150
        });

        this.context = this.$_View[0].getContext('2d');

        this.context.lineWidth = 0.3;
        this.context.strokeStyle = (new Color(150)).style;

        var MP = this.pointer = {
                x:    30 * this.width / 100,
                y:    30 * this.height / 100
            };

        this.$_View.on('mousemove',  function (iEvent) {

            MP.x = iEvent.pageX;
            MP.y = iEvent.pageY;

        }).on('mouseleave',  function () {

            MP.x = -100;
            MP.y = -100
        });
    }

    return  $.inherit(CanvasView, StarMap, null, {
        move:       function () {
            var _This_ = this;

            return  $.each(this,  function () {

                if ((this.y < 0)  ||  (this.y > _This_.height))
                    this.vy = - this.vy;
                else if ((this.x < 0)  ||  (this.x > _This_.width))
                    this.vx = - this.vx;

                this.x += this.vx;
                this.y += this.vy;
            });
        },
        connect:    function () {
            var _This_ = this;

            return  $.each(this,  function () {

                for (var i = 0;  _This_[i];  i++)
                    if ((
                        ((this.x - _This_[i].x)  <  _This_.distance)  &&
                        ((this.y - _This_[i].y)  <  _This_.distance) &&
                        ((this.x - _This_[i].x)  > -_This_.distance)  &&
                        ((this.y - _This_[i].y)  > -_This_.distance)
                    )  &&  (
                        ((this.x - _This_.pointer.x)  <  _This_.radius)  &&
                        ((this.y - _This_.pointer.y)  <  _This_.radius)  &&
                        ((this.x - _This_.pointer.x)  > -_This_.radius)  &&
                        ((this.y - _This_.pointer.y)  > -_This_.radius)
                    )) {
                        _This_.context.beginPath();

                        _This_.context.strokeStyle = this.mixColor( _This_[i] );

                        _This_.context.moveTo(this.x, this.y);

                        _This_.context.lineTo(_This_[i].x, _This_[i].y);

                        _This_.context.stroke();

                        _This_.context.closePath();
                    }
            });
        },
        animate:    function () {
            this.context.clearRect(0, 0, this.width, this.height);

            $.each(this.move().connect(), Star.prototype.draw);

            self.requestAnimationFrame( arguments.callee.bind(this) );
        },
        render:         function () {

            for (var i = 0;  i < this.max;  i++)
                this[ this.length++ ] = new Star(
                    this.width,  this.height,  this.context
                );

            self.requestAnimationFrame( this.animate.bind(this) );
        }
    });
});