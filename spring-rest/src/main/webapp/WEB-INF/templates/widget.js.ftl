<#--Freemarker template-->
<@compress single_line=false>

var tabProperties;
var oldStartpage = 0;

document.writeln('<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script>');
document.writeln('<script type="text/javascript" src="${proxy_host_mets}js/jquery/js/jquery-ui-1.8.5.custom.min.js"></script>');
document.writeln("<div id='vm_content'></div>");
function startup() {

    if (typeof $ === 'undefined') {
    } else {
        window.clearInterval(_startup);
        vm_metsId = encodeURIComponent(vm_metsId);
        vm_proxy_host_mets = '${proxy_host_mets}';
        loadCss();

        $.extend({
            getUrlVars: function() {
                var vars = [], hash;
                var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
                for (var i = 0; i < hashes.length; i++) {
                    hash = hashes[i].split('=');
                    vars.push(hash[0]);
                    vars[hash[0]] = hash[1];
                }
                return vars;
            },
            getUrlVar: function(name) {
                return $.getUrlVars()[name];
            }
        });

        $.getScript('${proxy_host_mets}js/widgetLite.js', setup);
    }
}


function loadCssFile(cssFile) {
    $("head").append("<link>");

    var css = $("head").children(":last");


    css.attr({
        type: 'text/css',
        rel: 'stylesheet',
        href: cssFile
    });

}

function loadCss() {
    //alert(vm_proxy_host_mets);
    loadCssFile('${proxy_host_mets}js/jquery/css/smoothness/jquery-ui-1.8.5.custom.css');
    loadCssFile('${proxy_host_mets}css/wireframeLite.css');
    loadCssFile('${proxy_host_mets}css/wireframeShared.css');
    loadCssFile('${proxy_host_mets}css/annetta.css');
    loadCssFile('${proxy_host_mets}js/SmoothDivScroll-1.1/css/smoothDivScroll.css');
    loadCssFile('${proxy_host_mets}js/jqueryFileTree/jqueryFileTree.css');
    loadCssFile('${proxy_host_mets}js/imgnavigator/mbImgNav.css');
    if (typeof(vm_css) != "undefined") {
        loadCssFile(vm_css);
    }
}

function setup() {

    tabProperties = new TabProperties();
    tabProperties.id = 1;
    defaultsLoaded = false;
    overlay = false;
    transcription = false;

    $('#vm_content').css({
        width : vm_width + 'px',
        height : vm_height + 'px'
    });

    canvasWidth = vm_width;
    // canvasHeight = Math.floor(0.8 * vm_height);
    canvasHeight = $('#content').height();
    $("#vm_content").append('<div id="content"></div>');
    $("#content").append('<div id="img_' + tabProperties.id + '" class="image">');

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
    setTimeout("vm_startpage = oldStartpage;", 500);
}

var _startup = window.setInterval(startup, 500);

</@compress>
