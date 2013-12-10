
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
                'width' : canvas.getSize().width,
                'height': canvas.getSize().height
            });
            model.setZoomLevel(10);
            page.reload();

            $UT.delay(function(){
                loader.close();
            }, 450);
    }
});
