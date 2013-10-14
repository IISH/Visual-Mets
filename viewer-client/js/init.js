(function($){

    /**
     * TODO breadgrumb:
     * elipse breadgrumb reken de width van de scgherm en de margen s en pediing een vervolgens de breete
     * item verhouding is breete (elipse) wordt bepaald door de lengthe + margens + paddings gedeelt door de aantal itens
     * lengthe = (window.width - margen + paddings) / count of items breadgrumb
     *
     * --------------------------------------------------------------------------------
     * TODO empresent fix in thumbnail:
     */
    $(document).ready(function(){
        var btn = $('.save');
        btn.bind('click',function(){

           $('#metsViewSample').mets2Viewer({
                debug : true,
                initialize : {
                    'metsId'   : $('input[name=metsId]').val(),
                    'defaults' : true,
                    'pager' : {
                        'start' : 0,
                        'rows'  : -1
                    }
                }
            });

      /*      var viewer = App.mets2Viewer({
                template :'http://visualmets.socialhistory.org/template/template.handler.php?callback=?',
                target : $('#metsViewSample'),
                debug  : true
            });

            viewer.init({
                'url'      : 'http://visualmets.socialhistory.org/rest/document?',
                'metsId'   : $('input[name=metsId]').val(),
                'defaults' : true,
                'pager' : {
                    'start' : 0,
                    'rows'  : -1
                }
            });*/
            //viewer.load();

/*
            scroller = new App.mets2EmbedHandler();
            scroller.scrollPage(function(iterator, selector, params){

                selector.mets2Viewer(params);
            });*/



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

