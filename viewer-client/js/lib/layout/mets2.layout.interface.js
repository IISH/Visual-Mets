/**
 * interface for for the layout manager every layout must implement those
 * methods for a compatible laout vor the metsviewer
 * @constructor
 */
App.mets2.LayoutInterface = function(){

    /**
     * every Layout must have a field name , the name of the layout type
     * @type {string}
     */
    this.name = "";

    /**
     * give back the model settings of the template
     * @return {{Object:*}}
     */
    this.getData = function(){};
    /**
     * get the amount of pages that must be loaded
     * @see Controller.LayoutManager
     * @returns int
     */
    this.getAmountPages = function(){};

    /**
     * give back the parameters for scaling the image
     * aspect ratio is based on Canvas size
     * @returns {{scale: number, width: *, height: *}}
      */
    this.getPageParams = function(){};

    /**
     * return html for wrapping the mage for design purposes
     * @returns {*|jQuery}
     */
    this.getImageWrapper = function(){};

    /**
     * map the url type to the data reverence in the view.Page object
     * @see view.Page
     * @see view.Page.data
     * @see Model.Document.pager.pages.page
     *
     * @returns {string}
     */
    this.whichUrlTypeToLoad = function(){};


    /**
     * get the css class for setting the necessary style behaviors
     */
    this.getCSSClass = function(){};

   /**
    * give back events defended in the field "events"
    * @notice a onclick event must give a layout type back (string) "PageLayout"
    * so that the controller nows wwhitch layout to load
    * @see see for example view.ThumbnailLayout
    * @returns {*}
    */
    this.getEvents = function(){};

    /**
     * this method will be called if there ale event fired that change the metsviewer and
     * the layout has functionality dat must be re-renderd like for example html wrarring cells
     * for images
     */
    this.update = function(){};

    /**
     * FIRST DIMENSION bars
     * ...........................................................................................................
     * this method gives back the view elements configuration for the specific layout
     * the  field "bars" is a array its represents the bars in the metsviewer on index based
     * see jquery selector ".mets-bar"
     *
     * example:
       bar: [false, true, false]

     * will hide the first and last bar in the metsviewer
     *
     *
     * SECOND DIMENSION button wrappers
     * ...........................................................................................................
     * the second level of html elements are the button wrappers see selector ".mets-button-wrapper"
     * in each bar there are wrappers for buttons those elements can be turn also off.
     * you only have to nest a new array configuration for the wrappers again on index position configuration
     *
     * example:
       bars : [false,[
        false, false, false, false, true, true
     ], false]
     * in this nested array configuration you see that we create a new array set of booleans on bar index position
     * 1 there we turn of the first four wrappers off the last two we let them to be visible
     *
     *
     * THIRD DIMENSION buttons
     * ...........................................................................................................
     * the third level of elements are the actually the buttons each button can be turned off in a set of button
     * wrappers the nesting of a button configuration is divert than before a button is defended on button name
     * and value boolean the name is based as the same of the router functionality on the icon name reverence see
     * button sample:
         <a class="mets-button" href="#" style="display: none;">
            <i class="mets-icon transcription"></i>
         </a>
     * the configuration to turn off this button looks like this {'transcription': false}
     *
     * for example below:
     views : {
                bars : [false,[
                    false, false, false, false, true, [
                        {'transcription': false},
                        {'fullscreen': true}
                    ]
                ], false]
            }
     *
     * whe define some button configuration in the sixth button index position, notice that in
     * a wrapper positions each element must be defined as a object notation.
     * In this example we turn of the "transcription" button and we let "fullscreen" button just visible
     */
    this.getLayoutViews = function(){};

    /**
     * returns the setting for showing or hiding the links (permanentLink, image)
     * @see view.PermanentLink
     * @returns {*}
     */
    this.getPermanentLinkConfig = function(){};

};