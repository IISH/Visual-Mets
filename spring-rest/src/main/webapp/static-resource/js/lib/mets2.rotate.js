(function($){
    /**
     * add field set to the model for rotate functionality
     * @field rotate.angle int             de angle of the rotation
     * @field rotate.max int               the maximum level angle rotation in %
     * @field rotate.min int               the minimum level angle rotation in %
     * @field rotate.steps int             steps for rotation
     */
    App.mets2.Model.extend({
        rotate : {
            angle : 0,
            max   : 360,
            min   : 0,
            steps : 90
        }
    });



    /**
     * get the current rotate angle
     * @return int level
     */
    App.mets2.Model.extend('getRotateAngle', function(){
        return this.rotate.angle;
    });

    /**
     * set the rotate angle
     * @param int level
     * @return void
     */
    App.mets2.Model.extend('setRotateAngle', function(angle){
        this.rotate.angle = angle;
    });

    /**
     * get the rotate tep
     * @return int step
     */
    App.mets2.Model.extend('getRotateSteps', function(){
        return this.rotate.steps;
    });

    /**
     * get the maximum rotate steps range to go
     * @return int step
     */
    App.mets2.Model.extend('getRotateMaximum', function(){
        return this.rotate.max;
    });

    /**
     * get the minimum contrast level range to sink
     * @return int step
     */
    App.mets2.Model.extend('getRotateMinimum', function(){
        return this.rotate.min;
    });


    /**
     * the routing functionality for the "rotateleft"
     * bind click event to button create method "Rotateleft"
     *
     * function Rotateleft returns methods
     *
     * @return {{
          rotate : function
      }}
     */
    App.mets2.Controller.route('rotateleft',{
        events : {
            'click' : function(){
                this.rotate();
            }
        },
        methods : {
            rotate : function(){
                var model  = this.getModel();
                var angle  = model.getRotateAngle();

                if(angle == model.getRotateMinimum()){
                    angle =  model.getRotateMaximum()-model.getRotateSteps();
                }else{
                    angle = angle-model.getRotateSteps();
                }

                this.rotateTo(angle);
            }
        }
    });

    /**
     * the routing functionality for the "rotateright"
     * bind click event to button create method "Rotateright"
     *
     * function Rotateright returns methods
     *
     * @return {{
          rotate : function
      }}
     */
    App.mets2.Controller.route('rotateright',{
        events : {
            'click' : function(){
                this.rotate();
            }
        },
        methods : {
            rotate : function(){
                var model  = this.getModel();
                var angle  = model.getRotateAngle();

                if(angle == model.getRotateMaximum()){
                    angle = model.getRotateMinimum()+model.getRotateSteps();
                }else{
                    angle = angle+model.getRotateSteps();
                }
                this.rotateTo(angle);
            }
        }
    });


    /**
     * render the rotate update the model, and render the page (img)
     * @return void
     */
    App.mets2.Controller.extend('rotateTo', function(angle){
        var model = this.getModel();
        var page           = model.getCurrentLayoutPage();
        var img            = page.getImage();
        var loader = this.view.PageLoader();


        // activate dragging
        img.draggable({
            disabled : false
        });

        // update model
        model.setRotateAngle(angle);

        loader.open();
        loader.text('rotate to <b>'+angle+'%</b>');

        $UT.delay(function(){
            model.addParamToImage({
                angle : angle
            });
            page.add();
            page.load(function(){
                loader.close();
            });
        }, 450);
    });



})(jQuery);