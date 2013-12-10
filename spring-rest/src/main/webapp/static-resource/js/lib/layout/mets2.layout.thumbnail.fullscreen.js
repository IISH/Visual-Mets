(function($){

    /**
     * layout properties for more info
     * @see mets2.LayoutInterface
     */
    App.mets2.Model.extend({
        layouts : {
            thumbnailFullScreen : {
                rows : 3,
                pages  : 15,
                margin : 10,
                views : {
                    bars : [true,[
                        false, false, false, false, false, true, [
                            {'transcription': false},
                            {'overview': false},
                            {'fullscreen': true}
                        ]
                    ], true]
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
     * @implements LayoutInterface
     * the page layout view
     * @field ThumbnailFullScreenLayout.name       String   "thumbnailFullScreen"                   the layout name
     * @field ThumbnailFullScreenLayout.cssClass   String   "mets-layout-full-screen-thumbnail"     the css class see selector frame
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
    App.mets2.View.extend('ThumbnailFullScreenLayout', function(){

        var self = this;
        var model = this.getModel();
        var canvas = this.Canvas();
        // private methods...

        var methods = {
            /**
             * every Layout must have a field name , the name of the layout type
             * @type {string}
             */
            name    : 'thumbnailFullScreen',
            /**
             * the class style for the match of css
             * @see ".mets-container"
             * @type {string}
             */
            cssClass : 'mets-layout-full-screen-thumbnail',
            events   : {
                click : function(page, controller){

                    return 'PageFullScreenLayout';
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
             * @returns {{width: number, height: number}}
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
             * no paramters for thumbnail send
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