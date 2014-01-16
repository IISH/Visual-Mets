(function($){
    /**
     * layout properties for more info
     * @see mets2.LayoutInterface
     */
    App.mets2.Model.extend({
        layouts : {
            page : {
                pages : 1,
                scaleMargin : 25,  // the margin to subtract,
                views : {
                    bars : [false,[
                        false, false, false, false, false, true, [
                            {'transcription': false},
                            {'overview': true},
                            {'fullscreen': true}
                        ]
                    ], false]
                },
                /**
                 * show or hide links in bars
                 */
                permanentLink : {
                    description : true,
                    image       : true
                }
            }
        }
    });



    /**
     * get the first layout page stored from the model
     * @see Model.layout.pages
     * @return view.Page Object
     */
    App.mets2.Model.extend('getCurrentLayoutPage', function(){
        var pages = this.getLayoutPages();
        var pos    = this.getPaginationPosition();
        if(pages.length == pos){
            pos = pos -1;
        }
        return this.getLayoutPages()[pos];
    });


    /**
     * get the page scale margin for rendering the url request for the canvas aspect ratio rendering
     * @return int
     */
    App.mets2.Model.extend('getPageScaleMargin', function(){
        return this.layouts[this.getTypeLayout()].scaleMargin;
    });


    /**
     * get the number of showed pages  vor every loaded screen
     * @return int
     */
    App.mets2.Model.extend('getAmountOfPagePages', function(){
        return this.layouts[this.getTypeLayout()].pages;
    });

    /**
     * get page data <u>layout</u> data
     * @return {{Object:*}}
     */
    App.mets2.Model.extend('getPageData', function(){
        return this.layouts[this.getTypeLayout()];
    });

    /**
     * @implements LayoutInterface
     * the page layout view
     * @field PageLayout.name       String   "page"                 the layout name
     * @field PageLayout.cssClass   String   "mets-layout-page"     the css class see selector frame
     * @returns {{
            getCSSClass             : function,
            getAmountPages          : function,
            getEvents               : function,
            getData                 : function,
            getPermanentLinkConfig  : function,
            whichUrlTypeToLoad      : function,
            getImageWrapper         : function,
            getPageParams           : function,
            getLayoutViews          : function,
            update                  : function
       }}
     */
    App.mets2.View.extend('PageLayout', function(){

        var self   = this;
        var model  = this.getModel();
        var canvas = this.Canvas();

        var methods = {
            name    : 'page',
            cssClass : 'mets-layout-page',

            getCSSClass : function(){
                return methods.cssClass;
            },
            getAmountPages : function(){
                return model.getAmountOfPagePages();
            },
            getEvents : function(){
                return {};
            },
            getData : function(){
              return model.getPageData();
            },
            /**
             * returns the setting for showing or hiding the links (permanentLink, image)
             * @see view.PermanentLink
             * @returns {*}
             */
            getPermanentLinkConfig : function(){
                return this.getData().permanentLink;
            },
            /**
             * map the url type to the data reverence in the view.Page object
             * @see view.Page
             * @see view.Page.data
             * @see Model.Document.pager.pages.page
             *
             * @returns {string}
             */
            whichUrlTypeToLoad : function(){
                return 'url';
            },
            getImageWrapper : function(){
                return [];
            },
            /**
             * give back the parameters for scaling the image
             * aspect ratio is based on Canvas size
             * @returns {{scale: number, width: *, height: *}}
             */
            getPageParams : function(){

                var size  = canvas.getSize();
                var param = model.getImageParam();
                // return the stored width, height if this exist
                /**
                 * @fillSize do not on fullsize
                 */
                if(!self.getModel().isFullSizeActive()){
                    return {
                        'scale'  : 0,
                        'width'  : param.width || size.width,
                        'height' : param.height || (size.height - model.getPageScaleMargin())
                    }
                }else{
                    return {};
                }
            },
            getLayoutViews : function(){
                return model.getPageData().views;
            },
            /**
             * rescale the image compatible for full screen
             * @return
             */
            update : function(){

                var page   = model.getCurrentLayoutPage();
                var size   = canvas.getScaledSize();

                // set url if not exist
                page.setUrl(page.getUrlByType(this.whichUrlTypeToLoad()));
                /**
                 * @fillSize do not on fullsize
                 */
                // TODO bug reverence klopt niet
                if(!self.getModel().isFullSizeActive()){
                    model.addParamToImage({
                        width : size.width,
                        height : (size.height - model.getPageScaleMargin())
                    });
                }

                page.add();
            }
        };
        return methods;
    });


})(jQuery);