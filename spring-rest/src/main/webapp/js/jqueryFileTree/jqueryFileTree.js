// Defaults
if( !o ) var o = {};
if( o.root == undefined ) o.root = '0';
if( o.folderEvent == undefined ) o.folderEvent = 'click';
if( o.expandSpeed == undefined ) o.expandSpeed= 500;
if( o.collapseSpeed == undefined ) o.collapseSpeed= 500;
if( o.expandEasing == undefined ) o.expandEasing = null;
if( o.collapseEasing == undefined ) o.collapseEasing = null;
if( o.multiFolder == undefined ) o.multiFolder = true;
if( o.loadMessage == undefined ) o.loadMessage = 'Loading...';

if ( typeof(vm_ead_namespace) == "undefined" ) var vm_ead_namespace;
vm_ead_namespace = checkVariableString2(vm_ead_namespace, "1");

function checkVariableString2(field, defaultValue) {
    if ( typeof(field) == "undefined" ) {
       var field = defaultValue;
   } else if ( field == null ) {
       field = defaultValue;
    }
   return field;
}

function getJsonData(folder, callback){
    // ToDo GCU
    $.ajax({
        async: false,
        type: "GET",
        url: vm_proxy_host_mets + "rest/archive/toc2",
        data: "eadId=" + vm_ead + "&folderId=" + folder + "&namespace=" + vm_ead_namespace,
         success: function(data){
             callback(data);
         },
         timeout: 30000,
         error:function(x,e){
         }
         ,
         dataType: "jsonp"
    });
}

function showTree(c, folder) {
    $(c).addClass('wait');

    getJsonData(folder, buildTree);

    function buildTree(data){
        // make the teaser filmstrip:
        makeTeasers(data);
        $(c).removeClass('wait');
        $(c).append('<ul class = "jqueryFileTree" style="display: none;"></ul>');
        $.each(data.toc.folder, function() {
            var title = this.title;
            if(title.length > 16) title = title.substring(0,16) + '...' ;
            if(this.haschildren && this.haschildren != null){
                $(c).find('UL').append('<li class="directory collapsed"><a href="#" id="' + this.title.substring(0,16) + '" rel="' + this.index + '">' + title + '</a></li>');
            }else{
                $(c).find('UL').append('<li class="nochildren"><a href="#" id="' + this.title.substring(0,16) + '" rel="' + this.index + '">' + title + '</a></li>');
            }
        });

        if( folder == o.root ) {
            $(c).find('UL:hidden').show();
        } else {
            $(c).find('UL:hidden').slideDown({ duration: o.expandSpeed, easing: o.expandEasing });
        }
        bindTree(c);

    }
}

function open(c, folder){
//    console.log(c + " " + folder);
    if( c.hasClass('directory') ) {
        if( c.hasClass('collapsed') ) {
            // Expand
            c.find('UL').remove(); // cleanup
            showTree(c, folder );
            c.removeClass('collapsed').addClass('expanded');
        } else {
            // Collapse
            c.find('UL').remove();
            showTree(c, folder);
        }
    }else{
        c.removeClass('nochildren').addClass('nochildren-expanded');
        getJsonData(folder,makeTeasers);
    }
}

function bindTree(t) {
    $(t).find('li a').bind(o.folderEvent, function() {
        if( $(this).parent().hasClass('directory') ) {
            if( $(this).parent().hasClass('collapsed') ) {
                // Expand
                if( !o.multiFolder ) {
                    $(this).parent().parent().find('UL').slideUp({ duration: o.collapseSpeed, easing: o.collapseEasing });
                    $(this).parent().parent().find('LI.directory').removeClass('expanded').addClass('collapsed');
                }
                $(this).parent().find('UL').remove(); // cleanup

                showTree( $(this).parent(), escape($(this).attr('rel') ) );
                $(this).parent().removeClass('collapsed').addClass('expanded');
                $(".jqueryFileTree").find('LI.nochildren-expanded').removeClass('nochildren-expanded').addClass('nochildren');
            } else {
                // Collapse
                $(this).parent().find('UL').remove();
                showTree($(this).parent(), escape($(this).attr('rel') ) );
            }
        } else {
            $('.jqueryFileTree').find('.nochildren-expanded').removeClass('nochildren-expanded').addClass('nochildren');
            $(this).parent().removeClass('nochildren').addClass('nochildren-expanded');
            getJsonData($(this).attr('rel'),makeTeasers);
        }
        return false;
    });
    // Prevent A from triggering the # on non-click events
    if( o.folderEvent.toLowerCase != 'click' ) $(t).find('LI A').bind('click', function() { return false; });
}

function filetree(div){
    // Loading message
    div.append('<ul class = "jqueryFileTree" id="root"></ul>');
    div.find('UL').append('<li class="directory expanded" id="root1"><a href="#" id="roota" rel="0">Table Of Contents</a></li>');
    bindTree($('#root'));

    // Get the initial file list
    showTree( $('#root1'), escape(o.root) );
}


$.fn.textWidth = function(){
  var sensor = $('<div />').css({margin: 0, padding: 0});
  $(this).append(sensor);
  var width = sensor.width();
  sensor.remove();
  return width;
};