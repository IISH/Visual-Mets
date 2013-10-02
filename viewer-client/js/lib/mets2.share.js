(function($){
    /**
     * canvas is the place where the loader, page, messages, etc are
     * @field modal.header   String   the text for in the header of the modal
     * @field canvas.body    String   content for the modal body
     * @see Controller.loadTemplate
     * @see Model.template.host         the main url host domain
     */
    App.mets2.Model.extend({
        share : {
            link : {
                css : '/css/themes/default/style.css',
                js : '/js/mets2viewer.min.js'
            },
            modal : {
                header : 'Embed code',
                body : '<table cellspacing="5" style="width: 100%;">' +
'<tr>' +
'<td colspan="2">' +
    '<textarea style="width: 520px; height: 150px; font-size: 11px; line-height: 14px; color: #595959; font-family: monospace;">' +"\n"+
                '<link href="/rest/resources/{cssLink}" rel="stylesheet" type="text/css" media="all" />' +"\n"+
                '<script type="text/javascript" src="/rest/resources/{jsLink}"></script>'+"\n"+
                '<script type="text/javascript">' +"\n"+
                    "\t"+'(function($){' +"\n"+
                    "\t"+'$(document).ready(function(){' +"\n"+
                        "\t\t"+'$(\'#myMetsViewer\').mets2Viewer({' +"\n"+
                            "\t\t"+'\'initialize\' : {' +"\n"+
                            "\t\t"+'\'metsId\' : \'{metsLink}\','+"\n"+
                            "\t\t"+'\'pager\' : {'+"\n"+
                                "\t\t"+'\'start\' : 0,'+"\n"+
                                "\t\t"+'\'rows\' : -1'+"\n"+
                            "\t\t"+ '}'+"\n"+
                            "\t\t"+'}'+"\n"+
                        "\t\t"+'});'+"\n"+
                    "\t"+'});'+"\n"+
                    "\t"+'})(jQuery);'+"\n"+
                '</script>'+"\n"+
                '<div id="parent" style="width: 1000px; height: 500px;">'+"\n"+
                    "\t"+'<div id="myMetsViewer"></div>'+"\n"+
                '</div>'+"\n"+
    '</textarea>' +
'</td>' +
'</tr>' +
'</table>'
            }
        }
    });

    /**
     * get the share modal data
     * @returns {{header :*, body: *}}
     */
    App.mets2.Model.extend('getShareModalData', function(){
        return this.share.modal;
    });
    /**
     * get the share modal data
     * @returns {{css : String, js: String}}
     */
    App.mets2.Model.extend('getShareLinkData', function(){
        return this.share.link;
    });

    /**
     * the routing functionality for the "share"
     * bind click event to button create method "Share"
     *
     * function Share returns methods
     *
     * @return {{
          openModal : function
      }}
     */
    App.mets2.Controller.route('share',{
        events : {
            'click' : function(){
                this.Share().openModal();
            }
        },
        methods : {
            openModal : function(){

                var modal = this.getView().Modal();
                var data  = this.getModel().getShareModalData();
                var link  = this.getModel().getShareLinkData();

                data.body = data.body.replace(new RegExp("{cssLink}", "g"), this.getModel().getHostUrl()+link.css);
                data.body = data.body.replace(new RegExp("{jsLink}", "g"), this.getModel().getHostUrl()+link.js);
                data.body = data.body.replace(new RegExp("{metsLink}", "g"),  this.getModel().getMetsID());
                    modal
                        .setHeader(data.header)
                        .setBody(data.body)
                        .show();
                modal.getBodySelector().find('textarea').focus();
                modal.getBodySelector().find('textarea').select();
            }
        }
    });

})(jQuery);