(function($){

    /**
     * get the breadcrumb data
     * @return Array
     */
    App.mets2.Model.extend('getBreadcrumb', function(){
        var breadcrumb = [];
        if(this.hasDocumentPages()){
            if(this.getDocument()['breadcrumb']){
                breadcrumb = this.getDocument().breadcrumb;
            }else{
                if(this.isDebugActive()){
                    console.warn("WARING: breadcrumb is missing in [model.Document] ", this.getDocument());
                }
            }
        }
        return breadcrumb;
    });


    /**
     * get the breadcrumb url data
     * @return Array
     */
    App.mets2.Model.extend('getBreadcrumbUrl', function(){
        var breadcrumbUrls = [];
        if(this.hasDocumentPages()){
            if(this.getDocument()['breadcrumbUrls']){
                breadcrumbUrls = this.getDocument().breadcrumbUrls;
            }else{
                if(this.isDebugActive()){
                    console.warn("WARING: breadcrumbUrls is missing in [model.Document] ", this.getDocument());
                }
            }
        }
        return breadcrumbUrls;
    });




    /**
     * building the breadcrumb in to the view
     * execute on events "onSuccess"
     * @see Controller.init
     * @return void
     */
    App.mets2.View.extend('addBreadcrumb', function(){

        var ul          = this.getModel().getFrameSelector().find('ul.mets-breadgrumb');
        var breadcrumb  = this.getModel().getBreadcrumb();
        var breadcrumbUrl  = this.getModel().getBreadcrumbUrl();

        ul.empty();
        for(var i=0; i < breadcrumb.length; i++) {

            var a = $('<a>');
            var li = $('<li>');
            var I = $('<i>');

            if(i > 0){
                I.addClass('mets-arrow')
                    .appendTo(li);
            }

            a.attr({
                'href':((breadcrumbUrl[i])?breadcrumbUrl[i]:'#'),
                'target' : '_blank'
            })
             .html(breadcrumb[i])
             .appendTo(li);

            li.appendTo(ul);
        }
    });

})(jQuery);