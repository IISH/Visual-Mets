(function($){
    /**
     * add field set to the model current contrast level, maximum to rise, minimum to sink
     * @field contrast.level     int         the level of brightness bv. 0, 5
     * @field contrast.max       int         the max level contrast
     * @field contrast.min       int         the min level contrast
     * @field contrast.steps     int         the amount of step on each actions (increase, decrease)
     */
    App.mets2.Model.extend({
        contrast : {
            level : 1,
            max   : 5,
            min   : 0,
            steps : 0.1
        }
    });

    /**
     * get the contrast level
     * @return int level
     */
    App.mets2.Model.extend('getContrastLevel', function(){
        return this.contrast.level;
    });

    /**
     * set the contrast level
     * @param int level
     * @return void
     */
    App.mets2.Model.extend('setContrastLevel', function(level){
        this.contrast.level = level;
    });

    /**
     * get the current contrast step
     * @return int step
     */
    App.mets2.Model.extend('getContrastSteps', function(){
        return this.contrast.steps;
    });

    /**
     * get the maximum contrast level range to go
     * @return int step
     */
    App.mets2.Model.extend('getContrastMaximum', function(){
        return this.contrast.max;
    });

    /**
     * get the minimum contrast level range to sink
     * @return int step
     */
    App.mets2.Model.extend('getContrastMinimum', function(){
        return this.contrast.min;
    });


    /**
     * the routing functionality for the "contrastInvert"
     * bind click event to button create method "ContrastInvert"
     *
     * function ContrastInvert returns methods
     *
     * @return {{
          down : function
      }}
     */
    App.mets2.Controller.route('contrastInvert',{
        events : {
            'click' : function(){
                this.down();
            }
        },
        methods : {
            /**
             * create less contrast
             * @see Controller.contrastTo
             * @return void
             */
            down : function(){

                var model  = this.getModel();
                var level  = model.getContrastLevel();


                if(level <= model.getContrastMinimum()){
                    level = model.getContrastMinimum();
                }else{
                    level = parseFloat(level-model.getContrastSteps());
                }
                this.contrastTo(level);
            }
        }
    });


    /**
     * the routing functionality for the "contrast"
     * bind click event to button create method "Contrast"
     *
     * function Contrast returns methods
     *
     * @return {{
          up : function
      }}
     */
    App.mets2.Controller.route('contrast',{
        events : {
            'click' : function(){
                this.up();
            }
        },
        methods : {
            /**
             * create more contrast
             * @see Controller.contrastTo
             * @return void
             */
            up : function(){
                var model  = this.getModel();
                var level  = model.getContrastLevel();

                if(level >= model.getContrastMaximum()){
                    level = model.getContrastMaximum();
                }else{
                    level = parseFloat(level)+parseFloat(model.getContrastSteps())  ;
                }
                this.contrastTo(level);
            }
        }
    });


    /**
     * render the contrast update the model, and render the page (img)
     * @return void
     */
    App.mets2.Controller.extend('contrastTo', function(level){

        var model          = this.getModel();
        var page           = model.getCurrentLayoutPage();
        var img            = page.getImage();
        var loader         = this.view.PageLoader();

        // activate dragging
        img.draggable({
            disabled : false
        });
        level = level.toPrecision(2);
        // update model
        model.setContrastLevel(level);

        loader.open();
        loader.text('contrast to <b>'+(level*100)+'%</b>');

        $UT.delay(function(){
            model.addParamToImage({
                contrast : level
            });
            page.add();
            page.load(function(){
                loader.close();
            });
        }, 450);
    });


})(jQuery);