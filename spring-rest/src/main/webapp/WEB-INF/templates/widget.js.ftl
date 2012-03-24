<#--Freemarker template-->
<@compress single_line=false>

document.writeln('<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script>');
document.writeln('<script type="text/javascript" src="${proxy_host_mets}js/jquery/js/jquery-ui-1.8.5.custom.min.js"></script>');
document.writeln("<div id='vm_content'></div>");
function startup() {
    if (typeof $ === 'undefined') {
    } else {
        window.clearInterval(_startup);
        vm_metsId = encodeURIComponent(vm_metsId);
        vm_proxy_host_mets = '${proxy_host_mets}';
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
        $("#vm_content").after('<script type="text/javascript" src="${proxy_host_mets}js/widget_lite_test.js">');
    }
}
var _startup = window.setInterval(startup, 500);

</@compress>