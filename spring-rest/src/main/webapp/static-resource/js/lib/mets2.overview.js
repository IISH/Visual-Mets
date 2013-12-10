(function($){

    /**
     * go back to thumbnail overview
     * @see Model.Map option mapping
     * @see Controller.LayoutManager (comment) line 45

     * the routing functionality for the "overview"
     * bind click event to button create method "Overview"
     *
     * function Overview returns methods
     *
     * @return {{
          loadThumbLayout : function
      }}
     */
    App.mets2.Controller.route('overview',{
        events : {
            'click' : function(){

              this.loadThumbLayout();
            }
        },
        methods : {
            loadThumbLayout : function(){

                var model = this.getModel();
                var layoutType = model.getTypeLayout();
                var manager = null;


                var configLayout = model.getLayoutStartScreenConfig();
                var config = {};
                if(model.isFullScreenEnable()){
                    config = configLayout.fullScreen;
                }else{
                    config = configLayout.defaultScreen;
                }

                // reset parameters!...
                model.resetParamImage();
                // get layout load configuration...

                for(var name in config){
                    if(config.hasOwnProperty(name)){
                        $$(layoutType);
                        if(layoutType == name){

                            model.setTypeLayout(config[name]);
                            manager = this.LayoutManager();
                            manager.init();
                            manager.removePages();
                            manager.init();
                            manager.setPages();
                            manager.showPages();
                            manager.updateLayout();
                        }
                    }
                }
            }
        }
    });

})(jQuery);