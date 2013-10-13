(function($){

    /**
     * store the template clone html and the url to get the template
     * @vield url  String
     * @vield selector  Array   jquery selector
     */
    App.mets2.Model.extend({
        template : {
            host : 'http://node-143.dev.socialhistoryservices.org',
            url : '',
            selector : []
        }
    });

    /**
     * map the parameter "template" template to model.template.url
     * @option template
     */
    App.mets2.Model.map([
        {
            'template'  : {
                'url' : 'template'
            },
            'default' : 'http://node-143.dev.socialhistoryservices.org/rest/mets2.template.html?callback=?'
        }
    ]);

    /**
     * get the host url fore the js, css and html template file directories
     * @return String url
     */
    App.mets2.Model.extend('getHostUrl', function(){
        return this.template.host;
    });

    /**
     * get the template url
     * @return String
     */
    App.mets2.Model.extend('getTemplateUrl', function(){
        return this.template.url;
    });

    /**
     * get the template selector from the model
     * @return Array|jQuery
     */
    App.mets2.Model.extend('getTemplateSelector', function(){
        return this.template.selector;
    });

    /**
     * add the global storage template to the model by a clone action
     * @return void
     */
    App.mets2.Model.extend('addTemplateSelector', function(){

        this.template.selector = App.mets2.template.clone();
    });


    /**
     * is the global store point of the template empty
     * @return boolean
     */
    App.mets2.Model.extend('isTemplateEmpty', function(){
        return (NS.UT.Tools.isEmpty(App.mets2.template));
    });

    /**
     * load the template and if the url is empty than look in to the dom for the template
     * if teh template is already loaded than load it from the global storage point
     * @see App.mets2.template
     * @return void
     */
    App.mets2.Controller.extend('loadTemplate', function(){

        var self = this;
        var model = self.getModel();

        if(this.isDebugActive() && model.getFrameSelector().length == 0){
            console.warn('WARNING the jquery selector is missing: %o', model.getFrameSelector().selector );
        }

        // if the url is empty do not get template but look in toe dom
        if(NS.UT.Tools.isEmpty(model.getTemplateUrl())){
            self.event.fire('templateReady');
        }else{
            if(model.isTemplateEmpty()){

                if(this.isDebugActive()){
                    console.info("TEMPLATE: %c"+model.getTemplateUrl(), "color:#0247ae; font-weight: 800;");
                }
                // start ajax call
                $.ajax({
                    type: "GET",
                    url: model.getTemplateUrl(),
                    data: {},
                    beforeSend : function(){

                    },
                    success: function(data){

                        if(data.template && !NS.UT.Tools.isEmpty(data.template)){
                            // store
                            App.mets2.template = $(data.template);

                            model.addTemplateSelector();
                        }else{
                            // template can not be loaded!..
                        }
                        // add the template to the dom
                        model.getFrameSelector().empty();
                        model.getTemplateSelector().appendTo(model.getFrameSelector());
                        self.event.fire('templateReady');

                    },

                    error: function(jqXHR, textStatus, errorThrown) {
                        $$(arguments);
                    },
                    dataType: "jsonp"
                });
            }else{

                if(this.isDebugActive()){
                    console.info("TEMPLATE: %c is loaded", "color:#0247ae; font-weight: 800;");
                }


                model.addTemplateSelector();
                model.getFrameSelector().empty();
                // add the template to the dom
                model.getTemplateSelector().appendTo(model.getFrameSelector());

                self.event.fire('templateReady');
            }
        }

    });



})(jQuery);