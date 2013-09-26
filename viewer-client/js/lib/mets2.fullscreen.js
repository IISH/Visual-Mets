(function($){
    /**
     * boolean value that indicates if the viewer is in full screen mode or not
     * @field fullScreen.active    boolean   store setting if full screen is activate it will set on "true" default "false"
     */
    App.mets2.Model.extend({
        fullScreen : {
            active : false
        }
    });

    /**
     * activate full screen by setting boolean "true"
     * @return void
     */
    App.mets2.Model.extend('enableFullScreen', function(){
        this.fullScreen.active = true;
    });

    /**
     * deactivate full screen by setting boolean "false"
     * @return void
     */
    App.mets2.Model.extend('disableFullScreen', function(){
        this.fullScreen.active = false;
    });


    /**
     * check if full screen mode is activated
     * @return boolean
     */
    App.mets2.Model.extend('isFullScreenEnable', function(){
        return this.fullScreen.active;
    });

    /**
     * the routing functionality for the "fullscreen"
     * bind click event to button create method "Fullscreen"
     *
     * function Fullscreen returns methods
     *
     * @return {{
          buttonFocus       : function,
          buttonBlur        : function,
          activate          : function,
          deactivate        : function,
          fullScreenIcon    : function
      }}
     */
    App.mets2.Controller.route('fullscreen',{
        events : {
            'click' : function(){
                if(this.model.isFullScreenEnable())
                {
                    this.model.disableFullScreen();
                    this.buttonBlur();
                    this.deactivate();
                    this.btn.attr('data-original-title', this.getLabel('label.fullscreen'));
                }else
                {
                    this.model.enableFullScreen();
                    this.buttonFocus();
                    this.activate();
                    this.btn.attr('data-original-title', this.getLabel('label.narrowscreen'));
                }
                this.fullScreenIcon();
            }
        },
        methods : {
            /**
             * set the button focus css class
             * @return void
             */
            buttonFocus : function(){
                this.btn.addClass('mets-button-focus');
            },
            /**
             * remove the button focus css class
             * @return void
             */
            buttonBlur : function(){
                this.btn.removeClass('mets-button-focus');
            },
            /**
             * activate the full screen mode
             * @see Controller.activateFullScreen
             * @return void
             */
            activate : function(){
                this.activateFullScreen();
            },
            /**
             * deactivate the full screen mode
             * @see Controller.deactivateFullScreen
             * @return void
             */
            deactivate : function(){
                this.deactivateFullScreen();
            },
            /**
             * toggle icon by setting the "narrowscreen" class style on the element <i>
             * @see Controller.deactivateFullScreen
             * @return void
             */
            fullScreenIcon : function(){
                this.btn.find('i').toggleClass('narrowscreen');
            }
        }
    });


    /**
     * restore <body> unbind window event resize, and resize the frame
     * @see View.Frame
     * @event   onResize        triggest on resize before rendering the frame
     * @event   onRescaled      triggest on resize ready, after the frame is rendered
     * @return void
     */
    App.mets2.Controller.extend('deactivateFullScreen', function(){
        var model           = this.getModel();
        var frame           = this.view.Frame();

        // enable scroll bars...
        $('body').css('overflow', 'auto');

        // unbind to window resize
        $(window).unbind('resize.textview');

        this.event.fire('onResize');
        frame.setRelative();
        frame.release();
        var optionSize = model.getFrameOptionSize();

        frame.setSize({
            width   : (optionSize.width == 'auto')?frame.getParentSelector().width(): optionSize.width,
            height  : (optionSize.height == 'auto')?frame.getParentSelector().height(): optionSize.height
        });
        frame.render();
        this.event.fire('onRescaled');
    });


    /**
     * disable overflow on <body> and set window resize event call Frame to
     * render
     * @see View.Frame
     * @event   onResize        triggest on resize before rendering the frame
     * @event   onRescaled      triggest on resize ready, after the frame is rendered
     */
    App.mets2.Controller.extend('activateFullScreen', function(){

        var self            = this;
        var model           = self.getModel();
        var frame           = self.view.Frame();


        // disable scroll bars...
        $('body').css('overflow', 'hidden');


        // set to window resize
        $(window).bind('resize.textview',function(){
            $UT.delay(function(){
                var optionSize = model.getFrameOptionSize();


                self.event.fire('onResize');
                frame.release();
                frame.setAbsolute();
                frame.setSize({
                    width   : $(window).width(),
                    height  : $(window).height()
                });

                frame.render();
                self.event.fire('onRescaled');
            },500);

        });

        self.event.fire('onResize');
        frame.release();
        frame.setAbsolute();
        frame.setSize({
            width   : $(window).width(),
            height  : $(window).height()
        });
        frame.render();

        self.event.fire('onRescaled');

    });


})(jQuery);