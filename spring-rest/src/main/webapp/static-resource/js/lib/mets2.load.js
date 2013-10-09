(function($){

    /**
     * add option to App.mets2Viewer
     * default it set to false
     */
    App.mets2.Model.map([
        {
            'debugMode' : 'debug',
            'default'   : false
        },
        {
            'language' : 'language',
            'default'   : 'en'
        }
    ]);
    /**
     * load method will execute request handler
     */
    App.mets2.Controller.extend('load', function(){


        var self = this;
        this.event.addListener('templateReady', function(){
            var params = self.getModel().getParam();
            self.getModel().setUrl(params.url);
            self.request(params);
        });
        this.loadTemplate();
    });



    App.mets2.Controller.extend('captureButtons', function(){

        var model = this.getModel();
        var buttons = model.getFrameSelector().find('.mets-button');

        for(var i=0; i < buttons.length; i++) {
            var btn = $(buttons[i]);
            try{
                var name = btn.find('i').attr('class').replace(new RegExp("\\s|(mets-icon)", 'g'), '');
                var label = this.getLabel('label.'+name);
                if(!$UT.isEmpty(label)){
                    btn.attr({
                        'data-toggle':'tooltip',
                        'title':label
                    });
                    if(btn['tooltip']){
                        btn.tooltip();
                    }else{
                        if(this.isDebugActive()){
                            console.warn("WARING: $.tooltip(); is missing for label ["+label+"] ", btn);
                        }
                    }
                }
                model.button[name] = btn;
            }catch(e){}
        }
    });


    /**
     * add button reverence to the model, store the arguments in the model
     * render "Frame" and initialise "LayoutManager"
     * and initialise  events:
     * @events {
         templateReady
         onBeforeSend
         onUpdated
         onServerError
         onServerUserError
         onError
         onDocumentException
         onLoad
         onSuccess
         onImageLoad
         onImageReady
         onImageError
         onStartQueueReady
         onImageQueueReady
         onResize
         onRescaled
         onTranscriptionReady
         onMessageOpen
         onMessageClose
     * }
     *
     * and create view elements
     * @param args  Object
     * @return void
     */
    App.mets2.Controller.extend('init', function(param){

        var self = this;
        var model = this.getModel();
        this.event.addListener('templateReady', function(){


            model.setCanvasSelector(self.getModel().getFrameSelector().find('.mets-canvas'));


            // store button reverences.!
            self.captureButtons();
            // start auto binder for buttons.!
            self.autoBind();

            var frame = self.getView().Frame();



            // start loading layout
            var layoutManager = self.LayoutManager();
            var first = true;
                self.event.addListener('onLayoutReady', function(layoutName){

                    if(layoutManager.isThumbnailTypeLayout(layoutName)){

                        // if a thumbnail layout is loaded than reset zooming
                        self.model.resetZooming();
                    }
                    self.paginationPositionManager();
                });
                layoutManager.init();


            // create arguments...
            model.setParam(param);
            // set canvast


            // render the canvas
            frame.setOptionSize();
            frame.render();




            // --[server events]------------------------------------------------------------------------------------------------------
            // execute on onBeforeSend request is finished
            self.event.addListener('onBeforeSend', function(){

                // close any massages
                self.getView().Messenger(self.event)
                    .close();
                // start loader
                self.getView().PageLoader().open().text(self.getLabel('loader.page'));
            });



            // execute after the request is finished and after the model is updated
            self.event.addListener('onUpdated', function(){

                // update length
                self.getModel().setPaginationLength(model.getDocumentPages().length);


                // if mets id is changed than reset parameters
                // and store again the mets id
                if(self.model.isDifferentMetsID()){

                    self.model.resetPagination();
                    self.model.resetZooming();

                    self.model.emptyLayoutPageStorage();
                    self.model.resetParamImage();
                    self.model.setMetsID(self.model.getDocument().metsId);
                }
                // clean up pages in canvas
                layoutManager.removePages();

            });
            // fire on server error...
            self.event.addListener('onServerError', function(jqXHR, textStatus, errorThrown){

                errorThrown = (errorThrown == undefined)?'error':textStatus;
                textStatus = (textStatus == undefined)?'unknown':textStatus;

                self.getView().Messenger(self.event)
                    .error(errorThrown+" "+self.getLabel('error.status', {status: textStatus}))
                    .getIcon()
                    .serverError()
                    .show();
                self.getView().PageLoader().close();
            });

            // on server user defended error...
            self.event.addListener('onServerUserError', function(code){

                var errorCode = self.getLabelObject('errorCodes');
                var text = '';
                for(var keyCode in errorCode){
                    if(errorCode.hasOwnProperty(keyCode)){
                        if(keyCode == code){
                            text = errorCode[code].text;
                        }
                    }
                }
                if(!$UT.isEmpty(text)){
                    var message = self.getView().Messenger(self.event);
                        message[errorCode[code].fn](self.getLabel('error.code', {code: code})+" "+text);
                        message.getIcon()
                            .serUrl(errorCode[code].icon)
                            .show();
                        self.getView().PageLoader().close();
                }else{
                    self.getView().Messenger(self.event)
                        .error(self.getLabel('error.code', {code: code}))
                        .getIcon()
                        .serverError()
                        .show();
                    self.getView().PageLoader().close();
                }

            });

            // triggers by every error that occurred
            self.event.addListener('onError', function(code){
                // render frame and layout cause the message is close
                frame.render();
                layoutManager.updateLayout();
            });



            // fire if the Document object is incorrect of caused errors
            self.event.addListener('onDocumentException', function(){
                self.getView().Messenger(self.event)
                    .error(self.getLabel('error.exception'))
                    .getIcon()
                    .scriptError()
                    .show();
                self.getView().PageLoader().close();
            });



            // --[client events]------------------------------------------------------------------------------------------------------
            // execute after the request is finished before the model is loaded
            self.event.addListener('onLoad', function(){
                self.getView().PageLoader().open().text(self.getLabel('loader.data'));
            });


            // create breadcrumb by status request 200 ...
            self.event.addListener('onSuccess', function(){
                // store pages
                layoutManager.setPages();
                // show pages
                layoutManager.showPages();

                self.getView().addBreadcrumb();

        });



            // --[image events]------------------------------------------------------------------------------------------------------

            // on success image loaded
            self.event.addListener('onImageLoad', function(page){
                self.getView().paginationOverview();
                self.getView().PageLoader().open();
                self.getView().PageLoader().text(self.getLabel('loader.loading.page', {'title':page.getTitle()}));

                self.paginationButtonManager();
            });


            // on each image ready
            self.event.addListener('onImageReady', function(page, iterator, length){
                self.getView().TextView().resize();
            });
            // on each image error
            self.event.addListener('onImageError', function(page){
                self.getView().Messenger(self.event)
                    .open()
                    .error(self.getLabel('error.image', {'id':page.getId()}));

            });
            // triggert's when the que is started
            self.event.addListener('onStartQueueReady', function(){
                // open permanent link
                self.getView().PermanentLink(layoutManager.getLayout().getPermanentLinkConfig()).show();
            });
            // on image queue ready
            self.event.addListener('onImageQueueReady', function(page, pos, end, errorCount){
                self.getView().PageLoader().close();
                // no errors occurred close message
                if(errorCount == 0){
                    self.getView().Messenger(self.event).close();
                    layoutManager.updateLayout();
                }
                self.addZooming();
                self.loadTextView();

            });

            // --[remainder events]------------------------------------------------------------------------------------------------------
            // fire the event before resizing
            self.event.addListener('onResize', function(){

            self.getView().PageLoader().setPosition();
            self.getView().TextView().resize();
            frame.render();

            var layoutType = self.getModel().getTypeLayout();
                var configLayout = {};


            if(self.getModel().isFullScreenEnable()){

                // get layout load configuration...
                configLayout = self.getModel().getLayoutFullScreenConfig();

                for(var name1 in configLayout){
                    if(configLayout.hasOwnProperty(name1)){
                        if(layoutType == name1){

                            self.getModel().setTypeLayout(configLayout[name1]);
                            layoutManager.load();
                            layoutManager.removePages();
                            layoutManager.init();
                            layoutManager.setPages();
                            layoutManager.showPages();
                        }
                    }
                }

            }else{

                // get layout load configuration...
                configLayout = self.getModel().getLayoutDefaultScreenConfig();
                for(var name2 in configLayout){
                    if(configLayout.hasOwnProperty(name2)){
                        if(layoutType == name2){
                            self.getModel().setTypeLayout(configLayout[name2]);
                            layoutManager.load();
                            layoutManager.removePages();
                            layoutManager.init();
                            layoutManager.setPages();
                            layoutManager.showPages();
                        }
                    }
                }
            }
        });

            // fire the event after onRescaled
            self.event.addListener('onRescaled', function(){
                layoutManager.updateLayout();
                self.getView().PageLoader().setPosition();
            });

            self.event.addListener('onTranscriptionReady', function(){
                self.getView().TextView().update();
            });

            // trigger on message open
                self.event.addListener('onMessageOpen', function(code){

            });
            // trigger on message close
            self.event.addListener('onMessageClose', function(code){
                // render frame and layout cause the message is visible
                frame.render();
            });



            // show metsviewer!!
            self.getModel().getFrameSelector().show();
        });
    });


    /**
     * empty frame see Model.frame.selector
     * @return void
     */
    App.mets2.Controller.extend('terminate', function(param){

        // empty selector frame
        this.getModel().getFrameSelector().empty();
    });

})(jQuery);