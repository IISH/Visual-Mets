(function($){


    /**
     * the routing functionality for the "print"
     * bind click event to button create method "Print"
     *
     * function Print returns methods
     *
     * @return {{
          open : function
      }}
     */
    App.mets2.Controller.route('print',{
        events : {
            'click' : function(){
                this.Print().open();
            }
        },
        methods : {
            open : function(){
                window.open(this.getModel().getPDFurl(), '_blank');
            }
        }
    });



})(jQuery);