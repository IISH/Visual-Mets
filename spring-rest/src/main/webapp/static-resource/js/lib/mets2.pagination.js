(function($){

    /**
     * @vield pagination.steps   int       the steps to jump
     * @vield pagination.pos     int       current position
     * @vield pagination.length  int       total amount of pages
     */
    App.mets2.Model.extend({
        pagination : {
            steps  : 1,
            pos    : 0,
            length : 0
        }
    });


    /**
     * store the amount of steps
     * @return void
     */
    App.mets2.Model.extend('setPaginationSteps', function(steps){
       this.pagination.steps = steps;
    });

    /**
     * get the amount of steps
     * @return steps int
     */
    App.mets2.Model.extend('getPaginationSteps', function(){
        return this.pagination.steps;
    });

    /**
     * store the pagination length (based on the Page object storage)
     * @return void
     */
    App.mets2.Model.extend('setPaginationLength', function(length){
        this.pagination.length = length;
    });


    App.mets2.Model.extend('getPaginationLength', function(){
        return this.pagination.length;
    });


    /**
     * get current page number position
     * @return int
     */
    App.mets2.Model.extend('getPaginationPosition', function(){
        return this.pagination.pos;
    });


    /**
     * set current page number position
     * @return int
     */
    App.mets2.Model.extend('setPaginationPosition', function(pos){
        if(this.hasDocumentPages()){
            this.getDocumentPager().start = pos;
        }
        this.pagination.pos = pos;
    });

    /**
     * the routing functionality for the "next"
     * bind click event to button create method "Next"
     *
     * function Next returns methods
     *
     * @return {{
          goNext             : function,
          removeDisableClass : function,
          removeDisableClass : function
      }}
     */
    App.mets2.Controller.route('next',{
        events : {
            'click' : function(){
                var model   = this.getModel();
                var steps   = model.getPaginationSteps();
                var current = model.getPaginationPosition()+steps;
                var length  = model.getPaginationLength();

                // styling only by button press...
                if(current < length){
                    // go next
                    this.goNext();
                }

            }
        },
        methods : {
            /**
             * get the next page by current position
             */
            goNext : function(){

                var model   = this.getModel();
                var current = model.getPaginationPosition();
                var length   = model.getPaginationLength();
                var params  = model.getParam();

                if(current < length){

                    params.pager.start = (current+model.getPaginationSteps());
                    model.setPaginationPosition( params.pager.start);

                    this.event.fire('onUpdated');
                    this.event.fire('onSuccess');
                }
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
     * the routing functionality for the "previous"
     * bind click event to button create method "Previous"
     *
     * function Previous returns methods
     *
     * @return {{
          goPrev             : function,
          removeDisableClass : function,
          removeDisableClass : function
      }}
     */
    App.mets2.Controller.route('previous',{
        events : {
            'click' : function(){


                var model   = this.getModel();
                var steps   = model.getPaginationSteps();
                var current = model.getPaginationPosition();

                // styling only by button press...
                if(current >= steps){
                    // go next
                    this.goPrev();

                }

            }
        },
        methods : {
            /**
             * get the next page by current position
             */
            goPrev : function(){

                var model   = this.getModel();
                var current = model.getPaginationPosition();
                var steps = model.getPaginationSteps();

                var params  = model.getParam();

                if(current >= steps){
                    params.pager.start = current -steps;
                    model.setPaginationPosition( params.pager.start);
                    this.event.fire('onUpdated');
                    this.event.fire('onSuccess');
                }
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
     * the routing functionality for the "lastpage"
     * bind click event to button create method "Lastpage"
     *
     * function Lastpage returns methods
     *
     * @return {{
          goToLastPage       : function,
          removeDisableClass : function,
          removeDisableClass : function
      }}
     */
    App.mets2.Controller.route('lastpage',{
        events : {
            'click' : function(){

                this.goToLastPage();

            }
        },
        methods : {

            goToLastPage : function(){
                var model   = this.getModel();
                var params  = model.getParam();
                var steps   = model.getPaginationSteps();

                if((model.getPaginationLength()-steps) !== model.getPaginationPosition()){

                    params.pager.start = (model.getPaginationLength()-steps);

                    model.setPaginationPosition( params.pager.start);
                    this.event.fire('onUpdated');
                    this.event.fire('onSuccess');
                }

            },
            getLastPosition : function(){

                var model   = this.getModel();
                var length = model.getPaginationLength();
                var steps  = model.getPaginationSteps();
                var rest = (length/steps);

                rest = rest-Math.floor(rest);

                var restPages = rest*steps;
                return length-restPages;
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
     * the routing functionality for the "firstpage"
     * bind click event to button create method "Firstpage"
     *
     * function Firstpage returns methods
     *
     * @return {{
          goToFirstPage      : function,
          removeDisableClass : function,
          removeDisableClass : function
      }}
     */
    App.mets2.Controller.route('firstpage',{
        events : {
            'click' : function(){

                this.goToFirstPage();
            }
        },
        methods : {

            goToFirstPage : function(){

                var model   = this.getModel();
                var params  = model.getParam();
                var pos     = model.getPaginationPosition();
                if(pos !== 0){
                    params.pager.start = 0;
                    model.setPaginationPosition( params.pager.start);
                    this.event.fire('onUpdated');
                    this.event.fire('onSuccess');

                }

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
     * manage the disable and enable style of the pagination buttons
     * @see Controller.load
     * @void
     */
    App.mets2.Controller.extend('paginationButtonManager', function(){

        var model = this.getModel();
        var pos   = model.getPaginationPosition();
        var steps = model.getPaginationSteps();
        var length= model.getPaginationLength();

        // the end...........................
        if((length-steps) == pos)
        {
            this.Lastpage().addDisableClass();
            this.Firstpage().removeDisableClass();
            this.Next().addDisableClass();
            this.Previous().removeDisableClass();
        }
        // the start.........................
        else if(pos == 0)
        {
            this.Lastpage().removeDisableClass();
            this.Firstpage().addDisableClass();
            this.Next().removeDisableClass();
            this.Previous().addDisableClass();
        }
        // the in between....................
        else
        {
            this.Lastpage().removeDisableClass();
            this.Firstpage().removeDisableClass();
            this.Next().removeDisableClass();
            this.Previous().removeDisableClass();
        }

    });

    /**
     * show the 'pagination execute on events "onSuccess"
     * @see Controller.init
     * @return void
     */
    App.mets2.View.extend('paginationOverview', function(){

        var model   = this.model;
        var label   = model.getFrameSelector().find('.pagination-label');
        var steps   = model.getPaginationSteps();
        var pos     = model.getPaginationPosition();
        var length  = model.getPaginationLength();

        var current = (pos % length)/steps;


        label.html(Math.ceil(current+1)+" / "+Math.ceil(length/steps));
    });
})(jQuery);