(function($){
    /**
     * frame target
     * @field breadcrumb.length    int          the max length of the breadcrumb
     * @field breadcrumb.suffix    String       ellipsis suffix post fix
     */
    App.mets2.Model.extend({
        breadcrumb : {
            length : 100,
            suffix : '...'
        }
    });

    App.mets2.Model.map([
        {
            'breadcrumb'  : {
                'length' : 'ellipsis'
            },
            'default' : 100
        },{
            'breadcrumb'  : {
                'suffix' : 'ellipsisSuffix'
            },
            'default' : '...'
        }
    ]);

    /**
     * get the max length of a breadcrumb string length to trigger the ellipsis
     * @return int length
     */
    App.mets2.Model.extend('getEllipsisLength', function(){
        return this.breadcrumb.length;
    });



    /**
     * get the ellipsis suffix default "..."
     * @return String suffix
     */
    App.mets2.Model.extend('getEllipsisSuffix', function(){
        return this.breadcrumb.suffix;
    });


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
        var items = [];
        var totalLength = 0;
        for(var i=0; i < breadcrumb.length; i++) {

            var a = $('<a>');
            var li = $('<li>');
            var I = $('<i>');

            if(i > 0){
                I.addClass('mets-arrow')
                    .appendTo(li);
            }

            a.attr({
                'href'           :((breadcrumbUrl[i])?breadcrumbUrl[i]:'#'),
                'target'         : '_blank',
                'title'          : breadcrumb[i]
            })
             .html(breadcrumb[i])
             .appendTo(li);
            li.appendTo(ul);
            // store
            items.push(a);
            totalLength = totalLength +a.text().length;
            // set function...
            a.ellipsistip({
                length : this.model.getEllipsisLength(),
                suffix : this.model.getEllipsisSuffix()
            });
        }


    });

})(jQuery);