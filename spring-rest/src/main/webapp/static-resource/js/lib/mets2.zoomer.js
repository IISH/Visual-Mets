(function($){

    /**
     * add field set to the model the steps to reduce of increase zooming level
     * @option scaleVector.steps int            amount of steps
     * @option scaleVector.max int              the max level of zoom in scaling (width page)
     * @option scaleVector.min int              the min level of zoom out scaling (width page)
     * @option scaleVector.level int            the steps of zooming based on each zoom level
     * ..........................................................................................
     * @option scaleVector.dragging.cursor int              the cursor style default "default"
     * @option scaleVector.dragging.disabled boolean        enable or disable "boolean"
     * @link http://jqueryui.com/draggable/
     */
    App.mets2.Model.extend({
        scaleVector : {
            steps : 10,
            max   : 10000,
            min   : 300,
            level : 0,
            dragging : {
                cursor   : 'default',
                disabled : true
            }
        }
    });

    /**
     * get the dragging option for the jquery ui component "$.draggable"
     * @return {{cursor: String, disabled: boolean}}
     */
    App.mets2.Model.extend('getDraggingOptions', function(){
        return this.scaleVector.dragging;
    });

    /**
     * set the dragging option for the jquery ui component "$.draggable"
     * @param {{cursor: String, disabled: boolean}}
     */
    App.mets2.Model.extend('setDraggingOptions', function(options){
        this.scaleVector.dragging = options;
    });


    /**
     * get the current stored zoom level
     * @return int
     */
    App.mets2.Model.extend('getZoomLevel', function(){
        return this.scaleVector.level;
    });

    /**
     * set the zoom level
     * @return void
     */
    App.mets2.Model.extend('setZoomLevel', function(level){
        this.scaleVector.level = level;
    });


    /**
     * get the steps
     * @return int
     */
    App.mets2.Model.extend('getScaleSteps', function(){
        return this.scaleVector.steps;
    });

    /**
     * get the max level of zooming
     * @return int
     */
    App.mets2.Model.extend('getScaleMaximum', function(){
        return this.scaleVector.max;
    });

    /**
     * get the minimum level of zooming
     * @return int
     */
    App.mets2.Model.extend('getScaleMinimum', function(){
        return this.scaleVector.min;
    });


    /**
     * the routing functionality for the "zoomin"
     * bind click event to button create method "Zoomin"
     *
     * function Zoomin returns methods
     *
     * @return {{
          zoomIn : function,
          removeDisableClass : function,
          addDisableClass    : function,
          renderSize         : function
      }}
     */
    App.mets2.Controller.route('zoomin',{
        events : {
            'click' : function(){
                this.zoomIn();
            }
        },
        methods : {
            zoomIn : function(){

                var model  = this.getModel();
                var canvas = this.getView().Canvas();
                var size   = canvas.getSize();
                var newSize = this.renderSize(size);

                if(newSize.width < model.getScaleMaximum()){
                    // set level
                    var level = model.getZoomLevel();
                    model.setZoomLevel(++level);
                    // call zoomTo method
                    this.zoomTo(this.renderSize(size));
                    this.removeDisableClass();
                    this.Zoomout().removeDisableClass();
                }else{
                    this.addDisableClass();

                }

            },
            removeDisableClass : function(){
                this.btn.removeClass('mets-button-disable');
            },
            addDisableClass : function(){
                this.btn.addClass('mets-button-disable');
            },
            renderSize : function(size){

                var step = (this.model.getScaleSteps()*this.model.getZoomLevel())/100;
                return {
                    width   : Math.round(size.width+(size.width*step)),
                    height  : Math.round(size.height+(size.height*step))
                };
                //
            }
        }
    });

    /**
     * the routing functionality for the "zoomout"
     * bind click event to button create method "Zoomout"
     *
     * function Zoomout returns methods
     *
     * @return {{
          zoomOut : function,
          removeDisableClass : function,
          addDisableClass    : function,
          renderSize         : function
      }}
     */
    App.mets2.Controller.route('zoomout',{
        events : {
            'click' : function(){
                this.zoomOut();
            }
        },
        methods : {
            zoomOut : function(){

                var model  = this.getModel();
                var canvas = this.getView().Canvas();

                var size   = canvas.getSize();
                var newSize = this.renderSize(size);

                if(newSize.width > model.getScaleMinimum()){
                    // set level
                    var level = model.getZoomLevel();
                    model.setZoomLevel(--level);
                    // call zoomTo method
                    this.zoomTo(this.renderSize(size));
                    this.removeDisableClass();
                    this.Zoomin().removeDisableClass();
                }else{
                    this.addDisableClass();

                }
            },
            removeDisableClass : function(){
                this.btn.removeClass('mets-button-disable');
            },
            addDisableClass : function(){
                this.btn.addClass('mets-button-disable');
            },
            renderSize : function(size){

                var step  = (this.model.getScaleSteps()*this.model.getZoomLevel())/100;
                return {
                    width   : Math.round(size.width+(size.width*step)),
                    height  : Math.round(size.height+(size.height*step))
                };
            }
        }
    });


    /**
     * zoom to a a specific zoom level
     * @param scale int     the zoom level
     * @return void
     */
    App.mets2.Controller.extend('zoomTo', function(size){

        var model = this.getModel();
        var page          = model.getCurrentLayoutPage();
        var img           = page.getImage();
        var loader = this.view.PageLoader();

        // correct styling for dragging

        img.css({'cursor' : 'move'});
        model.setDraggingOptions({
            cursor   : 'move',
            disabled : false
        });
        // add drag function
        img.draggable(model.getDraggingOptions());

        loader.open();
        loader.text('zoomming ('+model.getZoomLevel()+')');

        $UT.delay(function(){

            model.addParamToImage({
                'scale' : 0,
                'width' : size.width,
                'height': size.height
            });
            page.reload();
            loader.close();
        }, 450);

    });



    /**
     * add zooming to the view
     * and reset view by page request, execute on events "onSuccess"
     * @see Controller.init
     * @return void
     */
    App.mets2.Controller.extend('addZooming',function(){

        var self =  this;
        var model =  self.getModel();
        var page  = model.getCurrentLayoutPage();

           if(page){
               var img = page.getImage();

               img.draggable(model.getDraggingOptions());
               // reset inline  style
               img.css({
                   'cursor': model.getDraggingOptions().cursor
               });
               // check for plugin...
               if($.fn['mousewheel']){
                   img.on('mousewheel', function(event, delta) {

                       if(delta > 0){
                           self.Zoomin().zoomIn();
                       }else{
                           self.Zoomout().zoomOut();
                       }
                   });
               }else{
                   if(this.isDebugActive()){
                       console.warn("NOTICE scrolling plugin [mousewheel] is missing");
                   }
               }
           }


    });



})(jQuery);