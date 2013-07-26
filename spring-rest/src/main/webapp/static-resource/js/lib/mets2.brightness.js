(function($){
    /**
     * add field set to the model teh steps to reduce of increase zooming level
     * @field brightness.level     int         the level of brightness bv. -100, -90, ..., -20, -10, 0, 10, 20, 90, 100
     * @field brightness.max       int         the max level brightness
     * @field brightness.min       int         the max level darkness
     * @field brightness.steps     int         the amount of steps on its actions (increase, decrease)
     */
    App.mets2.Model.extend({
        brightness : {
            level : 0,
            max   : 100,
            min   : -200,
            steps : 10
        }
    });

    /**
     * get the brightness level
     * @return int level
     */
    App.mets2.Model.extend('getBrightnessLevel', function(){
        return this.brightness.level;
    });

    /**
     * set the brightness level
     * @param int level
     * @return void
     */
    App.mets2.Model.extend('setBrightnessLevel', function(level){
        this.brightness.level = level;
    });

    /**
     * get the current brightness step
     * @return int step
     */
    App.mets2.Model.extend('getBrightnessSteps', function(){
        return this.brightness.steps;
    });

    /**
     * get the maximum brightness level range to go
     * @return int step
     */
    App.mets2.Model.extend('getBrightnessMaximum', function(){
        return this.brightness.max;
    });

    /**
     * get the minimum brightness (darkness) level range to sink
     * @return int step
     */
    App.mets2.Model.extend('getBrightnessMinimum', function(){
        return this.brightness.min;
    });


    /**
     * the routing functionality for the "darker"
     * bind click event to button create method "Darker"
     *
     * function Darker returns methods
     *
     * @return {{
          darken  : function
      }}
     */
    App.mets2.Controller.route('darker',{
        events : {
            'click' : function(){
                this.darken();
            }
        },
        methods : {
            darken : function(){

                var model  = this.getModel();
                var level  = model.getBrightnessLevel();


                if(level <= model.getBrightnessMinimum()){
                    level = model.getBrightnessMinimum();
                }else{
                    level = level-model.getBrightnessSteps();
                }
                this.brightnessTo(level);
            }
        }
    });


    /**
     * the routing functionality for the "lighter"
     * bind click event to button create method "Lighter"
     *
     * function Lighter returns methods
     *
     * @return {{
          lighten  : function
      }}
     */
    App.mets2.Controller.route('lighter',{
        events : {
            'click' : function(){
                this.lighten();
            }
        },
        methods : {
            lighten : function(){
                var model  = this.getModel();
                var level  = model.getBrightnessLevel();

                if(level >= model.getBrightnessMaximum()){
                    level = model.getBrightnessMaximum();
                }else{
                    level = level+model.getBrightnessSteps();
                }
                this.brightnessTo(level);
            }
        }
    });


    /**
     * render the brightness update the model, and render the page (img)
     * @return void
     */
    App.mets2.Controller.extend('brightnessTo', function(level){
        var model          = this.getModel();
        var page           = model.getCurrentLayoutPage();
        var img            = page.getImage();
        var loader         = this.view.PageLoader();


        // activate dragging
        img.draggable({
            disabled : false
        });
        // update model
        model.setBrightnessLevel(level);

        loader.open();
        loader.text('brightness to <b>'+level+'%</b>');

        $UT.delay(function(){

            model.addParamToImage({
                brightness : level
            });

            page.add();
            page.load(function(){
                loader.close();
            });
        }, 450);
    });

})(jQuery);