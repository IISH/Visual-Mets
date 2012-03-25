<#--Freemarker template-->
<@compress single_line=false>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
    <meta http-equiv="content-type" content="text/xml; charset=utf-8"/>
    <style type="text/css">
        #embed {
            font-size: small;
        }
    </style>
    <title>${title}</title>
    <script type="text/javascript">
        var vm_metsId = '${metsId}';
        var vm_widgetLite = true;
        var vm_default_thumbnailpage = '${default_thumbnailpage}';
        var vm_width = '${width}';
        var vm_height = '${height}';
        var vm_startpage = '${startpage}';
        var vm_number_of_thumbnails_in_overview = ${number_of_thumbnails_in_overview};
        var vm_hide_full_screen_button = ${hide_full_screen_button};
        var vm_disable_transcription_button = ${disable_transcription_button};
        var vm_title = '${title}';
    </script>
</head>

<body>

<script type="text/javascript" src="${proxy_host_mets}rest/widget.js"></script>

<div id="embed">
    <button class="ui-state-default ui-corner-all"
            onclick="document.getElementById('sharethis').style.display='block';">Embed or share
    </button>
    <textarea id="sharethis" class="ui-state-default" style="display:none;" cols="100" rows="14" onclick="select()">
        &lt;script type='text/javascript'&gt;
        var vm_metsId = '${metsId}';
        var vm_widgetLite = true;
        var vm_default_thumbnailpage = '${default_thumbnailpage}';
        var vm_width = '${width}';
        var vm_height = '${height}';
        var vm_startpage = '${startpage}';
        var vm_number_of_thumbnails_in_overview = ${number_of_thumbnails_in_overview};
        var vm_hide_full_screen_button = ${hide_full_screen_button};
        var vm_disable_transcription_button = ${disable_transcription_button};
        var vm_title = '${title}';
        &lt;/script&gt;
        &lt;script type='text/javascript' src='${proxy_host_mets}rest/widget.js'&gt;&lt;/script&gt;
    </textarea>
</div>
</body>

</html>

</@compress>