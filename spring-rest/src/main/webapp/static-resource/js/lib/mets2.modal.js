(function($){
    /**
     * store the modal selector in the model
     * @see bootstrap css ui framework
     * @link http://twitter.github.io/bootstrap/
     * @field modal.selector     int    the modal selector
     */
    App.mets2.Model.extend({
        modal : {
            selector : '.mets-modal'
        }
    });

    /**
     * get the modal jquery selector
     * @return Array|jQuery
     */
    App.mets2.Model.extend('getModalSelector', function(){
        return this.getFrameSelector().find(this.modal.selector);
    });

    /**
     * the modal functionality
     * @returns {{
          getHeader     : function
          setHeader     : function
          getBody       : function
          getBodySelector : function
          setBody       : function
          getModal      : function
          show          : function
          close         : function
      }}
     */
    App.mets2.View.extend('Modal', function(){

        var selector = this.getModel().getModalSelector().modal();
        var _ = {
          evenets : {
              setClose : function(){
                  var elems = selector.find('.mets-close, .mets-btn-close');
                        elems.unbind('click.close');
                        elems.bind('click.close', function(){
                          selector.modal('hide');
                      });
              }
          }
        };
        var methods = {

            /**
             * give back the header text
             * @return String
             */
            getHeader : function(){
                return selector.find('h3').html();
            },

            /**
             * set the header text
             * @param value String
             * @return {View.Modal}
             */
            setHeader : function(value){
                selector.find('h3').html(value);
                return this;
            },

            /**
             * get the html of the body of the modal
             * @return String
             */
            getBody : function(){
                return selector.find('.mets-modal-body').html();
            },

            /**
             * get the body of the modal but now the jquery selector
             * @return Array|jQuery
             */
            getBodySelector : function(){
                return selector.find('.mets-modal-body');
            },

            /**
             * set text / html in to the body
             * @param value String
             * @return {View.Modal}
             */
            setBody : function(value){
                selector.find('.mets-modal-body').html(value);
                return this;
            },

            /**
             * get te modal selector
             * @return Array|jQuery
             */
            getModal : function(){
                return selector;
            },

            /**
             * show the modal
             * @return {View.Modal}
             */
            show : function(){
                selector.modal('show');
                return this;
            },
            /**
             * hide the modal
             * @return {View.Modal}
             */
            close : function(){
                selector.modal('hide');
                return this;
            }
        };

        _.evenets.setClose();
        return methods;
    });



})(jQuery);