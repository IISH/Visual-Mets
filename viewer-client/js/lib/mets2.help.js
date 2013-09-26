(function($){

    /**
     * the routing functionality for the "copyright"
     * bind click event to button
     *
     * function next returns methods

     * @return
     */
    App.mets2.Controller.route('help',{
        events : {
            'click' : function(){
                this.Help().openModal();
            }
        },
        methods : {
            openModal : function(){

                var modal = this.getView().Modal();
                var data  = this.getLabelObject('help.modal');

                modal
                    .setHeader(data.header)
                    .setBody(data.body)
                    .show();
            }
        }
    });



})(jQuery);