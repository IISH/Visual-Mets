/**
 * add field set to the model teh steps to reduce of increase zooming level
 * @option fullSize.active boolean          is full size active or disabled
 *
 * this functionality is unfortunately implemented on several places
 * notice its marked with @fillSize
 */
App.mets2.Model.extend({
    fullSize : {
      active : false
    }
});

App.mets2.Model.extend('activateFullSize',function(){
    this.fullSize.active = true;
});

App.mets2.Model.extend('deactivateFullSize',function(){
    this.fullSize.active = false;
});

/**
 * is fill size active or not
 * @return boolean
 */
App.mets2.Model.extend('isFullSizeActive',function(){
    return this.fullSize.active;
});


App.mets2.Model.extend('addFullSizeParamToImage',function(){
    this.addParamToImage({
        'scale' : 100,
        'width' : 0,
        'height': 0
    });
});



/**
 * the routing functionality for the "fullsize"
 * bind click event to button create method "fullsize"
 *
 * function Fullsize returns methods
 *
 * @return {{
          toFullSize : function
      }}
 */
App.mets2.Controller.route('fullsize',{
    events : {
        'click' : function(){
            this.toFullSize();

        }
    },
    methods : {
        toFullSize : function(){

            this.fullSize();
            this.model.activateFullSize();
        }
    }
});



/**
 * zoom in to page 100%
 * @see Controller.init
 * @return void
 */
App.mets2.Controller.extend('fullSize',function(){

    var self =  this;
    var model =  self.getModel();
    var page  = model.getCurrentLayoutPage();

    if(page){
        var img = page.getImage();
        var loader = this.getView().PageLoader();
        var canvas = this.getView().Canvas();

            img.css({'cursor' : 'move'});
            model.setDraggingOptions({
                cursor   : 'move',
                disabled : false
            });
            // add drag function
            img.draggable(model.getDraggingOptions());

            loader.open();
            loader.text('zooming in to 100%');
            model.addParamToImage({
                'scale' : 100,
                'width' : 0,
                'height': 0
            });

            page.reload();
            page.load(function(img){

             var canvasSize = canvas.getSize();
             var newSize = $UT.aspectRatio({
                    currentHeight : canvasSize.height,
                    currentWidth  : canvasSize.width,
                    newHeight     : img.height
                });

                model.setZoomLevel(Math.floor((newSize.width/canvasSize.width)*model.getScaleSteps())-model.getScaleSteps());
                model.addParamToImage({
                    'scale' : 0,
                    'width' : newSize.width,
                    'height' : newSize.height
                });

            });
            $UT.delay(function(){
                loader.close();
            }, 450);
    }
});
