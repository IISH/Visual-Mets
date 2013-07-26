(function($){

    /**
     * add field set to the model for rotate functionality
     * @field textView.active boolean           de angle of the rotation
     * @field textView.status boolean           if the functionality is enabled or disabled
     * @field textView.transcription String     the transcription text storage point
     */
    App.mets2.Model.extend({
        textView : {
            active          : false,
            status          : false,
            transcription   : ''
        }
    });

    /**
     * whether the TextViewer is enabled or not
     * @return boolean
     */
    App.mets2.Model.extend('isTextViewEnabled', function(){
        return this.textView.status;
    });

    /**
     * whether the TextViewer is activated or not by button event click
     * @return boolean
     */
    App.mets2.Model.extend('isTextViewActive', function(){
        return this.textView.active;
    });

    /**
     * set the status boolean for active
     * @return void
     */
    App.mets2.Model.extend('setTextViewActive', function(active){
        this.textView.active = active;
    });

    /**
     * enable the TextView set field status on true
     * @return void
     */
    App.mets2.Model.extend('enableTextView', function(){
        this.textView.status = true;
    });

    /**
     * disabled the TextView set field status on false
     * @return void
     */
    App.mets2.Model.extend('disableTextView', function(){
        this.textView.status = false;
    });

    /**
     * get the text inc html
     * @return String
     */
    App.mets2.Model.extend('getTranscription', function(){
        return this.textView.transcription;
    });

    /**
     * update the model store text
     * @param text String
     * @return String
     */
    App.mets2.Model.extend('setTranscription', function(text){
        return this.textView.transcription = text;
    });

    /**
     * is the transcription empty or not
     * @return boolean
     */
    App.mets2.Model.extend('isTranscriptionEmpty', function(){
        return $UT.isEmpty(this.textView.transcription);
    });





    /**
     * the routing functionality for the "transcription"
     * bind click event to button create method "Transcription"
     *
     * function Transcription returns methods
     *
     * @return {{
          buttonFocus        : function,
          buttonBlur         : function,
          removeDisableClass : function,
          addDisableClass    : function
      }}
     */
    App.mets2.Controller.route('transcription',{
        events : {
            'click' : function(){
                if(this.model.isTextViewEnabled()){
                    var active = this.model.isTextViewActive();
                    var textView = this.getView().TextView();
                    // toggle boolean
                    this.model.setTextViewActive(((active)?false:true));
                    // toggle button..
                    if(this.model.isTextViewActive()){
                        this.buttonFocus();
                        textView.show();
                    }else{
                        this.buttonBlur();
                        textView.hide();
                    }
                }
            }
        },
        methods : {
            buttonFocus : function(){

                this.btn.addClass('mets-button-focus');
            },
            buttonBlur : function(){
                this.btn.removeClass('mets-button-focus');
            },
            removeDisableClass : function(){
                this.btn.removeClass('mets-button-disable');
            },
            addDisableClass : function(){
                this.btn.addClass('mets-button-disable');
            }
        }
    });


    /**
     * the request handler for loading the text remotely
     * @see Controller.init
     *
     * @event onTranscriptionReady           will be fired when the transcription is successfully loaded
     * @event beforeTranscriptionLoaded      will be fired before the transcription is loaded
     * @event onTranscriptionError           will be fired when the request returns error

    */
    App.mets2.Controller.extend('loadTextView', function(){

        var self    = this;
        var model   = self.getModel();

        self.Transcription().addDisableClass();

        $.ajax({
            type: 'GET',
            url: model.getTranscriptionUrl(),
            beforeSend : function(){
                self.event.fire('beforeTranscriptionLoaded');
            },
            success: function(data){
                try{
                    model.setTranscription(data.transcription);

                    self.event.fire('onTranscriptionReady');

                    // check if empty text
                    if(!model.isTranscriptionEmpty()){
                        self.Transcription().removeDisableClass();
                        model.enableTextView();
                    }else{
                        self.Transcription().addDisableClass();
                    }

                }catch(e){
                    if(self.isDebugActive()){
                        console.warn("WARNING: transcription object is missing ", data);
                    }
                }
            },
            timeout: 30000,
            error: function(jqXHR, textStatus, errorThrown) {
                if(self.isDebugActive()){
                    console.error(errorThrown+ "status ("+textStatus+")");
                }
                self.event.fire('onTranscriptionError');
            },
            dataType: "jsonp"
        });
    });




    /**
     *
     * this functionality is responsible for rendering and managing the the transcription functionality
     * @see Controller.init
     * returns methods
     * @return {{
          update      : function,
          getSelector : function,
          getImage    : function,
          show  : function,
          hide  : function,
          hide  : function,
          resize: function
      }}
     *
     */
    App.mets2.View.extend('TextView', function(){

        var self    = this;
        var model   = self.getModel(),
            page           = model.getCurrentLayoutPage(),
            canvas         = self.Canvas();

        if(page){
            var img   = page.getImage(),
                canvasSize = canvas.getSize(),
                textView  = canvas.getCanvas().find('.mets-text');
        }
        return {
            /**
             * update the layout with the actually transcription
             * @return {{TextView: Object}}
             */
            update : function(){
                textView.html(model.getTranscription());
                return this;
            },
            /**
             * get the selector ".mets-text"
             * @returns array
             */
            getSelector : function(){
                return textView;
            },
            /**
             * show the textView
             * @return {{TextView: Object}}
             */
            show : function(){
                this.resize();
                textView.fadeIn(400);
                return this;
            },
            /**
             * hide the textView
             * @return {{TextView: Object}}
             */
            hide : function(){
                img.css({'margin':'15px auto'});
                textView.hide();
                return this;
            },

            /**
             * resize the text view based on portrait of landscape layout
             * @see Controller.init
             * @return {{TextView: Object}}
             */
            resize : function(){

                var thirdPart  = 0,
                    height     = 0,
                    margin     = 0,
                    maxHeight  = 0;

                    if(page.isPortrait())
                    {
                        textView.removeClass('mets-text-horizontal').addClass('mets-text-vertical');

                        if(model.isTextViewActive()){
                            img.css({'margin-left':'15px'});
                        }

                        // render width:
                        margin = parseInt(textView.css('top').replace(new RegExp('px'),''));
                        thirdPart = Math.round(canvasSize.width/3);
                        // set
                        textView.width(thirdPart);

                        // render height:
                        maxHeight = canvasSize.height-((margin*2)+textView.innerHeight()-textView.height());
                        height = Math.round((textView.height() < maxHeight)?textView.height():maxHeight);

                        // set
                        if(textView.height() <= maxHeight){
                            textView.css('height', 'auto');
                        }else{
                            textView.height(height);
                        }
                    }
                    else
                    {
                        textView.removeClass('mets-text-vertical').addClass('mets-text-horizontal');
                        img.css({'margin':'15px auto'});

                        // render width:
                        margin = parseInt(textView.css('left').replace(new RegExp('px'),''));
                        // set
                        textView.width(Math.round(canvasSize.width -((margin*2)+(textView.innerWidth()-textView.width()))));

                        // render height:
                        maxHeight = canvasSize.height/3;
                        height = Math.round((textView.height() < maxHeight)?textView.height():maxHeight);
                        // set
                        textView.height(height);
                    }
                return this;
            }

        };
    });

})(jQuery);