(function($){

    /**
     * @field permanentLink.imageLinkSelector           String   form for an jquery selector on id image link
     * @field permanentLink.descriptionLinkSelector     String   form for an jquery selector on id description link
     */
    App.mets2.Model.extend({
        permanentLink : {
            imageLinkSelector       : '#mets-image-link',
            descriptionLinkSelector : '#mets-description-link'
        }
    });



    /**
     * check if the mets id is empty or not
     * @return boolean
     */
    App.mets2.Model.extend('isMetsIdEmpty', function(){
        return ($UT.isEmpty(this.getMetsID()));
    });

    /**
     * get mets id selector with label and text html
     * @return Array|jQuery
     */
    App.mets2.Model.extend('getPermanentImageLinkSelector', function(){
        return this.getFrameSelector().find(this.permanentLink.imageLinkSelector);
    });

    /**
     * get description id selector with label and text html
     * @return Array|jQuery
     */
    App.mets2.Model.extend('getPermanentDescriptionLinkSelector', function(){
        return this.getFrameSelector().find(this.permanentLink.descriptionLinkSelector);
    });


    /**
     * functionality makes it possible to set a link with copy function
     * @see Controller.init
     * @return {{
          getMetsID           : function,
          isMetsIdEmpty       : function,
          isDescriptionEmpty  : function,
          show                : function
       }}
     */
    App.mets2.View.extend('PermanentLink', function(config){

        var model           = this.getModel();
        var imageLink        = model.getPermanentImageLinkSelector();
        var descriptionLink = model.getPermanentDescriptionLinkSelector();

        return {
            getMetsID : function(){
                return model.getMetsID();
            },

            isMetsIdEmpty : function(){
                return model.isMetsIdEmpty();
            },

            show : function(){
                if(imageLink.length > 0 && config.image){

                    imageLink.find('span').html(model.getCurrentLayoutPage().getUrl());
                    imageLink.fadeIn(300);


                }
                if(descriptionLink.length > 0 && !this.isMetsIdEmpty() && config.description){

                    descriptionLink.find('span').html(this.getMetsID().replace(new RegExp("\\?.*$"),''));
                    descriptionLink.fadeIn(300);

                }
                if(!config.description){
                    descriptionLink.hide();
                }
                if(!config.image){
                    imageLink.hide();
                }
            }
        };
    });


})(jQuery);
