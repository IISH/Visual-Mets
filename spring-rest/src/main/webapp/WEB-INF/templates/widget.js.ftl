<#--Freemarker template-->
<@compress single_line=false>

<#assign proxy_host = proxy_host/>

document.writeln('<script id="jquery" type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>');
document.writeln("<div id='vm_content'></div>");
function startup() {
    if (typeof $ === 'undefined') {
    } else {
        vm_metsId = encodeURIComponent(vm_metsId);
        vm_proxy_host_mets = '${proxy_host}';
        window.clearInterval(_startup);
        $("#vm_content").after('<script type="text/javascript" src="${proxy_host}js/widget_lite_test.js">');
    }
}
var _startup = window.setInterval(startup, 500);

    </@compress>