(function($){
    /**
     * canvas is the place where the loader, page, messages, etc are
     * @field canvas.selector       array         the jquery selector
     * @field canvas.height         int           the stored height of the canvas
     * @field canvas.width          int           the stored width of the canvas
     */
    App.mets2.Model.extend({
        canvas : {
            selector : [],
            height   : 0,
            width    : 0
        }
    });

    /**
     * get the canvas size
     * @return {{width: int, height: int}}
     */
    App.mets2.Model.extend('getCanvasSize', function(){
        var canvas = this.canvas;
        return {
            width  : canvas.width,
            height : canvas.height
        }
    });

    /**
     * get the parameters for the getting a page whit the proper height and with
     * @return String
     */
    App.mets2.Model.extend('getCanvasScaleQueryParam', function(){
        return '&scale=true&scale.width='+this.getCanvasSize().width+'&scale.height='+this.getCanvasSize().height;
    });



    /**
     * set the height in the model
     * @param {{width: int, height: int}}
     * @return void
     */
    App.mets2.Model.extend('setCanvasSize', function(param){
      if(param.width){
          this.canvas.width = param.width;
      }
        if(param.height){
            this.canvas.height = param.height;
        }
    });

    /**
     * set the canvas reverence jquery selector
     * @see Controller.init
     * @return void
     */
    App.mets2.Model.extend('setCanvasSelector', function(selector){
        this.canvas.selector = selector;
    });

    /**
     * get the canvas jquery selector
     * @return Array|jQuery
     */
    App.mets2.Model.extend('getCanvasSelector', function(){
        return this.canvas.selector;
    });

    /**
     * Canvas is the functionality for the canvas view where the page , messages, loader etc is showed
     * returns methods
     * @return {{
          getCanvas                 : function,
          getSize                   : function,
          setSize                   : function,
          getImageCanvasQueryParam  : function,
          getScaleQueryParam        : function
    }}
     */
    App.mets2.View.extend('Canvas', function(){

        var model  = this.getModel();
        var canvas = model.getCanvasSelector();

        return {
            /**
             * get teh canvas jquery selector
             * @returns {*}
             */
            getCanvas : function(){
               return canvas;
            },
            /**
             * get the current size of the dom element , selector canvas
             * @returns {{height: *, width: *}}
             */
            getSize : function(){
                return {
                    width : canvas.width(),
                    height : canvas.height()
                }
            },

            /**
             * almost the same as getSize  method but this one gives back the width and height
             * including the with aspect of zooming level and steps for giving back zooming
             * sizes
             * @returns {{height: *, width: *}}
             */
            getScaledSize : function(){
                var size  = this.getSize();
                var step  = (model.getScaleSteps()*model.getZoomLevel())/100;
                return {
                    width   : Math.round(size.width+(size.width*step)),
                    height  : Math.round(size.height+(size.height*step))
                };
            },

            /**
             * update the model and set the size to the jquery selector canvas
             * @param opt {{width: int, height: int}}
             */
            setSize : function(opt){
                model.setCanvasSize(opt);
                if(opt.width){
                    canvas.width(opt.width);
                }
                if(opt.height){
                    canvas.height(opt.height);
                }
            },
            getImageCanvasQueryParam : function(){
                return '&scale=0&width='+this.getSize().width+'&height='+this.getSize().height;
            },
            getScaleQueryParam : function(){
                return model.getCanvasScaleQueryParam();
            }
        };
    });




})(jQuery);