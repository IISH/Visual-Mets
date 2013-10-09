(function($){
    /**
     * arguments that can be used to get data
     * @option metsId       String    the key url of the file
     * @option defaults     Boolean   TODO (defaults nog uit te zoeken)
     *
     * @option scale        Object    scale properties
     * @option scale.width  int       the width to scale to
     * @option scale.height int       the height to scale to
     * @option scale.pageId int       the id of the page
     *
     * @option pager        Object    pager properties
     * @option pager.start  int       start position (index)
     * @option pager.start  rows      te amound of rows
     *
     * ..........................................................................................
     * Sample code request:
     * viewer.request('http://visualmets.socialhistoryservices.org/mets2/rest/document?', {
            'metsId'      : 'http://disseminate.objectrepository.org/mets/10622/ARCH01225.70',
            'defaults'    : true,
            'scale' : {
                width : 800,
                height : 525,
                pageId : 10
            },
            'pager' : {
               'start' : 2,
               'rows' : 1
            }
        });
     * ........................................................................................ */



    /**
     * Controller.request
     * @param url       String  the url
     * @param args      Object  the request arguments
     * @param options   jquery options
     *
     * @option options.type     String      the type request POST or GET    (default) GET
     * @option options.timeout  int         the timeout for the request     (default) 30000 seconds
     * @option options.dataType String      the type of data request        (default) jsonp
     * @return void
     *
     * functionality has events
     * @event onBeforeSend      will be fired before the request is finished
     * @event onUpdated         will be fired after the model is updated after the request is finished
     * @event onSuccess         will be fired after the model is updated and the request is validated on status 200
     *
     *
     */
    App.mets2.Controller.extend('request', function(args, options){
        var self= this;
        options = options || {};

        if(this.isDebugActive()){
            console.info("URL:   %c"+this.getModel().getUrl(), "color:#0247ae; font-weight: 800;");
            console.info("QUERY: %c"+this.parseQuery(args)+self.getModel().getCanvasScaleQueryParam(), "color:#0247ae; font-weight: 800;");
        }

        $.ajax({
            type: options.type  || "GET",
            url: this.getModel().getUrl(),
            data: this.parseQuery(args)+self.getModel().getCanvasScaleQueryParam(),
            beforeSend : function(){

                self.event.fire('onBeforeSend');
            },
            success: function(data){
                try{
                    self.event.fire('onLoad');
                    self.getModel().setDocument(data.document);
                    if(self.isDebugActive()){
                        console.info("MODEL:  ", self.getModel());
                    }
                    self.event.fire('onUpdated');


                    if(data.document.code != "200"){
                        self.event.fire('onServerUserError', data.document.code);
                        self.event.fire('onError');
                    }else{
                        self.event.fire('onSuccess');
                    }
                }catch(err){
                    if(self.isDebugActive()){
                        self.event.fire('onDocumentException', arguments);
                        var error = "SCRIPT ERROR: ";
                        for(var i in err){
                            if(err.hasOwnProperty(i)){

                                if(i == 'lineNumber'){
                                    error +=' %oline: '+err[i];
                                }else if(i=='columnNumber'){
                                    error +=', column: '+err[i];
                                }else{
                                    error +='file: '+err[i];
                                }

                            }
                        }
                        console.error(error, err);
                    }
                }

            },
            timeout: options.timeout || 30000,
            error: function(jqXHR, textStatus, errorThrown) {
                self.event.fire('onServerError', arguments);
                self.event.fire('onError');
            },
            dataType: options.dataType || "jsonp"
        });
    });



    /**
     * Controller.parseQuery
     * parse the properties to a valid query string
     * @param args Object
     * @return String
     */
    App.mets2.Controller.extend('parseQuery', function(args){
        var output = '';
        var c=0;
        var value = '';
        for(var i in args){
            if(args.hasOwnProperty(i)){
                var amp = ((c==0)?'':'&');
                if(typeof(args[i]) !== "object"){
                    value = args[i];
                    output += amp+i+'='+value;
                }else if(typeof(args[i]) === "object"){
                    var a=0;
                    if(a==0){
                        output += amp+i+'=true';
                    }
                    for(var d in args[i]){
                        if(args[i].hasOwnProperty(d)){
                            value = args[i][d];
                            output += amp+i+'.'+d+'='+value;
                        }
                    }
                    a++;
                }
            }
            c++;
        }

        return output;
    });



})(jQuery);