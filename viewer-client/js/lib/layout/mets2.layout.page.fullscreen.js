(function($){
    /**
     * layout properties for more info
     * @see mets2.LayoutInterface
     */
    App.mets2.Model.extend({
        layouts : {
            pageFullScreen : {
                pages : 1,
                scaleMargin : 25,  // the margin to subtract,
                views : {
                    bars : [true, true, true]
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
     * @implements LayoutInterface
     * the page layout view
     * @field PageFullScreenLayout.name       String   "pageFullScreen"                     the layout name
     * @field PageFullScreenLayout.cssClass   String   "mets-layout-full-screen-page"       the css class see selector frame
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
    App.mets2.View.extend('PageFullScreenLayout', function(){

        var self = this;
        var model = self.getModel();
        var canvas = self.Canvas();

        var methods = {
            name    : 'pageFullScreen',
            cssClass : 'mets-layout-full-screen-page',

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

                // return the stored width, height if this exist

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