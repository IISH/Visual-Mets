(function($){

    /**
     * the routing functionality for the "reset"
     * bind click event to button create method "Reset"
     *
     * function Reset returns methods
     *
     * @return {{
          reset : function
      }}
     */
    App.mets2.Controller.route('reset',{
        events : {
            'click' : function(){
                this.Reset().reset();
            }
        },
        methods : {
            reset : function(){

                var model  = this.getModel();
                var page   = model.getCurrentLayoutPage();
                var loader = this.view.PageLoader();

                model.setZoomLevel(0);
                var size   = this.getView().Canvas().getScaledSize();

                    model.resetParamImage();

                    model.addParamToImage({
                        scale : 0,
                        width : size.width,
                        height: (size.height - model.getPageScaleMargin())
                    });
                    page.getImage().removeAttr('style');
                    loader.open();
                    loader.text('resetting...');

                    // set parameters


                    page.reload();

            }
        }
    });


})(jQuery);