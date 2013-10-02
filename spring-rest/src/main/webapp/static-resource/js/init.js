(function($){

    $(document).ready(function(){
        var btn = $('.save');
        btn.bind('click',function(){

/*
           $('#metsViewSample').mets2Viewer({
                debug : true,
                width: 800,
                height: 500,
                initialize : {
                    'metsId'   : $('input[name=metsId]').val(),
                    'defaults' : true,
                    'pager' : {
                        'start' : 0,
                        'rows'  : -1
                    }
                }
            });*/

      /*      var viewer = App.mets2Viewer({
                template :'http://visualmets.socialhistoryservices.org/rest/mets2.template.html?callback=?',
                target : $('#metsViewSample'),
                debug  : true
            });

            viewer.init({
                'url'      : 'http://visualmets.socialhistoryservices.org/rest/document?',
                'metsId'   : $('input[name=metsId]').val(),
                'defaults' : true,
                'pager' : {
                    'start' : 0,
                    'rows'  : -1
                }
            });*/

            scroller = new App.mets2EmbedHandler();
            scroller.scrollPage(function(iterator, selector, params){

                selector.mets2Viewer(params);
            });

            //viewer.load();


            return false;
        });
        btn.trigger('click');


        $('select[name=themes]').change(function(){
            var link = $('#theme');
            var theme = $(this).find('option:selected').val();
            link.attr({'href':'css/themes/'+theme+'/style.css?_=2.1'});
        });

    });
})(jQuery);

