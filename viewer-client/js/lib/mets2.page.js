(function($){
    /**
     * @notice This differs from the normal behavior extend method
     * there this method will be created als a new instance that's why
     * the view is passed by arguments
     * @see Controller.LayoutManager._.storeImages (private method for creating the pages)
     *
     * Page is the functionality for the page view rendering
     * returns methods
     * @return {{
          add           : function,
          load          : function,
          getImage      : function,
          getImageSize  : function,
          setImageSize  : function,
          show          : function,
          hide          : function,
          remove        : function,
          isPortrait    : function,
          isLandscape   : function,
          getData       : function,
          addParam      : function,
          getParam      : function,
          getTranscriptionUrl   : function,
          getThumbnailUrl       : function,
          getPageUrl            : function,
          getUrl                : function,
          setUrl                : function,
          getUrlByType          : function
          getParents            : function
      }}
     */
    App.mets2.View.extend('Page', function(_view, _data){


        this.data  = _data;
        this.view  = _view;
        this.model = this.view.getModel();
        this.doc   = this.model.getDocument();
        this.page  = this.data.img;
        this.id    = parseInt(this.data.pageId);
        this.title = this.data.label;
        this.currentUrl = "";
        this.parent =  [];

        /**
         * set the url in the img dom object reverence "img.mets-page"
         * @return void this.getPages()
         * @return {{Page: Object}}
         */
        this.add = function(parent){
            this.parent = parent || [];
            // add to the dom if its not exist
            if(this.model.getCanvasSelector().find('img#'+this.id).length == 0){

                this.page.removeClass('mets-image').attr({
                    'class' : 'mets-page',
                    'id'    : this.getId()
                }).hide();
                // iff tere is a html warring spull...
                if( this.parent.length == 0){
                    this.parent = this.page;

                }else{
                    // store parents...
                    this.page.appendTo(this.parent);
                }
                this.parent.appendTo(this.model.getCanvasSelector());
            }
            if(this.model.hasDocumentPages()){


                this.getImage().attr({
                    'class' : 'mets-page ',
                    'src'   : this.getUrl()+this.getParam()
                });
            }else{
                this.view.Messenger().warning(this.model.getLabel('error.page')).showIcon();
            }
            return this.page;
        };
        /**
         * reload the image url source
         */
        this.reload = function(){

            if(this.model.isDebugActive()){
                console.info("IMAGE RELOAD: %c"+this.getUrl()+this.getParam(), "color:#043989; font-weight: 800;");
            }
            var loader = this.view.PageLoader();
                loader.text('Reload image');
                loader.open();

            this.getImage().attr({
                'class' : 'mets-page ',
                'src'   : this.getUrl()+this.getParam()
            });
            // prevent for recursive loop !!...
            this.page.bind('load', function(){
                loader.close();
                $(this).unbind('load');
            });
        };
        /**
         * get the pages data transcription url
         * @return transcription_url String
         */
        this.getTranscriptionUrl = function(){
            return this.data.transcription_url;
        };

        /**
         * get the pages data thumbnail url
         * @return thumbnail_url String
         */
        this.getThumbnailUrl = function(){
            return this.data.thumbnail_url;
        };

        /**
         * get the pages data page url (single page)
         * @return url String
         */
        this.getPageUrl = function(){
            return this.data.url;
        };

        /**
         * get the id of the image
         * @returns {int}
         */
        this.getId = function(){
            return this.id;
        };

        /**
         * for mapping functionality this method gives a url back
         * by data object reverence
         * @see Page.data
         * @see Model.Document.pager.pages.page
         *
         * @param type String
         * @returns {null}
         */
        this.getUrlByType = function(type){
            var url = "";
            switch(type){
                case 'thumbnail_url' : {
                    url = this.getThumbnailUrl();
                }break;
                case 'transcription_url' : {
                    url = this.getTranscriptionUrl();
                }break;
                case 'url' : {
                    url = this.getPageUrl();
                }break;
            }
            return url;
        };

        /**
         * get the current loaded active url (page, thumbnail etc)
         * @return currentUrl String
         */
        this.getUrl = function(){
           return this.currentUrl;
        };

        /**
         * set the url to load!
         * @param url
         * @returns {*}
         */
        this.setUrl = function(url){
            this.currentUrl = url;
        };
         /**
         * get the data object information
         * @returns {{Object: *}}
         */
         this.getData = function() {
            var self = this;
            return self.data;
        };
        /**
         * add parameter for url request
         * @param obj Object
         */
        this.addParam = function(obj){
            this.model.addParamToImage(obj);
        };
        /**
         * get the paramters in url string format
         * @return param String
         */
        this.getParam = function(){
            var temp = this.model.getImageParam();
            return '&'+$.param(this.model.getImageParam());
        };

        /**
         * get the page id
         * @returns id int
         */
        this.getId = function(){
          return this.id;
        };

        /**
         * get the page title
         * @returns id int
         */
        this.getTitle = function(){
            return this.title;
        };

        /**
         * get all the parent wrapper elements
         * @returns {*}
         */
        this.getParent = function(){
            return this.parent;
        };


        /**
         * remove the page or parent (image) from the screen
         * @return void
         */
        this.remove = function(){
            if(this.getParent().length > 0){
                this.getParent().remove();
            }else{
                this.getImage().remove();
            }
        };
        /**
         * function will be trigger's if the image is loaded in the dom
         * @param fn
         * @return {{Page: Object}}
         */
        this.load = function(fn){

            var self = this;
            $UT.Image().get({
                src : self.getUrl(),
                succes : function(img){

                    self.show();
                    fn();
                    if(self.model.isDebugActive()){
                        console.info("IMAGE: %c"+self.getUrl()+self.getParam(), "color:#043989; font-weight: 800;");
                    }
                }
            });

            this.page.bind('load', function(){

                self.page.unbind('load');

            });
            return this;
        };
        /**
         * function will be trigger's if the image cant be loaded
         * @param fn callback
         * @return {{Page: Object}}
         */
        this.error = function(fn){

            var self = this;
            $UT.Image().get({
                src : self.getUrl(),
                error : function(){
                    if(self.model.isDebugActive()){
                        console.warn("IMAGE ERROR: %c"+ self.getUrl()+self.getParam());
                    }
                    self.page
                        .removeClass('mets-thumbnail')
                        .addClass('mets-thumbnail-error')
                        .attr('src', self.model.getThemePath()+'file-error.png');
                    self.show();
                    fn();
                }
            });

            return this;
        };
        /**
         * get the jquery selector <img>
         * @returns {*}
         */
        this.getImage = function(){
            return this.page;
        };
        /**
         * get the image size width, height
         * @returns {{width: int, height: int}}
         */
        this.getImageSize = function(){
            return {
                width : this.page.width(),
                height : this.page.height()
            }
        };
        /**
         * @param size  {{width: int, height: int}}
         * @param duration int time of animation (optional)
         * @return {{Page: Object}}
         */
        this.setImageSize = function(size, duration){
            if(size.width){
                this.page.width(size.width)
            }
            if(size.height){
                this.page.height(size.height);
            }
            return this;
        };
        /**
         * show the page animated
         * @param fn    callback on ready
         * @return {{Page: Object}}
         */
        this.show = function(fn){
            this.page.fadeIn(300, fn);
            return this;
        };
        /**
         * hide the page animated
         * @param fn    callback on ready
         * @return {{Page: Object}}
         */
        this.hide = function(fn){
            this.page.fadeOut(300, fn);
            return this;
        };
        /**
         * check whether the page is a vertical
         * @return boolean
         */
        this.isPortrait = function(){
            var size = this.getImageSize();
            return (size.height > size.width);
        };

        /**
         * check whether the page is a horizontal
         * @return boolean
         */
        this.isLandscape = function(){
            var size = this.getImageSize();
            return (size.width > size.height);
        };

    });

})(jQuery);