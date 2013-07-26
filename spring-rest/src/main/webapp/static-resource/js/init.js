(function($){

    $(document).ready(function(){
        var btn = $('.save');
        btn.bind('click',function(){


            $('#metsViewSample').mets2Viewer({
                'debug' : true,
                initialize : {
                    'metsId'   : $('input[name=metsId]').val(),
                    'defaults' : true,
                    'pager' : {
                        'start' : 0,
                        'rows'  : -1
                    }
                }
            });


            return false;
        });
        btn.trigger('click');

    });
})(jQuery);

