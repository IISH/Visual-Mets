(function($){

    /**
     * the loader view
     * @param text String   optional set a massage to the loader
     * @return Object
     * @return {{
          text                      : function,
          open                      : function,
          close                     : function,
          update                    : function,
          setPosition               : function
       }}
     */
    App.mets2.View.extend('PageLoader', function(text){

        var model       = this.getModel();
        var loader      = model.getFrameSelector().find('.mets-loader-frame');
        var label       = loader.find('.mets-loader-text');
        var textLabel   = text || label.text();
        var canvasSize   = this.Canvas().getSize();
        var timer       = {};
        var c = 0;
        this.methods = {
            text : function(text){
                label.html(text);
                return this;
            },
            /**
             * load
             * @see Controller.init
             */
            setPosition : function(){
                loader.css({
                    'top': (canvasSize.height/2)-(loader.height()/2),
                    'left': (canvasSize.width/2)-(loader.width()/2)
                });
                return this;
            },
            open : function(fn){
                label.html(textLabel);
                this.setPosition();
                loader.fadeIn(300, fn);
                return this;
            },
            close : function(fn){
                loader.stop();
                loader.hide();
                if(fn){
                    fn();
                }
                if(timer['stop']){
                    timer.stop();
                }
                return this;
            }
        };
        return  this.methods;
    });

    /**
     * the image icon notice function
     * returns methods
     * @see Controller.loadTemplate
     * @see Model.template.host         the main url host domain
     *
     * @return {{
          error         : function,
          warning       : function,
          scriptError   : function,
          serverError   : function,
          show          : function,
          hide          : function,
          remove        : function,
          serUrl        : function
    }}
     */
    App.mets2.View.extend('MessageIcon', function(){
        var model       = this.getModel();
        var icon        = model.getCanvasSelector().find('.mets-notice-icon');
        if(icon.length == 0){
            icon = $('<img>').addClass('mets-notice-icon');
            icon.appendTo(model.getCanvasSelector());
        }
        return methods = {
            error : function(){
                icon.attr('src', model.getThemePath()+'file-error.png');
                return this;
            },
            warning : function(){
                icon.attr('src', model.getThemePath()+'file-warning.png');
                return this;
            },
            serUrl : function(url){
                icon.attr('src', model.getThemePath()+url);
                return this;
            },
            scriptError : function(){
                icon.attr('src', model.getThemePath()+'script-error.png');
                return this;
            },
            serverError : function(){
                icon.attr('src', model.getThemePath()+'server-error.png');
                return this;
            },
            show : function(){
                icon.fadeIn(500);
                return this;
            },
            hide : function(){
                icon.hide();
                return this;
            },
            remove : function(){
                icon.remove();
                return this;
            }
        }
    });
    /**
     * @return Object
     *
     * @method close    close the message
     * @method info     info message style
     * @method success  success message style
     * @method error    error message style
     * @method warning  warning message style
     * @return {{
          close     : function,
          info      : function,
          success   : function,
          error     : function,
          warning   : function,
          hide      : function,
          getIcon   : function,
          showIcon  : function,
          hideIcon  : function
    }}
     */
    App.mets2.View.extend('Messenger', function(_event){

        var messenger = this.getModel().getFrameSelector().find('.mets-message');
        var iconView  = this.MessageIcon();
        var events    = _event;
        this.method = {
            events : null,
            open : function(fn){
                // make clean ..
                messenger.fadeIn(700, fn);
                if(events){
                    events.fire('onMessageOpen');
                }
                return this;
            },
            close : function(fn){
                this.hideIcon();
                messenger.fadeOut(700, function(){
                    // make clean...
                    messenger.attr('class', 'mets-message mets-hide');
                    iconView.hide();
                    messenger.empty();
                    if(fn){
                        fn();
                    }
                    if(events){
                        events.fire('onMessageClose');
                    }
                });
                return this;
            },
            info : function(text){
                this.open();
                messenger.html(text);
                return this;
            },
            success : function(text){
                this.open();
                messenger.html(text);
                return this;
            },
            error : function(text){
                this.open();
                messenger.html(text);
                messenger.addClass('mets-error');
                return this;
            },
            warning : function(text){
                this.open();
                messenger.html(text);
                messenger.addClass('mets-warning');
                return this;
            },
            /**
             * return icon functionality
             * @returns {*}
             */
            getIcon : function(){
              return  iconView;
            },
            hideIcon : function(){
                iconView.hide();
                return this;
            },
            showIcon : function(){
                iconView.show();
                return this;
            }
        };
        return this.method;
    });



})(jQuery);