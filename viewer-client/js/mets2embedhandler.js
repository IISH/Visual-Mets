/**
 * @discription this is a prototype and still in development
 *
 * - maak dat als hij hidden is een watcher zet op de tag zodra hij visible word dan gerendert word
 * - weg laten van de width and height params capture the parent width and height
 *
 * EMBED HTML SAMPLE
 * ........................................................................................
 <object type="application/x-metsviewer">
     <param name="debug" value="true" />
     <param name="width" value="800" />
     <param name="height" value="500" />
     <object name="metsParams">
         <param name="metsId" value="http://hdl.handle.net/10622/ARCH01225.35?locatt=view:mets" />
         <param name="defaults" value="true" />
         <param name="pager.start" value="0" />
         <param name="pager.rows" value="-1" />
     </object>
 </object>


 */

(function ($) {
    NS.Package('NS.App.mets2EmbedHandler');
    App = NS.App;


    /**
     * @constructor
     * .............................................................
     */
    App.mets2EmbedHandler = function ()
    {
        this.scriptType = 'object[type=application\\/x-metsviewer]';
        this.params = {}
    };

    App.mets2EmbedHandler.method('embedExist', function(){
        return (this.getScriptEmbedding().length > 0);
    });



    App.mets2EmbedHandler.method('getScriptEmbedding', function() {
        return $(this.scriptType);
    });



    App.mets2EmbedHandler.method('getParamSelectors', function(){
        return $($UT.trim($(this.getScriptEmbedding()).html()));
    });



    App.mets2EmbedHandler.method('getEmbeddingParams', function(){
        return this.param;
    });



    App.mets2EmbedHandler.method('namespace', function(sName, value, reverence){
        //split the name by dots
        var namespaces=sName.split('.') || [sName];
        var nlen=namespaces.length;

        for(var i=0;i<nlen;i++) {
            var ns = namespaces[i];
            if(typeof(reverence[ns])==='undefined'){
                reverence = reverence[ns] = {};
            }
            else{
                reverence = reverence[ns];
            }

        }
    });


    App.mets2EmbedHandler.method('parseParams', function(selector, data){
        data = data || {};
        var nodes = $($UT.trim($(selector).html()));

        for(var i=0; i < nodes.length; i++) {
            var node = $(nodes[i]);

            if(node.children('param').length > 0 && node.attr('name') == 'metsParams'){
                data['initialize']  = {};
                data.initialize = this.parseParams(node, data.initialize);
            }else{
                //$$(node);
                var name  = node.attr('name');
                var value  = node.attr('value');
                if(name){
                    if(name.indexOf('.') === -1){
                        data[node.attr('name')] = value.convert();
                    }else{
                        var ns = name.split('.');
                        if(!data[ns[0]]){
                            data[ns[0]] = {};
                        }
                        if(!data[ns[0]][ns[1]]){
                            data[ns[0]][ns[1]] = value.convert();
                        }
                    }
                }
            }

        }
        return data;
    });




    App.mets2EmbedHandler.method('scrollPage', function(fn){
        if(this.embedExist()){

            var selectors  = this.getScriptEmbedding();
            for(var i=0; i < selectors.length; i++) {
                var selector = $(selectors[i]);
                var target = $('<div>');
                if(fn){
                    target.attr('id', 'mets2Viewer-'+(i+1));
                    // replace the script tag in to a html selector
                    selector.replaceWith(target);
                    fn(i, target, this.parseParams(selector));
                }

            }
        }
    });

})(jQuery);