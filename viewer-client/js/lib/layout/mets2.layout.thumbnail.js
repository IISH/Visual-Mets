(function($){
    /**
     * layout properties for more info
     * @see mets2.LayoutInterface
     */
    App.mets2.Model.extend({
        layouts : {
            thumbnail : {
                rows : 2,
                pages  : 8,
                margin : 10,
                views : {
                    bars : [false,[
                        false, false, false, false, false, true, [
                            {'transcription': false},
                            {'overview': false},
                            {'fullscreen': true}
                        ]
                    ], false]
                },
                /**
                 * show or hide links in bars
                 */
                permanentLink : {
                    description : true,
                    image       : false
                }
            }
        }
    });



    /**
     * get the amount of loaded pages for tis layout
     * @return pages int
     */
    App.mets2.Model.extend('getAmountOfThumbnailPages', function(){
        return this.layouts[this.getTypeLayout()].pages;
    });

    /**
     * get thumbnail data <u>layout</u> data
     * @return {{Object:*}}
     */
    App.mets2.Model.extend('getThumbnailData', function(){
        return this.layouts[this.getTypeLayout()];
    });





    /**
     * get the layout size of the max width and max height aspect ratio of rendering the thumbnails
     * @returns {{width: int, height: int}}
     */
    App.mets2.Model.extend('getSizeOfThumbnailPages', function(type){
        var self = this;
        return {
            width   : self.layouts[this.getTypeLayout()].width,
            height  : self.layouts[this.getTypeLayout()].height
        }
    });



    /**
     * @implements LayoutInterface
     * the page layout view
     * @field ThumbnailLayout.name       String   "thumbnail"                 the layout name
     * @field ThumbnailLayout.cssClass   String   "mets-layout-thumbnail"     the css class see selector frame
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
            update                  : function,
            getGridSize             : function
       }}
     */
    App.mets2.View.extend('ThumbnailLayout', function(){

        var self   = this;
        var model  = this.getModel();
        var canvas = this.Canvas();
        // private methods...

        var methods = {
            /**
             * every Layout must have a field name , the name of the layout type
             * @type {string}
             */
            name    : 'thumbnail',
            /**
             * the class style for the match of css
             * @see ".mets-container"
             * @type {string}
             */
            cssClass : 'mets-layout-thumbnail',
            events   : {
                click : function(page){

                    return 'PageLayout';
                }
            },
            getData : function(){
                return model.getThumbnailData();
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
             * give back events defended in the field "events"
             * @notice a onclick event must give a layout type back (string) "PageLayout"
             * so that the controller nows wwhitch layout to load
             * @returns {*}
             */
            getEvents : function(){
                return methods.events;
            },
            getCSSClass    : function(){
                return methods.cssClass;
            },
            /**
             * get the amount of pages that must be loaded
             * @see App.mets2.LayoutInterface
             * @see Controller.LayoutManager
             * @returns int
             */
            getAmountPages : function(){
               return model.getAmountOfThumbnailPages();
            },
            /**
             * this method give's back the size of the grid fro the thumbnails
             * @returns {{width: int, height: int}}
             */
            getGridSize : function(){

                var size = canvas.getSize(),
                    data = model.getThumbnailData(),
                    rows = data.rows,
                    amount = data.pages,
                    width = Math.floor(size.width / (amount/rows))-(data.margin*2),
                    height = Math.floor(size.height / rows)-(data.margin*2);

                return {
                    width : width,
                    height : height
                }
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
                return 'thumbnail_url';
            },
            /**
             * no parameters for thumbnail send
             * @returns {{}}
             */
            getPageParams : function(){
              return {}
            },
            /**
             * re-render the width and the height id there is a change in the frame and canvas
             * @return void
             */
            update : function(){
                /*
                    DODO fix model instance bug!! voor meerdere viewers

                    console.warn('GET CANVAS  ', model.getCanvasSelector());
                    console.warn('SELECTOR    ', model.getFrameSelector());
                */
                var cells = model.getCanvasSelector().find('.mets-thumb-cell');
                var size = methods.getGridSize();
                var cell = [];
                for(var i=0; i < cells.length; i++){
                    cell = $(cells[i]).width(size.width).height(size.height);
                }
            },
            /**
             * return html for wrapping the mage for design purposes
             * @returns {*|jQuery}
             */
            getImageWrapper : function(){
                var size = methods.getGridSize();
                return $('<div>')
                    .width(size.width)
                    .height(size.height)
                    .addClass('mets-thumb-cell');
            },
            getLayoutViews : function(){
                return model.getThumbnailData().views;
            }
        };
        return methods;
    });

})(jQuery);