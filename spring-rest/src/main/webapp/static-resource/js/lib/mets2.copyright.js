(function($){

    /**
     * the routing functionality for the "copyright"
     * bind click event to button create method "Copyright"
     *
     * function Copyright returns methods
     *
     * @return {{
          openModal : function
      }}
     */
    App.mets2.Controller.route('copyright',{
        events : {
            'click' : function(){
                this.Copyright().openModal();
            }
        },
        methods : {
            openModal : function(){

                var modal = this.getView().Modal();
                var data  = this.getLabelObject('copyright.modal');

                    modal
                        .setHeader(data.header)
                        .setBody(data.body)
                        .show();
            }
        }
    });



})(jQuery);