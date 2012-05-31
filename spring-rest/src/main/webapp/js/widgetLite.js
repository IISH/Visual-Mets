var tabProperties = new TabProperties();
var canvasWidth;
var canvasHeight;
var defaultsLoaded;
var defaults = new Defaults();
var oldNavPosX = 0;
var oldNavPosY = 0;
var overlay;
var timer;

var ERROR_METS = "An error occurred while reading the METS document. Please validate your METS document.";
var SERVER404 = "Cannot reach server (HTTP404), server might be down. Please contact support.";

//alert(vm_hide_full_screen_button);

if (typeof(vm_hide_full_screen_button) == "undefined") var vm_hide_full_screen_button;
vm_hide_full_screen_button = checkVariableInteger(vm_hide_full_screen_button, 0, 0);

if (typeof(vm_default_thumbnailpage) == "undefined") var vm_default_thumbnailpage;
vm_default_thumbnailpage = checkVariableInteger(vm_default_thumbnailpage, 1, 1);

if (typeof(vm_number_of_thumbnails_in_overview) == "undefined") var vm_number_of_thumbnails_in_overview;
vm_number_of_thumbnails_in_overview = checkVariableInteger(vm_number_of_thumbnails_in_overview, 20, 8);

if (typeof(vm_startpage) == "undefined") var vm_startpage;
vm_startpage = checkVariableString(vm_startpage, 1);

if (typeof(vm_css) == "undefined") var vm_css;
vm_css = checkVariableString(vm_css, "");

if (typeof(vm_search) == "undefined") var vm_search;
vm_search = checkVariableString(vm_search, "");

if (typeof(vm_ead) == "undefined") var vm_ead;
vm_ead = checkVariableString(vm_ead, "");

if (typeof(vm_image_overhead) == "undefined") var vm_image_overhead;
vm_image_overhead = checkVariableInteger(vm_image_overhead, 80, 0);

function checkVariableInteger(field, defaultValue, minValue) {
    if (typeof(field) == "undefined") {
        var field = defaultValue;
    } else if (field == null) {
        field = defaultValue;
    } else if (field < minValue) {
        field = defaultValue;
    }
    return field;
}

function checkVariableString(field, defaultValue) {
    if (typeof(field) == "undefined") {
        var field = defaultValue;
    } else if (field == null) {
        field = defaultValue;
    }
    return field;
}
//alert(vm_hide_full_screen_button);

function Defaults() {
    this.brightnessMin = 0;
    this.brightnessDefault = 0;
    this.brightnessMax = 0;
    this.brightnessType = 0;

    this.contrastMin = 0;
    this.contrastDefault = 0;
    this.contrastMax = 0;
    this.contrastType = 0;

    this.zoomMin = 0;
    this.zoomDefault = 0;
    this.zoomMax = 0;
    this.zoomType = 0;

    this.zoomOverviewMin = 0;
    this.zoomOverviewDefault = 0;
    this.zoomOverviewMax = 0;
    this.zoomOverviewType = 0;

    this.paddingMin = 0;
    this.paddingDefault = 0;
    this.paddingMax = 0;
    this.paddingType = 0;

    this.angleDefault = 0;
    this.angleInterval = 0;
}


function TabProperties() {
    this.page = 1;
    this.pageCount = 10;
    this.rotation = 0;
    this.zoom = 100;
    this.metsId = 1;
    this.brightness = 0;
    this.contrast = 1;
    this.title = '';
    this.overview = true;
    this.thumbnailList = new Array();
    this.thumbnailZoom = 0;
    this.overviewPage = 1;
    this.breadcrumb = '';
    this.transcription = false;
    this.height = 0;
    this.showNav = true;
    this.overviewStart = 0;
    this.overviewCount = 0;


    this.reset = function() {
        this.rotation = 0;
        this.zoom = 100;
        this.brightness = 0;
        this.contrast = 1;
        $("#editButtons_" + this.id + " #brightnessSlider").slider("option", "value", 0);
        $("#editButtons_" + this.id + " #contrastSlider").slider("option", "value", 1);
    }

    this.zoomIn = function() {
        this.zoom += 5;
        return this.zoom;
    }

    this.zoomOut = function() {
        this.zoom -= 5;
        return this.zoom;
    }

    this.rotateCCW = function() {
        this.rotation = (this.rotation - 90) % 360;
    }

    this.rotateCW = function() {
        this.rotation = (this.rotation + 90) % 360;
    }


    this.gotoPage = function(page) {
        this.page = page;
    }

    this.firstPage = function() {
        this.page = 1;
        return 1;
    }

    this.prevPage = function() {
        if (this.page > 1) {
            this.page--;
            return this.page;
        } else {
            return 1;
        }
    }

    this.nextPage = function() {
        if (this.page < this.pageCount) {
            this.page++;
            return this.page;
        } else {
            return this.page;
        }
    }

    this.lastPage = function() {
        this.page = this.pageCount;
        return this.pageCount;
    }

}


function loadCssFile(cssFile) {
    $("head").append("<link>");
    css = $("head").children(":last");

    css.attr({
        type: 'text/css',
        rel: 'stylesheet',
        href: cssFile
    });
}

function loadCss() {
    loadCssFile(vm_proxy_host_mets + 'js/jquery/css/smoothness/jquery-ui-1.8.5.custom.css');
    // uitgeschakeld om te embedden in widgetFull met tree erbij:
//    loadCssFile(vm_proxy_host_mets + 'css/wireframeLite.css');
    loadCssFile(vm_proxy_host_mets + 'css/annetta.css');
    loadCssFile(vm_proxy_host_mets + 'js/SmoothDivScroll-1.1/css/smoothDivScroll.css');
    loadCssFile(vm_proxy_host_mets + 'js/jqueryFileTree/jqueryFileTree.css');
    loadCssFile(vm_proxy_host_mets + 'js/imgnavigator/mbImgNav.css');
}

function buildWireframeHtml() {
//    $('#vm_content').append('<div id="editButtonsOuter" class="editControls"></div>');
    $('#vm_content').append('<div id="content"></div>');
    $('#content').append('<div id="contentMain"></div>');
    $("#content").append('<div id="metaData">');
}

// todo: testen
function getMetsCode(tabProperties) {
    var metsCode = "";

    //alert("LAST EAD: " + vm_ead);
    if (vm_ead != "") {
        // TODO: GCU
        var aaa = $("#contentTabs .current a.tab").attr("id");
//        alert("LAST tabProperties.id" + tabPropertiesArray[aaa].id);
//        alert("LAST A1 " + tabPropertiesArray[aaa].metsId);
        var foundArray = $.grep(tabPropertiesArray, function(n, i) {
            return n.id == aaa;
        });
        metsCode = foundArray[0].metsId;
        //metsCode = tabPropertiesArray[aaa].metsId;
        if (metsCode == 123) {
//        alert("JA/NEE: " + vm_metsId);
        }
    } else {
//        alert("LAST B " + vm_metsId);
        metsCode = vm_metsId;
    }
    return metsCode;
}


function getPagingDetailsAndDefaults(tabProperties) {

    if (vm_default_thumbnailpage == null) {
        vm_default_thumbnailpage = 1;
    }

    if (vm_widgetLite) {
        tabProperties.height = vm_height - 75;
    } else {
        tabProperties.height = $("#img_" + tabProperties.id).height() - 75;
    }

    $.ajax({
        type: "GET",
        url: vm_proxy_host_mets + "rest/document?",
        data:
            "metsId=" + getMetsCode() +
//                "metsId=" + tabProperties.metsId +
            "&pager.start=1" +
            "&pager.rows=1" +
            "&pager=true" +
            "&defaults=true" +
            "&scale=true" +
            "&scale.width=" + vm_width +
            "&scale.height=" + tabProperties.height +
            "&scale.pageId=" + vm_default_thumbnailpage,
        success: function(data) {

            if (!defaultsLoaded) {
                loadDefaults(data);
            }
            tabProperties.pageCount = data.document.pager.count;
            tabProperties.zoom = data.document.scale;
            tabProperties.rotation = defaults.angleDefault;
            //tabProperties.thumbnailZoom = defaults.zoomOverviewDefault;
            tabProperties.thumbnailZoom = 80;
            buildMain(tabProperties);
        },
        timeout: 30000,
        error:function(jqXHR, textStatus, errorThrown) {

            var serverStatus = jqXHR.status;
            if (serverStatus == 500) {
                throwError("METS");
            } else if (serverStatus == 404) {
                throwError("SERVER404");
            }
        },
        dataType: "jsonp"
    });
}

function throwError(errorcode) {
    if (errorcode == "METS") {
        alert(ERROR_METS);
    } else if (errorcode == "SERVER404") {
        alert(SERVER404);
    }

}


function buildMain(tabProperties) {

    $("#img_" + tabProperties.id).append('<div id="tabBreadcrumb">' + tabProperties.breadcrumb + '</div>');
    $(".breadcrumb").click(function(event) {
        event.preventDefault();
        var folder = $('[id=' + $(this).attr("href").substring(0, 16) + ']');
        var folderId = folder.attr("rel");
        open(folder.parent(), folderId);
    });

    buildEditButtons(tabProperties);
    buildPager(tabProperties);


    // ga naar thumbnail overview als vm_startpage parameter niet is gedefinieerd, of '0' of leeg
    // ga anders direct naar de betreffend pagina met showBigImage().
    if (typeof(vm_startpage) == "undefined" || vm_startpage == "0" || vm_startpage == "") {
        makeThumbnailOverview(tabProperties);
        hidePagingButtons(tabProperties.id);
    } else {
        tabProperties.page = vm_startpage;
        tabProperties.overview = false;
        //$("#editButtons").show();
        scaleAndShowBigImage(tabProperties);

        $("#img_" + tabProperties.id + " #overview").children().first().html('Overview');


    }
    //buildInfoAndLink(tabProperties);
}

function buildPager(tabProperties) {
    // using table here to avoid IE inline div quirks
    $("#img_" + tabProperties.id).append('<div id="pagingControls" class="pagingControls">' +
        '<table><tr>' +
        '<td><button id="overviewPrev">Previous</button></td>' +
        '<td><button id="overview">Overview</button></td>' +
        '<td><button id="overviewNext">Next</button></td>' +
        '<td><button id="pagingFirst">First Page</button></td>' +
        '<td><button id="pagingPrevious">Previous Page</button></td>' +
        '<td><input id="pagingPagenumber" size="2" value="' + tabProperties.page + '"> </input></td>' +
        '<td><span id="nr_of_pages"></span></td>' +
        '<td><button id="pagingNext">Next Page</button></td>' +
        '<td><button id="pagingLast">Last Page</button></td>' +
        '<td><img class="sizeSlider" src="' + vm_proxy_host_mets + 'js/jquery/css/smoothness/images/minus.png" alt=""></td>' +
        '<td><div class="editSlider sizeSlider" id="size"></div></td>' +
        '<td><img class="sizeSlider" src="' + vm_proxy_host_mets + 'js/jquery/css/smoothness/images/plus.png" alt=""></td></tr>' +
        '</table></div>');

//    var pagingTop = vm_height - 40;
//    $("#pagingControls").css({top: 0});

    $("#img_" + tabProperties.id + " #overview").button({
        text: true
    }).click(function() {
            if (!tabProperties.overview) {
                removeTranscription(tabProperties);

                tabProperties.overview = true;
                tabProperties.transcription = false;
                $("#img_" + tabProperties.id + " #transcriptionOverlay").remove();
                $("#showTranscription_" + tabProperties.id).removeAttr('checked');
                $("#showTranscription_" + tabProperties.id).button("refresh");
                $("#img_" + tabProperties.id + " #overviewPrev").show();
                $("#img_" + tabProperties.id + " #overviewNext").show();
                $("#img_" + tabProperties.id + " #tabBreadcrumb").show();
                //$("#metaData").hide();
                hidePagingButtons(tabProperties.id);
                makeThumbnailOverview(tabProperties);
                $("#img_" + tabProperties.id + " #overview").children().first().html('View');
            } else {
                tabProperties.overview = false;
                $("#img_" + tabProperties.id + " #overviewPrev").hide();
                $("#img_" + tabProperties.id + " #overviewNext").hide();
                //$("#editButtons").show();
                scaleAndShowBigImage(tabProperties);
                $("#img_" + tabProperties.id + " #overview").children().first().html('Overview');
            }
        });

    function funcOverviewPrev() {
//        $("#img_" + tabProperties.id + " #overviewNext").button("option", "disabled", false);
        tabProperties.overviewPage -= vm_number_of_thumbnails_in_overview;
        getThumbnailPagerDetails(tabProperties);
        disablePagerButtons(tabProperties);
    }

    buildButton("#img_" + tabProperties.id + " #overviewPrev", "ui-icon-triangle-1-w", funcOverviewPrev);

    function funcOverviewNext() {
//        $("#img_" + tabProperties.id + " #overviewPrev").button("option", "disabled", false);
        tabProperties.overviewPage += vm_number_of_thumbnails_in_overview;
        getThumbnailPagerDetails(tabProperties);
        disablePagerButtons(tabProperties);
    }

    buildButton("#img_" + tabProperties.id + " #overviewNext", "ui-icon-triangle-1-e", funcOverviewNext);

//    var leftOffset;
//    var bottomOffset;
//    if( $.browser.msie){
//        leftOffset = (vm_width - 370) / 2;
//        bottomOffset = vm_height - 50 - 5;
//    } else {
//        leftOffset = (vm_width - $("#img_" + tabProperties.id + " #pagingControls").width()) / 2;
//        bottomOffset = vm_height - $("#img_" + tabProperties.id + " #pagingControls").height() - 5;
//    }
//
//    $("#img_" + tabProperties.id + " #pagingControls").css({
//        "left": leftOffset + "px",
//        "top": bottomOffset + "px"
//    });

//    $("#img_" + tabProperties.id + " #pagingControls").css({
//        "left": "377px",
//        "top": "564px"
//    });

    function funcFirst() {
        tabProperties.firstPage();
        showBigImage(tabProperties);
        disablePagerButtons(tabProperties);
        if (tabProperties.overlay) showOverlay(tabProperties);
    }

    buildButton("#img_" + tabProperties.id + " #pagingFirst", "ui-icon-seek-first", funcFirst);

    function funcPrev() {
        tabProperties.prevPage();
        scaleAndShowBigImage(tabProperties);
        disablePagerButtons(tabProperties);
        if (tabProperties.overlay) showOverlay(tabProperties);
    }

    buildButton("#img_" + tabProperties.id + " #pagingPrevious", "ui-icon-triangle-1-w", funcPrev);
    $("#img_" + tabProperties.id + " #nr_of_pages").html('/' + tabProperties.pageCount + ' ');

    function funcNext() {
        tabProperties.nextPage();
        scaleAndShowBigImage(tabProperties);
        disablePagerButtons(tabProperties);
        if (tabProperties.overlay) showOverlay(tabProperties);
    }

    buildButton("#img_" + tabProperties.id + " #pagingNext", "ui-icon-triangle-1-e", funcNext);

    function funcLast() {
        tabProperties.lastPage();
        scaleAndShowBigImage(tabProperties);
        disablePagerButtons(tabProperties);
        if (tabProperties.overlay) showOverlay(tabProperties);
    }

    buildButton("#img_" + tabProperties.id + " #pagingLast", "ui-icon-seek-end", funcLast);

    var input = $("#pagingPagenumber");
    input.keypress(function(event) {
        if (event.keyCode == '13') { // return button
            tabProperties.page = input.val();
            scaleAndShowBigImage(tabProperties);
            if (tabProperties.overlay) showOverlay(tabProperties);
        }
    });

    $("#img_" + tabProperties.id + " #size").slider({
        //value: defaults.zoomOverviewDefault,
        value: 80, //todo: zoomOverviewDefault in 80 veranderen
        min: defaults.zoomOverviewMin,
        max: defaults.zoomOverviewMax,
        step: 10,
        change: function(event, ui) {
            tabProperties.thumbnailZoom = ui.value;
            makeThumbnailOverview(tabProperties);
        }
    });

    disablePagerButtons(tabProperties);
}

function buildEditButtons(tabProperties) {
// using table here to avoid IE inline < div> quirks
    var topButtons = '<div id="editButtons" class="editToolbar">'
        + '<table border="0" cellpadding="0" cellspacing="0"><tr><td  ><button id="zoomOut">Zoom Out </button></td>'
        + '<td ><input id="zoomLevel" size="3" value="100%" > </input></td>'
        + '<td ><button id="zoomIn">Zoom In </button></td>'
        + '<td ><button id="rotateCCW">Rotate CCW </button></td>'
        + '<td ><button id="rotateCW">Rotate CW</button></td>';


    if (vm_hide_full_screen_button != 1) {
        topButtons += '<td ><button id="fullscreen">Fullscreen </button></td>';
    }

    topButtons +=
        '<td><div style="width:7px;"></div></td>'
            + '<td><img alt="" src="' + vm_proxy_host_mets + 'js/jquery/css/smoothness/images/helderheid.gif" width="16" height="16" / > '
            + '<td><div style="width:7px;"></div></td>'
            + '<td><a href="" id="brightnessMinus"><img src="' + vm_proxy_host_mets + 'js/jquery/css/smoothness/images/minus.png" alt=""></a></td>'
            + '<td><div class="editSlider" id="brightnessSlider"></div></td>'
            + '<td><a href="" id="brightnessPlus"><img src="' + vm_proxy_host_mets + 'js/jquery/css/smoothness/images/plus.png" alt=""></a></td>'
            + '<td><div style="width:7px;"></div></td>'
            + '<td><img alt="" src = "' + vm_proxy_host_mets + 'js/jquery/css/smoothness/images/contrast_transp.gif" width = "16" height = "16"/></td>'
            + '<td><div style="width:7px;"></div></td>'
            + '<td><a href="" id="contrastMinus"><img src="' + vm_proxy_host_mets + 'js/jquery/css/smoothness/images/minus.png" alt=""></a></td>'
            + '<td><div class = "editSlider" id = "contrastSlider"></div></td>'
            + '<td><a href = "" id="contrastPlus"><img src="' + vm_proxy_host_mets + 'js/jquery/css/smoothness/images/plus.png" alt=""></a></td>'
            + '<td><div style="width:7px;"></div></td>'
            + '<td><button id="reset">Reset</button></td>'
            + '<input type="checkbox" id="showTranscription_' + tabProperties.id + '" /></td>'
            + '<td><label for="showTranscription_' + tabProperties.id + '">Text</label></td>'
            + '<td><input type="checkbox" id="navigatorToggle_' + tabProperties.id + '" /></td>'
            //+ '<td><button id="navigatorToggle">Navigator</button></td>'
            + '<td><label for="navigatorToggle_' + tabProperties.id + '">Navigator</label></td>'

            + '</tr>'
            + '</table></div>';
    $("#img_" + tabProperties.id).append(topButtons);

//    var leftOffset;
//    if( $.browser.msie){
//        leftOffset = (vm_width - 481) / 2;
//    } else {
//        leftOffset = (vm_width - $("#img_" + tabProperties.id + " #editButtons").width()) / 2 ;
//    }
//
//    $("#img_" + tabProperties.id + " #editButtons").css({left: leftOffset});

    var zoomInput = $("#img_" + tabProperties.id + " #zoomLevel");
    zoomInput.keypress(function(event) {
        if (event.keyCode == '13') {
            var newZoom = parseInt(zoomInput.val());
            if (newZoom <= 200 && newZoom >= 10) {
                tabProperties.zoom = newZoom;
                showBigImage(tabProperties);
            } else {
                //alert('Zoom level has to be greater of equal than 10 and smaller than 200');
            }
        }
    });

    function funcZoomOut() {
        if (tabProperties.zoom > defaults.zoomMin) {
            tabProperties.zoomOut();
            showBigImage(tabProperties);
        }
    }

    buildButton("#img_" + tabProperties.id + " #zoomOut", "ui-icon-minus", funcZoomOut);

    function funcZoomIn() {
        if (tabProperties.zoom < 200) {           // todo ZoomMax naar 200
            tabProperties.zoomIn();
            showBigImage(tabProperties);
        }
    }

    buildButton("#img_" + tabProperties.id + " #zoomIn", "ui-icon-plus", funcZoomIn);

    function funcCCW() {
        tabProperties.rotateCCW();
        showBigImage(tabProperties);
    }

    buildButton("#img_" + tabProperties.id + " #rotateCCW", "ui-icon-arrowreturnthick-1-s", funcCCW);

    function funcCW() {
        tabProperties.rotateCW();
        showBigImage(tabProperties);
    }

    //buildButton("#img_" + tabProperties.id + " #rotateCW",  "ui-icon-custom", funcCW);
    $("#img_" + tabProperties.id + " #rotateCW").button({
        text: false,
        icons: {
            primary: "ui-icon-custom"
        }
    }).click(function() {
            funcCW();
        });


    $("#navigatorToggle_" + tabProperties.id).button().click(function() {
        tabProperties.showNav ? tabProperties.showNav = false : tabProperties.showNav = true;
        $("#img_" + tabProperties.id + " .nav").toggle();
    });

//    $("#img_" + tabProperties.id + " #showTranscription").button().click(function() {
    $("#showTranscription_" + tabProperties.id).button().click(function() {
        if (!tabProperties.transcription) {
            showTranscription(tabProperties);
        } else {
            removeTranscription(tabProperties);
        }
    });

    function funcFullscreen() {
        $("#img_" + tabProperties.id + " #pagingControls").css({top: 0});
        showOverlay(tabProperties);
    }

    if (vm_hide_full_screen_button != 1) {
        buildButton("#img_" + tabProperties.id + " #fullscreen", "ui-icon-arrow-4-diag", funcFullscreen);
    }

// Brightness     2012
    $("#brightnessMinus").click(function(event) {
        event.preventDefault();
        tabProperties.brightness -= 5;
        showBigImage(tabProperties);
        $("#img_" + tabProperties.id + " #brightnessSlider").slider("option", "value", tabProperties.brightness);
    });

    $("#img_" + tabProperties.id + " #brightnessSlider").slider({
        value: defaults.brightnessDefault,
        min: defaults.brightnessMin,
        max: defaults.brightnessMax,
        step: 5,
        change: function(event, ui) {
            if (event.originalEvent) {    // only update image on manual change, not after reset
                tabProperties.brightness = ui.value;
                showBigImage(tabProperties);
            }
        }
    });


    $("#brightnessPlus").click(function(event) {
        event.preventDefault();
        tabProperties.brightness += 5;
        showBigImage(tabProperties);
        $("#img_" + tabProperties.id + " #brightnessSlider").slider("option", "value", tabProperties.brightness);
    });


// Contrast controls:
    $("#contrastMinus").click(function(event) {
        event.preventDefault();
        tabProperties.contrast -= 0.05;
        showBigImage(tabProperties);
        $("#img_" + tabProperties.id + " #contrastSlider").slider("option", "value", tabProperties.contrast);
    });

    $("#img_" + tabProperties.id + " #contrastSlider").slider({
        value: defaults.contrastDefault,
        min: defaults.contrastMin,
        max: defaults.contrastMax,
        step: .05,
        change: function(event, ui) {
            if (event.originalEvent) {     // only update image on manual change, not after reset
                tabProperties.contrast = ui.value;
                showBigImage(tabProperties);
            }
        }
    });

    $("#contrastPlus").click(function(event) {
        event.preventDefault();
        tabProperties.contrast += 0.05;
        showBigImage(tabProperties);
        $("#img_" + tabProperties.id + " #contrastSlider").slider("option", "value", tabProperties.contrast);
    });

    $("#img_" + tabProperties.id + " #reset").button({

    }).click(function() {
            tabProperties.zoom = defaults.zoomDefault;
            tabProperties.brightness = defaults.brightnessDefault;
            tabProperties.contrast = defaults.contrastDefault;
            tabProperties.rotation = defaults.angleDefault;
            $("#img_" + tabProperties.id + " #brightnessSlider").slider("option", "value", defaults.brightnessDefault);
            $("#img_" + tabProperties.id + " #contrastSlider").slider("option", "value", defaults.contrastDefault);
            showBigImage(tabProperties);
        });
}

function buildInfoAndLink(tabProperties) {

    $("#img_" + tabProperties.id).append('<div id="infoAndLink"></div>');
    $("#img_" + tabProperties.id + " #infoAndLink").append('<a class="roundedButton" href="#" onclick="this.blur();"><span>i</span></a>' +
        '<a class="roundedButton" href="#" onclick="this.blur();"><span>Link</span></a>');
}

function buildButton(location, icon, func) {
    $(location).button({
        text: false,
        icons: {
            primary: icon
        }
    }).click(function() {
            func();
        });
}


function showTranscription(tabProperties) {
    tabProperties.height -= 150;

    showBigImage(tabProperties);
    $("#img_" + tabProperties.id).append('<div id = "transcriptionOverlay" class = "transcriptionOverlay">');

    var overlay = $("#img_" + tabProperties.id + " #transcriptionOverlay");

    getTranscriptionData();
    tabProperties.transcription = true;
}

function removeTranscription(tabProperties) {
    if (tabProperties.transcription) {
        tabProperties.height += 150;
        oldNavPosX = 0;
        oldNavPosY = 0;
        showBigImage(tabProperties);
        $("#img_" + tabProperties.id + " #transcriptionOverlay").remove();
        tabProperties.transcription = false;
    }
}

function getTranscriptionData() {
    var urlTranscription = vm_proxy_host_mets + "rest/resource/get_transcription_json?" +
        "metsId=" + getMetsCode() +
        "&pageId=" + tabProperties.page;

    $.ajax({
        url: urlTranscription,
        dataType: 'jsonp',
        jsonpCallback: 'appendTranscription'
    });

}

function appendTranscription(data) {
    if (data.transcription.length == 0) {
        $("#img_" + tabProperties.id + " #transcriptionOverlay").html('No transcription available for this page');
    } else {
        $("#img_" + tabProperties.id + " #transcriptionOverlay").html(data.transcription);
    }
}


function getThumbnailPagerDetails(tabProperties) {
    this.tabProperties = tabProperties;

    $.ajax({
        type: "GET",
        url: vm_proxy_host_mets + "rest/document?",
        data:
            "metsId=" + getMetsCode() +
//                "metsId=" + tabProperties.metsId +
            "&pager.start=" + tabProperties.overviewPage +
            "&pager.rows=" + vm_number_of_thumbnails_in_overview +
            "&pager=true" +
            "&defaults=false" +
            "&scale=false",
        context: this,
        success: function(data) {
            this.tabProperties.thumbnailList = data.document.pager.pages;
            this.tabProperties.overviewStart = data.document.pager.start;
            this.tabProperties.overviewCount = data.document.pager.count;
            disablePagerButtons(tabProperties);
            makeThumbnailHtml(tabProperties);
        },
        timeout: 30000,
        error: function(x, e) {
        }
        ,
        dataType: "jsonp"
    });
}

function makeThumbnailHtml(tabProperties) {
    var size = tabProperties.thumbnailZoom;
    if (vm_number_of_thumbnails_in_overview === null) {
        vm_number_of_thumbnails_in_overview = 8;
    }

//tabProperties.returnedRows = data.document.pager.pages.page.length;
    tabProperties.returnedRows = tabProperties.thumbnailList.page.length;

    $("#img_" + tabProperties.id + " #navArea").remove();
    $("#img_" + tabProperties.id + " #thumbs").remove();

    $("#content #img_" + tabProperties.id).append('<div id = "thumbs"></div>');

    $.each(tabProperties.thumbnailList.page, function (i, v) {
        var thumbnailurl = this.thumbnail_url;
//        thumbnailurl = "http://integratievisualmets.iisg.nl/mets1/rest/resource/thumbnail_image?metsId=http://webstore.iisg.nl/ziegler/4698/xml/4698_0.xml&pageId=1&zoom=80";
//        thumbnailurl = thumbnailurl.substring(41,thumbnailurl.length);
//        thumbnailurl = "http://integratievisualmets.iisg.nl/mets2" + thumbnailurl;

        thumbnailurl = "rest/resource/thumbnail_image?metsId=http://webstore.iisg.nl/ziegler/4698/xml/4698_0.xml&pageId=1&zoom=80";
        thumbnailurl = vm_proxy_host_mets + thumbnailurl;

        $("#img_" + tabProperties.id + " #thumbs").append('<a href="#" class="general"><img class="overviewThumbnail" src="'
            + this.thumbnail_url
            + '&zoom=' + size + '"/></a>');
        $("#img_" + tabProperties.id + " a:last").bind('click', {page: i}, function(event) {
            event.preventDefault();
            tabProperties.overview = false;
            tabProperties.page = event.data.page + tabProperties.overviewPage; //using event.data prevents closure issues
//            $("#editButtonsOuter").show();
//            $("#editButtons").show();
            scaleAndShowBigImage(tabProperties);
            $("#img_" + tabProperties.id + " #overview").children().first().html('Overview');
            return false;
        });
    });


}


function scaleAndShowBigImage(tabProperties) {
    $.ajax({
        type: "GET",
        url: vm_proxy_host_mets + "rest/document?",
        data:
            "metsId=" + getMetsCode() +
//                "metsId=" + tabProperties.metsId +
            "&pager.start=1" +
            "&pager.rows=1" +
            "&pager=true" +
            "&defaults=true" +
            "&scale=true" +
            "&scale.width=" + vm_width +
            "&scale.height=" + tabProperties.height +
            "&scale.pageId=" + tabProperties.page,
        success: function(data) {
            tabProperties.zoom = data.document.scale;
            showBigImage(tabProperties);
        },
        timeout: 30000,
        error:function(jqXHR, textStatus, errorThrown) {

            var serverStatus = jqXHR.status;
            if (serverStatus == 500) {
                throwError("METS");
            } else if (serverStatus == 404) {
                throwError("SERVER404");
            }
        },
        dataType: "jsonp"
    });
}

// todo: Alvast de eerstvolgende n pagina's inladen met async ajax call. Hierdoor gaat bladeren sneller.
function showBigImage(tabProperties) {
    if (tabProperties.transcription) {
        getTranscriptionData();
    }

    $("#img_" + tabProperties.id + " #overviewPrev").hide();
    $("#img_" + tabProperties.id + " #overviewNext").hide();
    $("#img_" + tabProperties.id + " .sizeSlider").hide();
    $("#img_" + tabProperties.id + " #thumbs").remove();


    $("#img_" + tabProperties.id + " #tabBreadcrumb").hide();
    $("#img_" + tabProperties.id + " #editButtons").show();

    //$("#metaData").show();
    showPagingButtons(tabProperties.id);

    disablePagerButtons(tabProperties);

    var curdir = location.href.substring(0, location.href.lastIndexOf('/') + 1);
    var currentTime = new Date();
    var url = vm_proxy_host_mets + "rest/resource/reference_image?" +
        "metsId=" + getMetsCode() +
        "&pageId=" + tabProperties.page +
        "&angle=" + tabProperties.rotation +
        "&scale=" + tabProperties.zoom +
        "&brightness=" + tabProperties.brightness +
        "&contrast=" + tabProperties.contrast +
        "&width=" + vm_width +
        "&height=" + tabProperties.height +
        "&random=" + currentTime.getTime() + Math.ceil(Math.random() * 1000); // SOLUTION FOR MS REFRESH BUG

    if ($("#img_" + tabProperties.id + " #navArea").length == 0) {
        $("#img_" + tabProperties.id + " #editButtons").after('<div class="imageMain" id="imageMain_' + tabProperties.id + '"></div>');
        $("#imageMain_" + tabProperties.id).append('<div id = "navArea"><div style = "display:none;" class = "imagesContainer {navPosition:\'BR\', navWidth: 100}">');
    } else {
        //$("#img_" + tabProperties.id ).append('<div id="test" style="top:110px; position:absolute;"></div>');
        $("#imageMain_" + tabProperties.id).html('<div id = "navArea"><div style = "display:none;" class = "imagesContainer {navPosition:\'BR\', navWidth: 100}">');
    }

    //$("#img_" + tabProperties.id ).html('<div id = "navArea"><div style = "display:none;" class = "imagesContainer {navPosition:\'BR\', navWidth: 100}">');
    $.getScript(vm_proxy_host_mets + 'js/imgnavigator/mbImgNavLite.js', function() {
        $("#img_" + tabProperties.id + " #navArea").imageNavigator({
            tabProperties: tabProperties,
            areaWidth: vm_width,
            areaHeight: tabProperties.height,
            draggerStyle:"1px solid black",
            navOpacity:1.0,
            imageUrl: url,
            navWidth: 100
        });
    });

    $("#img_" + tabProperties.id + " #pagingPagenumber").val(tabProperties.page);
    $("#img_" + tabProperties.id + " #zoomLevel").val(tabProperties.zoom + '%');
}

function loadDefaults(data) {
    defaults.brightnessMin = parseInt(data.document.defaults.reference_image.brightness.min);
    defaults.brightnessDefault = parseInt(data.document.defaults.reference_image.brightness.defaults);
    defaults.brightnessMax = parseInt(data.document.defaults.reference_image.brightness.max);

    defaults.contrastMin = parseInt(data.document.defaults.reference_image.contrast.min);
    defaults.contrastDefault = parseInt(data.document.defaults.reference_image.contrast.defaults);
    defaults.contrastMax = parseInt(data.document.defaults.reference_image.contrast.max);

    defaults.zoomMin = parseInt(data.document.defaults.reference_image.zoom.min);
    defaults.zoomDefault = parseInt(data.document.scale);
    defaults.zoomMax = parseInt(data.document.defaults.reference_image.zoom.max);

    defaults.zoomOverviewMin = parseInt(data.document.defaults.reference_image.zoom_overview.min);
    defaults.zoomOverviewDefault = parseInt(data.document.defaults.reference_image.zoom_overview.defaults);
    defaults.zoomOverviewMax = parseInt(data.document.defaults.reference_image.zoom_overview.max);

    defaults.paddingMin = parseInt(data.document.defaults.reference_image.padding.min);
    defaults.paddingDefault = parseInt(data.document.defaults.reference_image.padding.defaults);
    defaults.paddingMax = parseInt(data.document.defaults.reference_image.padding.max);

    defaults.angleDefault = parseInt(data.document.defaults.reference_image.angle.defaults);
    defaults.angleInterval = data.document.defaults.reference_image.angle.interval;
    defaultsLoaded = true;
}

function disablePagerButtons(tabProperties) {
    if (tabProperties.page == 1) {
        $("#img_" + tabProperties.id + " #pagingFirst").button("option", "disabled", true);
        $("#img_" + tabProperties.id + " #pagingPrevious").button("option", "disabled", true);
    } else {
        $("#img_" + tabProperties.id + " #pagingFirst").button("option", "disabled", false);
        $("#img_" + tabProperties.id + " #pagingPrevious").button("option", "disabled", false);
    }
    if (tabProperties.page == tabProperties.pageCount) {
        $("#img_" + tabProperties.id + " #pagingLast").button("option", "disabled", true);
        $("#img_" + tabProperties.id + " #pagingNext").button("option", "disabled", true);
    } else {
        $("#img_" + tabProperties.id + " #pagingLast").button("option", "disabled", false);
        $("#img_" + tabProperties.id + " #pagingNext").button("option", "disabled", false);
    }

    if (tabProperties.overviewPage == 1) {
        $("#img_" + tabProperties.id + " #overviewPrev").button("option", "disabled", true);
    } else {
        $("#img_" + tabProperties.id + " #overviewPrev").button("option", "disabled", false);
    }
    if (tabProperties.overviewStart + vm_number_of_thumbnails_in_overview >= tabProperties.overviewCount) {
        $("#img_" + tabProperties.id + " #overviewNext").button("option", "disabled", true);
    } else {
        $("#img_" + tabProperties.id + " #overviewNext").button("option", "disabled", false);
    }
}

function hidePagingButtons(id) {
    $("#img_" + id + " #pagingFirst").hide();
    $("#img_" + id + " #pagingPrevious").hide();
    $("#img_" + id + " #pagingPagenumber").hide();
    $("#img_" + id + " #nr_of_pages").hide();
    $("#img_" + id + " #pagingNext").hide();
    $("#img_" + id + " #pagingLast").hide();
}

function showPagingButtons(id) {
    $("#img_" + id + " #pagingFirst").show();
    $("#img_" + id + " #pagingPrevious").show();
    $("#img_" + id + " #pagingPagenumber").show();
    $("#img_" + id + " #nr_of_pages").show();
    $("#img_" + id + " #pagingNext").show();
    $("#img_" + id + " #pagingLast").show();
}

function makeThumbnailOverview(tabProperties) {
    $("#img_" + tabProperties.id + " #editButtons").hide();
    $("#img_" + tabProperties.id + " .sizeSlider").show();

    getThumbnailPagerDetails(tabProperties);
}

function showOverlay(tabProperties) {
//    $("#pagingControls").appendTo("#img_" + tabProperties.id);
    $("#vm_content #overlay").remove();

    tabProperties.overlay = true;

    var url = vm_proxy_host_mets + "rest/resource/reference_image?" +
        "metsId=" + getMetsCode() +
        "&pageId=" + tabProperties.page +
        "&angle=" + tabProperties.rotation +
        "&brightness=" + tabProperties.brightness +
        "&contrast=" + tabProperties.contrast +
        "&width=" + pageWidth() +
        "&height=" + (pageHeight() - $("#pagingControls").height()) +
        "&scale=0";

    $("#vm_content").append('<div id = "overlay" class = "overlay"></div>');
    $("#overlay").append('<img class = "overlayImage" src = "' + url + '" alt = "">');
    $("#overlay").append('<img id = "fullscreenclose"  src="' + vm_proxy_host_mets + 'css/images/fullscreencloseicon.png" alt = "">');
    $("#fullscreenclose").css({
        cursor: "pointer",
        display: "inline",
        height: "30px",
        position: "absolute",
        right: "0px",
        top: "0px",
        width: "30px",
        zIndex: 1111
    });

    $("#img_" + tabProperties.id + " #overview").button("option", "disabled", true);
    $("#fullscreenclose").click(function() {
        $("#pagingControls").draggable("destroy");
        $("#pagingControls").insertAfter("#img_" + tabProperties.id + " #editButtons");

//        var pagingTop = vm_height - 60;
        $("#pagingControls").css({top: 0, left: ''});
        $("#overlay").remove();

        tabProperties.overlay = false;

        $("#img_" + tabProperties.id + " #overview").button("option", "disabled", false);
//            $("#pagingControls").css({
//                "width": oldWidth + "px",
//                "left": (vm_width - oldWidth) / 2 + "px"
//            });
        $("#img_" + tabProperties.id + " #overview").show();
        $(document).unbind("mousemove");
    });


    $.getScript(vm_proxy_host_mets + 'js/jquery/js/jquery-ui-1.8.5.custom.min.js', function() {
        $("#img_" + tabProperties.id + " #pagingControls").draggable();
    });




//    $("#img_" + tabProperties.id + " #pagingControls").delay(2000).hide();


    // added 25-11-11


//    $("#overlay").bind("keypress click mousemove", function(event) {
//
//        $("#img_" + tabProperties.id + " #pagingControls").show();
//
//        clearTimeout(timer);
////        $("#pagingControls").stop(true, true);
//        if (event.type == 'click') {
//
//        } else {
//            timer = setTimeout(function() {
//                $("#img_" + tabProperties.id + " #pagingControls").hide()
//            }, 2000);
//        }
//    });
}

// Used for the fullscreen overlay
// Rather complex functions due to browser differences:
// Browser Window Size and Position
// copyright Stephen Chapman, 3rd Jan 2005, 8th Dec 2005
function pageWidth() {
    return window.innerWidth != null ? window.innerWidth : document.documentElement &&
        document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body != null ?
        document.body.clientWidth : null;
}
function pageHeight() {
    return window.innerHeight != null ? window.innerHeight : document.documentElement &&
        document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body != null ?
        document.body.clientHeight : null;
}
