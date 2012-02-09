/**
 * Created by IntelliJ IDEA.
 * User: cro
 * Date: 15-8-11
 * Time: 15:01
 * To change this template use File | Settings | File Templates.
 */

var tabProperties;
var oldStartpage=0;

function loadCssFile(cssFile){
    $("head").append("<link>");

    var css = $("head").children(":last");


    css.attr({
        type: 'text/css',
        rel: 'stylesheet',
        href: cssFile
    });

}

function loadCss(){
    //alert(vm_proxy_host_mets);
    loadCssFile(vm_proxy_host_mets + 'js/jquery/css/smoothness/jquery-ui-1.8.5.custom.css');
    loadCssFile(vm_proxy_host_mets + 'css/wireframeLite.css');
    loadCssFile(vm_proxy_host_mets + 'css/wireframeShared.css');
    loadCssFile(vm_proxy_host_mets + 'css/annetta.css');
    loadCssFile(vm_proxy_host_mets + 'js/SmoothDivScroll-1.1/css/smoothDivScroll.css');
    loadCssFile(vm_proxy_host_mets + 'js/jqueryFileTree/jqueryFileTree.css');
    loadCssFile(vm_proxy_host_mets + 'js/imgnavigator/mbImgNav.css');
    if ( typeof(vm_css) != "undefined" ) {
        loadCssFile(vm_css);
    }
}

// Main method

$(document).ready(function() {
    // code below solves the xmlhttp error in IE7: "Object doesn't support this property or method"
    // generated when Tools -> Internet Options -> Advanced -> "Enable XMLHTTP suppport" is checked.
    $(function () {
        $.ajaxSetup
            ({
                xhr: function() {
                    if ($.browser.msie) {
                        return new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    else {
                        return new XMLHttpRequest();
                    }
                }
            })
    });

    loadCss();
    $.getScript(vm_proxy_host_mets + 'js/jquery/js/jquery-ui-1.8.5.custom.min.js');
    $.ajaxSetup({async: false});
    $.getScript(vm_proxy_host_mets + 'js/widgetLite.js'); // PROBLEEM
    checkIfTabPropertiesIsLoaded(1);
    $.ajaxSetup({async: true});
});
function checkIfTabPropertiesIsLoaded(counter) {
    if (tabProperties == undefined) {
        setTimeout(function() {
            checkIfTabPropertiesIsLoaded(counter + 1);
        }, 50);

    } else {
        readyFunctionSecondPart();
    }
}

$.extend({
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  }
});


function readyFunctionSecondPart() {
    tabProperties = new TabProperties();
    tabProperties.id = 1;
    defaultsLoaded = false;
    overlay = false;
    transcription = false;

    // Todo wat als er geen breedte en hoogte is opgegeven?:
    // var vm_width = 700;
    // var vm_height = 600;
    $('body').css({
        width : vm_width - 2 + 'px',
        height : vm_height - 2 + 'px'
    });

    $('#vm_content').css({
        width : vm_width + 'px',
        height : vm_height + 'px'
    });

    canvasWidth = vm_width;
    // canvasHeight = Math.floor(0.8 * vm_height);
    canvasHeight = $('#content').height();
    $("#vm_content").append('<div id="content"></div>');
    $("#content").append('<div id="img_' + tabProperties.id + '" class="image">');
    //$("#content").append('<div id="img_' + tabProperties.id + '" class="image">');

   oldStartpage = vm_startpage;
    if (vm_widgetLite) {
        var page = parseInt($.getUrlVar('page'));
        if (page != undefined) {
            if (!isNaN(page)) {
                vm_startpage = page;
            }
        }
    }

    getPagingDetailsAndDefaults(tabProperties, buildPager);
    setTimeout("vm_startpage = oldStartpage;",500);

}

