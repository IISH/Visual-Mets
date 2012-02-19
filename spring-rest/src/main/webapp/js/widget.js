document.writeln('<script id="jquery" type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>');
document.writeln("<div id='vm_content'></div>");
function startup() {
    if (typeof $ === 'undefined') {
    } else {
        window.clearInterval(_startup);
        $(document).ready(function() {
            $("#vm_content").after('<script type="text/javascript" src="http://localhost:8070/js/widget_lite_test.js">');
        });
    }
}
var _startup = window.setInterval(startup, 500);