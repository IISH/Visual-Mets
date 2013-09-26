(function($){
    /**
     * there will be four layouts
     *
     * 1 the default layout "one single page layout"
     * 2 thumbnail layout
     * 3 list view layout
     * 3 tiles view layout
     *
     * buttons will be shown or hide on configuration
     * the page layout must have as option witch page to load now ist hard coded
     * if not set than by default page 1 index 0
     *
     * load layput interper the layout behavures
     */

    /**
     * @field layout.type      String       the type of layout bv , page, thumbnail, tiles, list etc
     * @field layout.current   String       the current loaded Layout method
     */
    App.mets2.Model.extend({
        layout : {
            type    : "",
            current : "",
            pages   : []
        },
        layoutConfig : {
            toFullScreen : {
                'thumbnail' : 'thumbnailFullScreen',
                'page'      : 'pageFullScreen'
            },
            toDefaultScreen   : {
                'thumbnailFullScreen' : 'thumbnail',
                'pageFullScreen'      : 'page'
            },
            toStart : {
                fullScreen    : {
                    'pageFullScreen' : 'thumbnailFullScreen'
                },
                defaultScreen : {
                    'page' : 'thumbnail'
                }
            }
        }
    });
    /**
     * map the option parameter to the reverence point layout.name
     *
     * for the default size and full screen size its possible to define your own template
     * to load by tose behaviour's in the instance configuration
     * sample:
     * ----------------------------------------------------------------------------------
       layoutConfig : {
                toFullScreen : {
                    'thumbnail' : 'thumbnailFullScreen',
                    'page'      : 'pageFullScreen'
                },
                toDefaultScreen   : {
                    'thumbnailFullScreen' : 'thumbnail',
                    'pageFullScreen'      : 'page'
                }
       }
     * ----------------------------------------------------------------------------------
     * notice! everything is configured on the layout name for example see PageLayout.name
     * ..................................................................................
     * by the full screen mode you see that the "ThumbnailLayout" the "ThumbnailFullScreenLayout" load on full screen
     * and going from full screen to default we sa that the "ThumbnailFullScreenLayout" the "ThumbnailLayout" must load
     *
     * for making a custom start screen you can also make your  own configuration for example:
     * -----------------------------------------------------------------------------------
     layoutConfig : {
         toStart : {
            fullScreen    : {
                'pageFullScreen' : 'thumbnailFullScreen'
            },
            defaultScreen : {
                'page' : 'thumbnail'
            }
       }
     }
     * -----------------------------------------------------------------------------------
     *
     * the key "fullScreen" and "defaultScreen" described the current behaviour position
     * and below you see the layout that current is loaded and if start is executed
     * than the value for example on full screen the "thumbnailFullScreen" will be loaded
     */
    App.mets2.Model.map([
        {
            'layout'  : {
                'type' : 'layout'
            },
            'default' : "page"
        },{ // the config default options for loading layouts on full screen click behaviour's
            'layoutConfig' : 'layoutConfig',
            'default' :  {
                'toFullScreen' : {
                    'thumbnail' : 'thumbnailFullScreen',
                    'page'      : 'pageFullScreen'
                }
            }
        },{ // the config default options for loading layouts on default screen click behaviour's
            'layoutConfig' : 'layoutConfig',
            'default' :  {
                'toDefaultScreen'   : {
                    'thumbnailFullScreen' : 'thumbnail',
                    'pageFullScreen'      : 'page'
                }
            }
        },{ // the default configuration for going to start for example to the thumbnail layout screen
            'layoutConfig' : 'layoutConfig',
            'toStart' : {
                'fullScreen'    : {
                    'pageFullScreen' : 'thumbnailFullScreen'
                },
                'defaultScreen' : {
                    'page' : 'thumbnail'
                }
            }
        }
    ]);


    /**
     * get teh properties of full screen loading layouts
     * @return {Object|*}
     */
    App.mets2.Model.extend('getLayoutFullScreenConfig', function(){
        return this.layoutConfig.toFullScreen;
    });


    /**
     * get teh properties of default screen loading layouts
     * @return {Object|*}
     */
    App.mets2.Model.extend('getLayoutDefaultScreenConfig', function(){
        return this.layoutConfig.toDefaultScreen;
    });

    /**
     * get teh properties of default start screen layouts
     * @return {Object|*}
     */
    App.mets2.Model.extend('getLayoutStartScreenConfig', function(){
        return this.layoutConfig.toStart;
    });

    /**
     * get the cloned pages for the layout to show
     * @return [Page]
     */
    App.mets2.Model.extend('getLayoutPages', function(){
        return this.layout.pages;
    });

    App.mets2.Model.extend('emptyLayoutPageStorage', function(){
        this.layout.pages.length=0;
    });


    /**
     * store the view.Page to the model
     * @see Model.layout.pages
     * @param Page Object
     */
    App.mets2.Model.extend('setImageToLayoutPages', function(Page){
        this.layout.pages.push(Page);
    });



    /**
     * get the layout type bv, page, thumbnail, tiles , list etc
     * @return type String
     */
    App.mets2.Model.extend('getTypeLayout', function(){
        return this.layout.type;
    });

    App.mets2.Model.extend('setTypeLayout', function(type){
        this.layout.type = type;
    });

    /**
     * setter fot sore the current active layout
     * @param {{Layout: Object}}
     * @return void
     */
    App.mets2.Model.extend('setLayout', function(layput){
        this.layout.current = layput;
    });

    /**
     * get the current loaded layout
     * @return {{Layout: Object}}
     */
    App.mets2.Model.extend('getLayout', function(){
        return this.layout.current;
    });


    /**
     * This is the layout manager and its responsible for loading the layouts
     * and interpret the layout behaviour's and settings
     *
     * returns methods
     * @return {{
          pageQueueLoader   : function,
          getLayoutByType   : function,
          setLayout         : function,
          getLayout         : function,
          getDocumentPages  : function,
          setPages          : function,
          showPages         : function,
          getPageIndexById  : function,
          pageIdExist       : function,
          showPageById  : function,
          getPages      : function,
          getFirstPage  : function,
          init          : function,
          removePages   : function
          load   : function
      }}
     *
     * @see Controller.init
     */
App.mets2.Controller.extend('LayoutManager', function(){

    // field in controller
    var controller   = this;
    var model        = controller.getModel();
    var view         = controller.getView();
    var barSelectors = model.getFrameSelector().find('div.mets-bar');
    var template = model.getFrameSelector().find('img.mets-image');

    // private
    var _ = {
        /**
         * parse the views configuration of layouts
         * @see Layout.getLayoutViews
         * @param views
         * @return void
         */
        parseViesOfLayouts : function(views){

            var wrapperClass = model.getFrameSelector().find('.mets-button-wrapper');
            // enable every wrapper again before hiding
            var wrp = wrapperClass;
            for(var a=0; a < wrp.length; a++){
                $(wrp[a]).show();
            }
            // enable every button again before hiding
            var btns = model.getButtons();
            for(b in btns) {
                if(btns.hasOwnProperty(b)){
                    btns[b].show();
                }
            }


            for(var b=0; b < views.bars.length; b++){

                var bar         = views.bars[b];
                var barSelector = barSelectors.eq(b);

                // check if exist
                if(barSelector.length > 0){
                    // check if its a boolean
                    if(typeof(bar) === "boolean"){
                        // hide elements bars
                        if(bar === false){
                            barSelector.hide();
                        }else{
                            barSelector.show();
                        }
                    // its a wrapper element second dimension...
                    }else if(typeof(bar) === "object"){

                        // .............................................................
                        for(var w=0; w < bar.length; w++){

                            var wrapper = bar[w];
                            var wrapperSelector = barSelector.find(wrapperClass).eq(w);

                            if(typeof(wrapper) === "boolean"){
                                // hide elements button wrapper
                                if(wrapper === false){
                                    wrapperSelector.hide();
                                }
                            // button elements third dimension...
                            }else if(typeof(wrapper) === "object"){
                                // .....................................................

                                for(var btn=0; btn < wrapper.length; btn++){
                                    var button = wrapper[btn];

                                    for(var name in button){
                                        if(button.hasOwnProperty(name)){

                                            var btnSelector = model.getButtonByName(name);
                                            if(btnSelector.length > 0){
                                                if(button[name] === false){
                                                    btnSelector.hide();
                                                }
                                            }
                                        }
                                    }
                                }

                                // .....................................................
                            }
                        }
                        // .............................................................
                    }
                }
            }
        },

        cloneImage : function(){
            return template.clone();
        },

        storeImages : function(pages){
            for(var i=0; i < pages.length; i++){

                var data = pages[i];
                    data['img'] = _.cloneImage();

                var page = new view.Page(view, data);
                    model.setImageToLayoutPages(page);
            }
        },
        layoutEventHandler : function(page){
            // get the event
            var events = model.getLayout().getEvents();
            // loop trough
            for(var e in events){
                if(events.hasOwnProperty(e) && typeof(events[e]) === 'function'){
                    // set event on page (image)
                    (function(event, page){
                        page.getImage().bind(e+'.mets-img', function(){
                          // capture new layout
                           var layout_fn = events[event](page);
                           if(layout_fn){

                               // load new layout ...
                               // ............................................
                                model.setTypeLayout(view[layout_fn]().name);

                                var manager = controller.LayoutManager();
                                    // update position
                                   model.setPaginationPosition(manager.getPageIndexById(page.getId()));

                                   manager.init();
                                   manager.removePages();
                                   manager.setPages();

                                   // re-render frame
                                   controller.getView().Frame().render();
                                   // show
                                   manager.showPageById(page.getId());

                               // ...........................................
                           }
                        });
                    })(e, page);
                }
            }
        },
        /**
         * load the specific layout
         * @param type
         */
        loadLayout : function(type){

          if(view[type]){
              model.setLayout(view[type]());
          }else{
              if(controller.isDebugActive()){
                  console.error('WARNING ON LOADING: '+type);
              }
          }

        },
        /**
        * set the proper style layout reverence
        */
        setLayoutCSSReverence : function(){
            model.getFrameSelector().attr('class', 'mets-container '+model.getLayout().getCSSClass());
        }
    };



    var methods = {
        /**
         * load all the pages in query fiore events:
         * @event onImageLoad           fired before the image is created
         * @event onImageReady          fired after the image is loaded before the start of the next que
         * @event onImageError          fired after the error and before the next que
         * @event onImageQueueReady     fired when all the images are loaded
         *
         * @see view.Page
         * @param Pages Object          see view.Page
         * @param pos                   pos, integrator
         * @param end
         * @param errorCount            the number of counted errors
         * @param iterator              iterator of the pageQueueLoader
         */
        pageQueueLoader : function(Pages, pos, end, errorCount, iterator){
            errorCount = (errorCount == undefined)?0:errorCount;
            pos = (pos == undefined)?0:pos;
            end = (end == undefined)?Pages.length:end;
            iterator = (iterator == undefined)?0:iterator;
            var self = this;
            var layout = model.getLayout();
            var page = Pages[pos];


            if(page){

                controller.event.fire('onImageLoad', page, pos, end, iterator);
                // store parameters for page request
                page.addParam(layout.getPageParams());
                // set the url to load
                page.setUrl(page.getUrlByType(layout.whichUrlTypeToLoad()));
                // add html dom wrapper for image
                page.add(layout.getImageWrapper());

                // set events
                _.layoutEventHandler(page);
                // load...
                page.load(function(){

                    if(pos < end && iterator < layout.getAmountPages()){

                        pos++;
                        if(pos == end){
                            controller.event.fire('onImageReady', page, pos, end);
                            controller.event.fire('onImageQueueReady', page, pos, end, errorCount);
                        }
                        else {
                            controller.event.fire('onImageReady', page, pos, end);

                            self.pageQueueLoader(Pages, pos, end, errorCount, ++iterator);
                        }
                    }else{
                        // if there are no images left
                        controller.event.fire('onImageQueueReady', page, pos, end, errorCount);
                    }

                });
                page.error(function(){
                    errorCount++;
                    if(pos == end){
                        controller.event.fire('onImageQueueReady', page, pos, end, errorCount);
                    }
                    controller.event.fire('onImageError', page, pos, end, errorCount);
                    controller.event.fire('onError', errorCount);
                });
            }else{
                // if there are no images left
                controller.event.fire('onImageQueueReady', page, pos, end, errorCount);
            }
        },
        getLayoutByType : function(){
            var type = model.getTypeLayout();
            return $UT.ucwords(type)+"Layout";
        },

        /**
         * set the layout Object by type name bv thumbnail => ThumbnailLayout
         * @param type String
         * @return {{LayoutManager: Object}}
         */
        setLayout : function(type){
            _.loadLayout(type);
            App.mets2.Implement(model.getLayout(), 'LayoutInterface');
            return this;
        },

        /**
         * get the layout Object by type name bv thumbnail => ThumbnailLayout
         * @see App.mets2.LayoutInterface
         * @return {{Object, LayoutInterface}}
         */
        getLayout : function(){
            return model.getLayout();
        },

        /**
         * call the method "update" of the layout
         * @see App.mets2.LayoutInterface
         * @return void
         */
        updateLayout : function(){
            this.getLayout().update();
        },

        /**
         * get the amount of required pages based on the type of layout
         * @returns {*|Array}
         */
        getDocumentPages : function(){

            return $.merge([], model.getDocumentPages());

        },

        /**
         * ger the amount of loaded pages check if not created than create
         * @return {{LayoutManager: Object}}
         */
        setPages : function(){

            var changed = false;
            // the layout is loaded and de model is updated and the steps are different than
            // we now we are changed of layout type
            if(controller.getModel().getPaginationSteps() !== this.getLayout().getAmountPages())
            {
                changed = true;
            }
            // update steps...
            controller.getModel().setPaginationSteps(this.getLayout().getAmountPages());


            if(changed){
                controller.event.fire('onLayoutReady',this.getLayoutByType());
            }
            // empty before restore..

            // store the image objects
            var docPages = this.getDocumentPages();
            var pages2 = this.getPages();

            if(pages2.length == 0){

                _.storeImages(docPages);
            }else{
                // if not exist than create
                for(var p=0; p < docPages.length; p++){
                    if(!this.pageIdExist(parseInt(docPages[p].pageId))){
                        _.storeImages(docPages);
                    }
                }
            }

            return this;
        },
        /**
         * call the queue and load all the necessary pages
         * @return {{LayoutManager: Object}}
         */
        showPages : function(){
          // the pages
            var pages = this.getPages();
            // start point
            var pos  = controller.getModel().getPaginationPosition();
            // end to load is the count of amount f pages to load
            var end  = this.getLayout().getAmountPages()+pos;
            // queue
            controller.event.fire('onStartQueueReady', pages);
            this.pageQueueLoader(pages, pos, end);
            return this;
        },
        /**
         *get the View.Page by page object id
         * @param id
         * @return int index
         */
        getPageIndexById : function(id){
            var pages = this.getPages();
            var i = 0;
            var fount = false;
            var index = 0;
            while(!fount && i < pages.length){

                if(id == pages[i].getId()){
                    fount = true;
                    index = i;
                }
                i++;
            }
            return ((!fount)?fount:index);
        },
        /**
         * if teh id of a page exist or page id exist
         * @param id
         * @returns {boolean}
         */
        pageIdExist : function(id){
            var pages = this.getPages();
            var i = 0;
            var fount = false;
            while(!fount && i < pages.length){
                if(id == pages[i].getId()){
                    fount = true;
                }
                i++;
            }
            return fount;
        },
        /**
         * show a page on id reverence
         * @param id
         * @returns {*}
         */
        showPageById : function(id){
            var pages = this.getPages();
            var match  = null;
            var i = 0;
            var fount = false;

            while(!fount && i < pages.length){

                if(id == pages[i].getId()){
                    fount = true;
                    match = i;
                }
                i++;
            }
            if(match !== null){
                controller.event.fire('onStartQueueReady', pages);
                this.pageQueueLoader(pages, match, match);
            }
            return this;
        },
        /**
         * get the pages from the model
         * @see Model.getLayoutPages
         * @see Model.layout.pages
         * @returns {*}
         */
        getPages : function(){
            return model.getLayoutPages();
        },
        /**
         * get the fisrt page from the model
         * @see Model.getLayoutPages
         * @see Model.layout.pages
         * @returns {*}
         */
        getFirstPage : function(){
            return this.getPages()[0];
        },
        /**
         * set the css class  reverence to the metsViewer frame
         * @return {{LayoutManager: Object}}
         */
        init : function(){
            // set style layout reverence
            _.setLayoutCSSReverence();
            // parse view's given by the current loaded layout
            _.parseViesOfLayouts(this.getLayout().getLayoutViews());
            return this;
        },
        /**
         * reset the Model.layout.pages and remove the image dom object
         * from the screen !!
         * @return {{LayoutManager: Object}}
         */
        removePages : function(){

            var pages = this.getPages();
            for(var p=0; p < pages.length; p++){
                pages[p].remove();
            }

            return this;
        },
        /**
         * check if the layout type is from the type thumbnail
         * check in the string of its a thumnail in this case we have
         * "thumbnailFullScreen" and "thumbnail"
         * @param  subject  String      the string to match (case insensitive)
         * @return boolean
         */
        isThumbnailTypeLayout : function(subject){
            return new RegExp("thumbnail", "gi").test(subject);
        },

        /**
         * check if the layout type is from the type page
         * check in the string of its a page in this case we have
         * "pageFullScreen" and "page"
         * @param  subject  String      the string to match (case insensitive)
         * @return boolean
         */
        isPageTypeLayout : function(subject){
            return new RegExp("page", "gi").test(subject);
        },

        /**
         * load the layout in to the model
         * @see mets2.LayoutInterface
         * @return void
         */
        load : function(){
            _.loadLayout(methods.getLayoutByType());
            App.mets2.Implement(model.getLayout(), 'LayoutInterface');

            if(model.isDebugActive()){
                console.log("MANAGER LOADED: %c"+ $UT.ucwords(model.getTypeLayout())+"Layout ", "color:#026502;", this.getLayout().getData());
            }
        }
    };


    // call load!..
    methods.load();

    return methods;
});


})(jQuery);

