(function($){
    /**
     * frame target
     * @field frame.selector    array       the jquery selector see option.target
     * @field frame.height      int         the stored height
     * @field frame.width       int         the stored width
     */
    App.mets2.Model.extend({
        frame : {
            selector : [],
            height   : 0,
            width    : 0
        },
        button  : {}   // the button selector storage point
    });

    /**
     * configure options
     * set the option.target to the field Model.frame
     * @option option.target    jquery selector, default array empty
     * @option option.height    the height of the frame default "auto"
     * @option option.width    the height of the frame default "auto"
     */
    App.mets2.Model.map([
        {
            'frame'  : {
                'selector' : 'target'
            },
            'default' : []
        },{
            'frame'  : {
                'height' : 'height'
            },
            'default' : 'auto'
        },{
            'frame'  : {
                width : 'width'
            },
            'default' : 'auto'
        }
    ]);

    /**
     * get the buttons object stored in the model
     * @return {*}
     */
    App.mets2.Model.extend('getButtons', function(){
        return this.button;
    });



    /**
     * get the frame jquery selector
     * @return Array|jQuery
     */
    App.mets2.Model.extend('getFrameSelector', function(){
        return this.frame.selector;
    });

    /**
     * get the width and height of the frame
     * @returns {{width: *, height: *}}
     */
    App.mets2.Model.extend('getFrameSize', function(){
        return {
            width   : this.getFrameSelector().width(),
            height  : this.getFrameSelector().height()
        }
    });



    /**
     * get the frame size but this one the options
     * @returns {{width :int, height: int}}
     */
    App.mets2.Model.extend('getFrameOptionSize', function(){
        return {
            width   : this.frame.width,
            height  : this.frame.height
        };
    });



    /**
     * get a button selector on name reverence
     * @return {*|jQuery}
     */
    App.mets2.Model.extend('getButtonByName', function(name){
        var output = [];
        if(this.button[name]){
            output = this.button[name];
        }
        return output;
    });


    /**
     * this is functionality is manages the frame behaviour
     * @return {{
          updateCanvasSize  : function,
          getSelector       : function,
          getParentSelector : function,
          setAbsolute       : function,
          setRelative       : function,
          release           : function,
          render            :  function,
          getSize           : function,
          setSize           : function
      }}
     */
    App.mets2.View.extend('Frame', function(){

        var self = this;
        var model = self.getModel();
        var frame = model.getFrameSelector();
        var canvas = self.Canvas();
        var toolbars = frame.find('.mets-toolbar, .mets-message');
        var bars     = frame.find('.mets-bar');

        var _ = {
            /**
             * render the css class "mets-align-center" placed on the wrapper elements
             */
            renderAlignment : function(){

                // find elements and store them in to rows
                var others = []; // targets
                var rows = [];   // store before found
                for(var i=0; i < bars.length; i++){
                    var wraps = $(bars[i]).find('.mets-button-wrapper');
                    var selectors = [];
                    var fount     = false;
                    rows.push([]);
                    others.push([]);

                    for(var w=0; w < wraps.length; w++){
                        var elem = $(wraps[w]);

                        if(elem.hasClass('mets-align-center')){
                            fount = true;
                            rows[i].push(elem);
                        }
                        // searching elements before

                        if(!fount && elem.is(':visible')){
                            others[i].push(elem);
                        }
                    }
                }

                // render margen left
                for(var r=0; r < rows.length; r++){

                    var elemWidth = 0;
                    var firstElem = rows[r][0];
                    for(var c=0; c < rows[r].length; c++){
                        // bug fix remove boolean form "outerWidth"
                        elemWidth  += rows[r][c].outerWidth();

                        // check near end
                        if(rows[r].length-1 == c){
                            var otherWidth = 0;
                            for(var o=0; o < others[r].length; o++){
                                otherWidth += others[r][o].outerWidth(true);
                            }
                            // set center
                            var width = method.getSize().width;

                            var margin = Math.round(((width/2)-((elemWidth/2))-otherWidth));
                            if(margin > 0){
                                firstElem.css('margin-left', margin+'px');
                            }
                        }
                    }
                }
            },
            setOptionHeight : function(){

            }
        };

        var method = {
            /**
             * notice ! call this method before rendering the frame
             */
            release : function(){
                var aligns = frame.find('.mets-align-center');
                for(var c=0; c < aligns.length; c++){
                    aligns.css('margin-left', 'auto');
                }
            },
            updateCanvasSize : function(){
                var toolbarHeights = 0;
                // correct height...
                for(var i=0; i < toolbars.length; i++){
                    var toolbar = $(toolbars[i]);
                    if(toolbar.is(':visible')){
                        toolbarHeights += toolbar.outerHeight();
                    }
                }
                // update
                canvas.setSize({
                    height : frame.height()-toolbarHeights,
                    width  : frame.width()
                });
            },

            /**
             * get the current size of the dom element , selector frame
             * @returns {{height: *, width: *}}
             */
            getSize : function(){
                return {
                    height : frame.height(),
                    width  : frame.width()
                }
            },
            getSelector : function(){
               return frame;
            },
            getParentSelector : function(){
                return frame.parent();
            },
            /**
             * set options sit eif the are available
             * if default not set to "auto"
             * @return void
             */
            setOptionSize : function(){
                var size = model.getFrameOptionSize();

                if(size.height != 'auto'){
                    this.setSize({'height':size.height});
                }
                if(size.width != 'auto'){
                    this.setSize({'width':size.width});
                }
            },
            /**
             *
             * @param opt {{height: *, width: *}}
             */
            setSize : function(opt){
                if(opt.width){
                    frame.width(opt.width);
                }
                if(opt.height){
                    frame.height(opt.height);
                }
                this.updateCanvasSize();
            },
            /**
             * set frame to absolute position
             * @return void
             */
            setAbsolute : function(){

                var props = {
                    'position' : 'absolute',
                    'left'     : 0,
                    'top'    : 0,
                    'z-index'  : 10000
                };
                frame.css(props);
            },

            /**
             * set frame back to relative position
             * @return void
             */
            setRelative : function(){

                var props = {
                    'position' : 'relative',
                    'left'     : 'auto',
                    'top'      : 'auto',
                    'z-index'  : 'auto'
                };
                frame.css(props);

            },
            render : function(){

                // update canvas
                this.updateCanvasSize();
                _.renderAlignment();
            }

        };
        return method;
    });


})(jQuery);
