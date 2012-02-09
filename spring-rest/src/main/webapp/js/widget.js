//var tabPropertiesArray = new Array();
//var defaults;
//var defaultsLoaded;
//var canvasWidth;
//var canvasHeight;
//var overlay = false;
//var ZOOM_DEFAULT = 40;
//
//var nrOfTabs = 0;
//var tabId = 0;
//
//var timer;
//
//function getThumbnailPagerDetails(tabProperties) {
//    console.log("widget.js");
//    this.tabProperties = tabProperties;
//
//    $.ajax({
//        type: "GET",
//        url: "rest/document?",
//
//        data: "eadId=" + vm_ead +
//                "&metsId=" + tabProperties.metsId +
//                "&pager.start=" + tabProperties.overviewPage +
//                "&pager.rows=20" +
//                "&pager=true" +
//                "&defaults=false" +
//                "&scale=false",
//
//        context: this,
//        success: function(data) {
//            this.tabProperties.thumbnailList = data.document.pager.pages;
//            makeThumbnailHtml(this.tabProperties);
//
//        },
//        timeout: 30000,
//        error: function(x, e) {
//        }
//        ,
//        dataType: "jsonp"
//    });
//}
//
//function makeThumbnailHtml(tabProperties) {
//    var size = tabProperties.thumbnailZoom;
////tabProperties.returnedRows = data.document.pager.pages.page.length;
//    tabProperties.returnedRows = tabProperties.thumbnailList.page.length;
//    $("#img_" + tabProperties.id).html('<div class="breadcrumb">' + tabProperties.breadcrumb + '>' + tabProperties.title + '</div>');
//
//    $.each(tabProperties.thumbnailList.page, function (i, v) {
//        $("#img_" + tabProperties.id).append('<a href="#"><img class="overviewThumbnail" src="'
//                + this.url
//                + '&zoom=' + size + '"/></a>');
//        $("#img_" + tabProperties.id + " a:last").bind('click', {page: i}, function(event) {
//            tabProperties.overview = false;
//            tabProperties.page = event.data.page + 1; //using event.data prevents closure issues
//            $("#editButtons_" + tabProperties.id).show();
//            showBigImage(tabProperties);
//        });
//    });
//
//
//    if (tabProperties.overviewPage == 1) {
//        $("#tab_" + tabProperties.id + " #overviewPager").html('Prev <a href="" id="overviewNext">Next</a>');
//    } else if (tabProperties.thumbnailList.page.length < 20) {
//        $("#tab_" + tabProperties.id + " #overviewPager").html('<a href="" id="overviewPrev">Prev</a> Next');
//    } else {
//        $("#tab_" + tabProperties.id + " #overviewPager").html('<a href="" id="overviewPrev">Prev</a> <a href="" id="overviewNext">Next</a>');
//    }
//
//    $("#tab_" + tabProperties.id + " #overviewPrev").click(function(event) {
//        event.preventDefault();
//        tabProperties.overviewPage -= 20;
//        getThumbnailPagerDetails(tabProperties);
//    });
//    $("#tab_" + tabProperties.id + " #overviewNext").click(function(event) {
//        event.preventDefault();
//        tabProperties.overviewPage += 20;
//        getThumbnailPagerDetails(tabProperties);
//    });
//
//}
//
//function makeThumbnailOverview(tabProperties) {
//    $("#tab_" + tabProperties.id + " #overviewPager").empty();
//
//    $("#editButtons_" + tabProperties.id).hide();
//    $('#tab_' + tabProperties.id + ' .sizeSlider').show();
//    $("#tab_" + tabProperties.id + " #overviewPager").show();
//
//    getThumbnailPagerDetails(tabProperties);
//}
//
//
//function makeTeasers(data) {
//    $("div#tab_teasers").html('');
//    //
//    var breadcrumbs = "";
//    var txtbreadcrumb = "";
//    if (data.toc.breadcrumbs != undefined) {
//        $("a#teasers").text(data.toc.breadcrumbs[data.toc.breadcrumbs.length - 1].title);
//        $.each(data.toc.breadcrumbs, function(i, val) {
//            var shortTitle;
//            //if(this.title.length > 25) title = this.title.substring(0,25) + '...';
//            //console.log(this.title);
//            //console.log(this.title.length);
//
//            if(this.title.length > 25){
//
//                shortTitle = this.title.substring(0,25) + '...';
//            } else {
//                shortTitle = this.title;
//            }
//            breadcrumbs += '<a href="' + shortTitle + '" title="' + this.title + '" class="breadcrumb" rel="' + this.index + '">' + shortTitle + '</a> > ';
//            txtbreadcrumb += this.title + ' > ';
//        });
//    } else{
//        $("a#teasers").text("Table Of Contents");
//    }
//
//    $.each(data.toc.folder, function(i, val) {
//        var shortTitle;
//        var teaserId = "teaserHolder" + i;
//        var buttLeftId = "buttonLeft" + i;
//        var buttRightId = "buttonRight" + i;
//        var scrollWrapperId = "scrollWrapper" + i;
//        var scrollAreaId = "scrollableArea" + i;
//        var title = this.title;
//        if(this.title.length > 25){
//            shortTitle = this.title.substring(0,25) + '...';
//        } else {
//            shortTitle = this.title;
//        }
//        var breadcrumbTotal = breadcrumbs + '<a href="' + shortTitle + '" title="' + this.title + '" class="breadcrumb" rel="' + this.index + '">' + shortTitle + '</a>';
//        var txtbreadcrumbTotal = txtbreadcrumb + this.title;
//
//
//        $("div#tab_teasers").append('<div class = "teaserHolder" id = "' + teaserId + '" > </div>');
//        $("#" + teaserId).append(breadcrumbTotal);
//        $("#" + teaserId).append('<div id = "' + buttLeftId + '" class = "scrollingHotSpotLeft" > </div>');
//        $("#" + teaserId).append('<div id = "' + buttRightId + '" class = "scrollingHotSpotRight" > </div>');
//        $("#" + teaserId).append('<div id = "' + scrollWrapperId + '"class = "scrollWrapper" > </div>');
//        $("#" + scrollWrapperId).append('<div id = "' + scrollAreaId + '" class = "scrollableArea" > </div>');
//
//        var lastLoaded;
//        $.each(data.toc.folder[i].item, function(i, val) {
//        var url = "rest/resource/thumbnail_image?eadId=" + vm_ead +
//            "&metsId=" + this.metsId +
//            "&pageId=" + vm_default_thumbnailpage +
//            "&zoom=100" +
//            "&width=100";
//
//            if (i == 20) return false;
//            $("#" + scrollAreaId).append('<a href="#" rel="' + this.url + '"><img title="' + this.title +'" src="' + url + '" width=100/></a>');
//            lastLoaded = url;
//
//            $("#" + scrollAreaId + " a:last").click(function () {
//                buildDetailTab(val.metsId, val.title, 1, txtbreadcrumbTotal); // '1' -> start with page 1
//            });
//        });
//// Start Smoothdivscroll script only AFTER all images are loaded
//        $('img[src*=' + lastLoaded + ']').load(function() {
//            $.getScript('js/SmoothDivScroll-1.1/js/jquery.smoothDivScroll-1.1.js', function(){
//                $("div#" + teaserId).smoothDivScroll({scrollWrapper: "div#" + scrollWrapperId,
//                    autoScroll: "onstart",
//                    autoScrollDirection: "left",
//                    visibleHotSpots: "always"});
//            });
//        });
//    });
//
//    $(".breadcrumb").click(function(event) {
//        event.preventDefault();
//        var folder = $('[id=' + $(this).attr("href").substring(0, 16) + ']');
//        //var folder = $('[id=' + event.currentTarget. + ']');
//
//        var folderId = folder.attr("rel");
//        open(folder.parent(), folderId);
//    });
//    addTab("teasers", "Table of Contents");
//}
//
//function tabExists(id) {
//    return ($("#contentTabs #" + id).length != 0);
//}
//
//function addTab(id, title) {
//// hide other tabs
//    $("#contentTabs li").removeClass("current");
//    $("#contentMain .content").hide();
//    $("#menu .menuBottom").hide();
//
//    if (title.length > 20) title = title.substring(0, 20) + '...';
//
//    if (id == "teasers") {
//        if (!tabExists(id)) {
//            $("#contentTabs").append("<li class = 'current'><a class = 'tab' id = '" + id + "' href='#'>" + title + "</a></li>");
//            $("#contentMain #tab_teasers").show();
//        } else {
//            $("#contentMain #tab_teasers").show();
//            $("a#teasers").parent().addClass("current")
//        }
//    } else {
//        buildBottomTabs();
//        $("#contentTabs").append("<li class = 'current'><a class = 'tab' id = '" + id + "' href='#'>" + title + "</a></li>");
//        $("#contentTabs li.current").append('<a href="#" class="remove"><img id="closeicon" src="css/images/opblauwcloseicon.png" alt=""></a>');
//        $("#contentMain #tab_" + id).show();
//    }
//}
//
//
//function setTabClickEvents() {
//    $('#contentTabs a.tab').live('click', function() {
//// Get the tab name
//        console.log(this);
//        var tabid = $(this).attr("id");
//
//// hide all other tabs
//        $("#menu .menuBottom").hide();
//
//        $("#contentMain .content").hide();
//        $("#contentTabs #closeicon").attr("src", "css/images/opwitcloseicon.png");
//        $("#contentTabs li").removeClass("current");
//        $("#contentTop .toolbar").hide();
//
//// show current tab
//        $("#contentMain #tab_" + tabid).show();
//
//        $("#menuBottom_" + tabid).show();
//        $(this).parent().addClass("current");
//        $("#contentTabs .current #closeicon").attr("src", "css/images/opblauwcloseicon.png");
//        showEditButtons(tabid);
//    });
//
//    $('#contentTabs a.remove').live('click', function() {
//// Get the tab name
//        var tabid = $(this).parent().find(".tab").attr("id");
//
//// remove tab and related content
//        $("#contentMain #tab_" + tabid).remove();
//        $("#menuBottom_" + tabid).remove();
//
//// remove tab div
//        $(this).parent().remove();
//
//// remove the corresponding edit buttons
//        $("#contentTop #editButtons_" + tabid).remove();
//
//// remove from properties array
//        tabPropertiesArray = $.grep(tabPropertiesArray, function(n, i) {
//            return n.id != tabid;
//        });
//
//
//// if current tab is removed and if there are still tabs left, show the last one
//        if ($("#contentTabs li.current").length == 0 && $("#contentTabs li").length > 0) {
//// find the last tab
//            var lasttab = $("#contentTabs li:last-child");
//            lasttab.addClass("current");
//            $("#contentTabs .current #closeicon").attr("src", "css/images/opblauwcloseicon.png");
//
//// get its link name and show related content
//            var lasttabid = $(lasttab).find("a.tab").attr("id");
//            $("#contentMain #tab_" + lasttabid).show();
//
//            $("#menuBottom_" + lasttabid).show();
//            showEditButtons(lasttabid);
//        }
//        nrOfTabs--;
//    });
//
//}
//
//// hide edit buttons only when in overview mode
//function showEditButtons(tabid) {
//// show edit buttons only when not in overview mode
//    if (tabid != 'teasers') {
//        var properties = $.grep(tabPropertiesArray, function(n, i) {
//            return n.id == tabid;
//        });
//        if (properties[0].overview) {
//            $("#editButtons_" + tabid).hide();
//        } else {
//            $("#editButtons_" + tabid).show();
//        }
//    }
//}
//
//function buildButton(location, tabProperties, icon, func) {
//    $(location).button({
//        text: false,
//        icons: {
//            primary: icon
//        }
//    }).click(function() {
//        func();
//
//    });
//}
//
//function buildEditButtons(tabProperties) {
////using table here to avoid IE inline < div> quirks
//    $("#editButtons").append('<div id = "editButtons_' + tabProperties.id + '" class="ui-widget-header ui-corner-all toolbar">'
//            + '<table><tr><td rowspan = "2" ><button id = "zoomOut">Zoom Out </button></td>'
//            + '<td rowspan = "2"><input id = "' + tabProperties.id + '_zoomLevel" size = "3" value = "100%" > </input></td>'
//            + '<td rowspan = "2"><button id = "zoomIn">Zoom In </button></td>'
//            + '<td rowspan = "2"><button id = "rotateCCW">Rotate CCW </button></td>'
//            + '<td rowspan = "2"><button id = "rotateCW">Rotate CW</button></td>'
//            + '<td rowspan = "2"><button id = "fullscreen">Fullscreen </button></td>'
//            + '<td><img alt = "" src = "js/jquery/css/smoothness/images/helderheid.gif" width = "16" height = "16" / > '
//            + '<td><div class = "editSlider" id = "brightnessSlider"></div></td>'
//            + '<td rowspan = "2" ><button id = "reset">Reset</button></td>'
////            + '<td rowspan = "2" ><button id = "vertaling" >Vertaling</button></td></tr>'
//            + '<tr><td><img alt = "" src = "js/jquery/css/smoothness/images/contrast_transp.gif" width = "16" height = "16"/></td>'
//            + '<td><div class = "editSlider" id = "contrastSlider"></div></td></tr>'
//            + '</table></div>');
//
//    var zoomInput = $("#" + tabProperties.id + "_zoomLevel");
//    zoomInput.keypress(function(event) {
//        if (event.keyCode == '13') {
//            var newZoom = parseInt(zoomInput.val());
//            if (newZoom <= 400 && newZoom >= 10) {
//                tabProperties.zoom = newZoom;
//                showBigImage(tabProperties);
//            } else {
//                alert('Zoom level has to be greater of equal than 10 and smaller than 400');
//            }
//        }
//    });
//
//    function funcZoomOut() {
//        if (tabProperties.zoom > defaults.zoomMin) {
//            tabProperties.zoomOut();
//            showBigImage(tabProperties);
//        }
//    }
//
//    buildButton("#editButtons_" + tabProperties.id + " #zoomOut", tabProperties, "ui-icon-minus", funcZoomOut);
//
//    function funcZoomIn() {
//        if (tabProperties.zoom < defaults.zoomMax) {
//            tabProperties.zoomIn();
//            showBigImage(tabProperties);
//        }
//    }
//
//    buildButton("#editButtons_" + tabProperties.id + " #zoomIn", tabProperties, "ui-icon-plus", funcZoomIn);
//
//    function funcCCW() {
//        tabProperties.rotateCCW();
//        showBigImage(tabProperties);
//    }
//
//    buildButton("#editButtons_" + tabProperties.id + " #rotateCCW", tabProperties, "ui-icon-arrowreturn-1-s", funcCCW);
//
//    function funcCW() {
//        tabProperties.rotateCW();
//        showBigImage(tabProperties);
//    }
//
//    buildButton("#editButtons_" + tabProperties.id + " #rotateCW", tabProperties, "ui-icon-arrowrefresh-1-n", funcCW);
//
//    function funcFullscreen() {
//        showOverlay(tabProperties);
//    }
//
//    buildButton("#editButtons_" + tabProperties.id + " #fullscreen", tabProperties, "ui-icon-arrow-4-diag", funcFullscreen);
//
//// Brightness
//// -100 tot 100, 0 = default
//
//    $("#editButtons_" + tabProperties.id + " #brightnessSlider").slider({
//        value: defaults.brightnessDefault,
//        min: defaults.brightnessMin,
//        max: defaults.brightnessMax,
//        step: 5,
//        change: function(event, ui) {
//            tabProperties.brightness = ui.value;
//            showBigImage(tabProperties);
//        }
//    });
//
//// Contrast
//// van 0 tot 10. 1 is default
//    $("#editButtons_" + tabProperties.id + " #contrastSlider").slider({
//        value: defaults.contrastDefault,
//        min: defaults.contrastMin,
//        max: defaults.contrastMax,
//        step: .2,
//        change: function(event, ui) {
//            tabProperties.contrast = ui.value;
//            showBigImage(tabProperties);
//        }
//    });
//
//
//    $("#editButtons_" + tabProperties.id + " #reset").button({
//
//    }).click(function() {
//        tabProperties.zoom = defaults.zoomDefault;
//        tabProperties.brightness = defaults.brightnessDefault;
//        tabProperties.contrast = defaults.contrastDefault;
//        tabProperties.rotation = defaults.angleDefault;
//        $("#editButtons_" + tabProperties.id + " #brightnessSlider").slider("option", "value", 0);
//        $("#editButtons_" + tabProperties.id + " #contrastSlider").slider("option", "value", 1);
//        showBigImage(tabProperties);
//    });
//
////    $("#editButtons_" + tabProperties.id + " #vertaling").button({
////    });
//
////hide other edit buttons
//    $("#contentTop .toolbar").hide();
//
//    $("#editButtons_" + tabProperties.id).show();
//
//}
//
//function loadDefaults(data) {
//    defaults.brightnessMin = parseInt(data.document.defaults.reference_image.brightness.min);
//    defaults.brightnessDefault = parseInt(data.document.defaults.reference_image.brightness.defaults);
//    defaults.brightnessMax = parseInt(data.document.defaults.reference_image.brightness.max);
//
//    defaults.contrastMin = parseInt(data.document.defaults.reference_image.contrast.min);
//    defaults.contrastDefault = parseInt(data.document.defaults.reference_image.contrast.defaults);
//    defaults.contrastMax = parseInt(data.document.defaults.reference_image.contrast.max);
//
//    defaults.zoomMin = parseInt(data.document.defaults.reference_image.zoom.min);
//    defaults.zoomDefault = parseInt(data.document.scale);
//    defaults.zoomMax = parseInt(data.document.defaults.reference_image.zoom.max);
//
//    defaults.zoomOverviewMin = parseInt(data.document.defaults.reference_image.zoom_overview.min);
//    defaults.zoomOverviewDefault = parseInt(data.document.defaults.reference_image.zoom_overview.defaults);
//    defaults.zoomOverviewMax = parseInt(data.document.defaults.reference_image.zoom_overview.max);
//
//    defaults.paddingMin = parseInt(data.document.defaults.reference_image.padding.min);
//    defaults.paddingDefault = parseInt(data.document.defaults.reference_image.padding.defaults);
//    defaults.paddingMax = parseInt(data.document.defaults.reference_image.padding.max);
//
//    defaults.angleDefault = parseInt(data.document.defaults.reference_image.angle.defaults);
//    defaults.angleInterval = data.document.defaults.reference_image.angle.interval;
//    defaultsLoaded = true;
//}
//
//function getPagingDetailsAndDefaults(tabProperties, callback) {
//    this.tabProperties = tabProperties;
//    $.ajax({
//        type: "GET",
//        url: "rest/document?",
//
//        data: "eadId=" + vm_ead +
//                "&metsId=" + tabProperties.metsId +
//                "&pager.start=1" +
//                "&pager.rows=1" +
//                "&pager=true" +
//                "&defaults=true" +
//                "&scale=true" +
//                "&scale.width=" + canvasWidth +
//                "&scale.height=" + canvasHeight +
//                "&scale.pageId=" + vm_default_thumbnailpage,
//
//        context: this,
//        success: function(data) {
//            if (!defaultsLoaded) {
//                this.loadDefaults(data);
//            }
//            this.tabProperties.pageCount = data.document.pager.count;
//            this.tabProperties.zoom = data.document.scale;
//            this.tabProperties.rotation = defaults.angleDefault;
//            this.tabProperties.thumbnailZoom = defaults.zoomOverviewDefault;
//            callback(this.tabProperties);
//        },
//        timeout: 30000,
//        error:function(x, e) {
//        },
//        dataType: "jsonp"
//    });
//}
//
//// Used for the fullscreen overlay
//// Rather complex functions due to browser differences:
//// Browser Window Size and Position
//// copyright Stephen Chapman, 3rd Jan 2005, 8th Dec 2005
//function pageWidth() {
//    return window.innerWidth != null ? window.innerWidth : document.documentElement &&
//            document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body != null ?
//            document.body.clientWidth : null;
//}
//function pageHeight() {
//    return window.innerHeight != null ? window.innerHeight : document.documentElement &&
//            document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body != null ?
//            document.body.clientHeight : null;
//}
//
//
//function showOverlay(tabProperties) {
//    if ("#overlay") $("#overlay").remove();
//    $("#" + tabProperties.id + "_pagingControls").attr('style', 'width: 300px;');
//
//    $("#" + tabProperties.id + "_overview").hide();
//    overlay = true;
//
//    var url = "rest/resource/reference_image?eadId=" + vm_ead +
//            "&metsId=" + tabProperties.metsId +
//            "&pageId=" + tabProperties.page +
//            "&angle=" + tabProperties.rotation +
//            "&brightness=" + tabProperties.brightness +
//            "&contrast=" + tabProperties.contrast +
//            "&width=" + pageWidth() +
//            "&height=" + pageHeight() +
//            "&scale=0";
//
//    $("#contentMain").append('<div id = "overlay" class = "overlay"><img class = "overlayImage" src = "' + url + '" alt = ""></div>');
//
//    $("#" + tabProperties.id + "_pagingControls").delay(2000).animate({
//        bottom: '-=80',
//        width: '300px'
//    }, 500);
//
//    $(document).bind("keypress click mousemove", function(event) {
//        if(event.keyCode == '27'){
//            clearTimeout(timer);
//            $("#overlay").remove();
//            //$("#contentMain #" + "img_" + tabProperties.id).html("");
//            overlay = false;
//            $("#" + tabProperties.id + "_pagingControls").stop(true, true);
//            $("#" + tabProperties.id + "_pagingControls").attr('style', 'bottom: 25px;');
//            $("#" + tabProperties.id + "_overview").show();
//            $(document).unbind("mousemove");
//        }
//
//        if (overlay) {
//            clearTimeout(timer);
//            $("#" + tabProperties.id + "_pagingControls").stop(true, true);
//            $("#" + tabProperties.id + "_pagingControls").attr('style', 'bottom: 25px; width: 300px;');
//            timer = setTimeout(function() {
//                $("#" + tabProperties.id + "_pagingControls").animate({
//                    bottom: '-=80',
//                    width: '300px'
//                }, 500)
//            }, 2000);
//        }
//    });
//}
//
//function showBigImage(tabProperty) {
//    canvasWidth = $("#contentMain").width();
//    canvasHeight = Math.ceil(0.707 * $("#main").height()); // 0.707 is the ratio between the canvas height
//
//    $('#tab_' + tabProperty.id + ' .sizeSlider').hide();
//
//    showPagingButtons(tabProperty);
//    disablePagerButtons(tabProperty);
//
//    $("#tab_" + tabProperty.id + " #overviewPager").hide();
//
//    var url = "rest/resource/reference_image?eadId=" + vm_ead +
//            "&metsId=" + tabProperty.metsId +
//            "&pageId=" + tabProperty.page +
//            "&angle=" + tabProperty.rotation +
//            "&scale=" + tabProperty.zoom +
//            "&brightness=" + tabProperty.brightness +
//            "&contrast=" + tabProperty.contrast +
//            "&width=" + canvasWidth +
//            "&height=" + canvasHeight;
//
////$("#contentMain #" + "img_" + tabProperty.id).html('<img alt="" src="' + url + '">');
//    $("#img_" + tabProperty.id).html(tabProperty.breadcrumb);  // werkt niet
//    $("#img_" + tabProperty.id).append('<div id = "navArea_'
//            + tabProperty.id
//            + '" ><div style = "display:none;" class = "imagesContainer {navPosition:\'BR\', navWidth: 100}">');
//
//    $.getScript('js/imgnavigator/mbImgNav.js',function(){
//        $("#navArea_" + tabProperty.id).imageNavigator({
//            areaWidth: canvasWidth - 20,
//            areaHeight: canvasHeight - 10,
//            draggerStyle:"1px solid black",
//            navOpacity:1.0,
//            imageUrl: url,
//            navWidth: 100,
//            tabId: tabProperty.id
//        });
//    });
//
//    $("#" + tabProperty.id + "_pagingPagenumber").val(tabProperty.page);
//    $("#" + tabProperty.id + "_zoomLevel").val(tabProperty.zoom + '%');
//}
//
//
//function buildPager(tabProperties) {
//    buildEditButtons(tabProperties);
//
//    makeThumbnailOverview(tabProperties);
//
//    //using table here to avoid IE inline div quirks
//    $("div#tab_" + tabProperties.id).append('<div id="' + tabProperties.id + '_pagingControls" class="pagingControls">' +
//            '<div class="pagingToolbar ui-widget-header ui-corner-all pagingtoolbar">' +
//            '<table><tr><td><button id="' + tabProperties.id + '_pagingFirst">First Page</button></td>' +
//            '<td><button id="' + tabProperties.id + '_pagingPrevious">Previous Page</button></td>' +
//            '<td><input id="' + tabProperties.id + '_pagingPagenumber" size="2" value="' + tabProperties.page + '"> </input></td>' +
//            '<td><span id="' + tabProperties.id + '_nr_of_pages"></span><button id="' + tabProperties.id + '_pagingNext">Next Page</button></td>' +
//            '<td><button id="' + tabProperties.id + '_pagingLast">Last Page</button></td>' +
//            '<td><button id="' + tabProperties.id + '_overview">Overview</button></td>' +
//            '<td><img class="sizeSlider" src="js/jquery/css/smoothness/images/minus.png" alt=""></td>' +
//            '<td><div class="editSlider sizeSlider" id="' + tabProperties.id + '_size"></div></td>' +
//            '<td><img class="sizeSlider" src="js/jquery/css/smoothness/images/plus.png" alt=""></td></tr>' +
//            '</table></div></div>');
//
//    // pager:
//    function funcFirst() {
//        tabProperties.firstPage();
//        showBigImage(tabProperties);
//        disablePagerButtons(tabProperties);
//        if (overlay) showOverlay(tabProperties);
//    }
//
//    buildButton("#" + tabProperties.id + "_pagingFirst", tabProperties, "ui-icon-seek-first", funcFirst);
//
//    function funcPrev() {
//        tabProperties.prevPage();
//        showBigImage(tabProperties);
//        disablePagerButtons(tabProperties);
//        if (overlay) showOverlay(tabProperties);
//    }
//
//    buildButton("#" + tabProperties.id + "_pagingPrevious", tabProperties, "ui-icon-triangle-1-w", funcPrev);
//    $("#" + tabProperties.id + "_nr_of_pages").html('/ ' + tabProperties.pageCount + ' ');
//
//    function funcNext() {
//        tabProperties.nextPage();
//        showBigImage(tabProperties);
//        disablePagerButtons(tabProperties);
//        if (overlay) showOverlay(tabProperties);
//    }
//
//    buildButton("#" + tabProperties.id + "_pagingNext", tabProperties, "ui-icon-triangle-1-e", funcNext);
//
//    function funcLast() {
//        tabProperties.lastPage();
//        showBigImage(tabProperties);
//        disablePagerButtons(tabProperties);
//        if (overlay) showOverlay(tabProperties);
//    }
//
//    buildButton("#" + tabProperties.id + "_pagingLast", tabProperties, "ui-icon-seek-end", funcLast);
//
//    var input = $("#" + tabProperties.id + '_pagingPagenumber');
//    input.keypress(function(event) {
//        if (event.keyCode == '13') { // return button
//            tabProperties.page = input.val();
//            showBigImage(tabProperties);
//            if (overlay) showOverlay(tabProperties);
//        }
//    });
//
//    disablePagerButtons(tabProperties);
////$('#' + tabProperties.id + '_size').hide();
//
//    $("#" + tabProperties.id + "_overview").button({
//        text: true
//    }).click(function() {
//        if (!tabProperties.overview) {
//            //var tabDiv = $(this).closest('div[id*="tab"]');
//            tabProperties.overview = true;
//            hidePagingButtons(tabProperties);
//            makeThumbnailOverview(tabProperties);
//        } else {
//            tabProperties.overview = false;
//            $("#editButtons_" + tabProperties.id).show();
//            showBigImage(tabProperties);
//        }
//    });
//
//    $("#" + tabProperties.id + "_size").slider({
//        value: defaults.zoomOverviewDefault,
//        min: defaults.zoomOverviewMin,
//        max: defaults.zoomOverviewMax,
//        step: 10,
//        change: function(event, ui) {
//            var tabDiv = $(this).closest('div[id*="tab"]');
//            tabProperties.thumbnailZoom = ui.value;
//            makeThumbnailOverview(tabProperties);
//        }
//    });
//
//    hidePagingButtons(tabProperties);
//}
//
//
//// builds a new div, and adds it to a new tab
//function buildDetailTab(metsId, title, page, breadcrumb) {
//    var tabProperties = new TabProperties(tabId);
//    tabProperties.title = title;
//    tabProperties.page = page;
//    tabProperties.metsId = metsId;
//    tabProperties.breadcrumb = breadcrumb;
//    canvasWidth = $("#contentMain").width();
//    canvasHeight = Math.ceil(0.707 * $("#main").height()); // 0.707 is the ratio between the canvas height
//
//    tabPropertiesArray[nrOfTabs] = tabProperties;
//    tabProperties.overviewPage = 1;
//
//    $("#content").append('<div id = "tab_' + tabId + '" class = "content"></div>');
//    $("#content #tab_" + tabId).append('<div id = "img_' + tabProperties.id + '" class = "image"></div>');
//    $("#content #tab_" + tabId).append('<div id = "overviewPager"></div>');
//
//    addTab(tabProperties.id, tabProperties.title);
//    nrOfTabs++;
//    tabId++;
//
//    getPagingDetailsAndDefaults(tabProperties, buildPager);
//}
//
//function buildBottomTabs(){
//         $("#menu").append('<div id ="menuBottom_' + tabId + '" class="menuBottom">' +
//                             '<div id="metaData">' +
//                                '<ul>' +
//                                    '<li><a href="#tabMetadata_'+ tabId +'">Metadata</a></li>' +
//                                    '<li><a href="#tabInfo_'+ tabId +'">Info</a></li>' +
////                                    '<li><a href="#tabNotes_'+ tabId +'">Kladblok</a></li>' +
//                                '</ul>' +
//                                '<div id="tabMetadata_'+ tabId +'">' +
//                                '<div id="tabInfo_'+ tabId +'">' +
//                                    '<p>Info</p>');
//                       $("#menuBottom_" + tabId + " #metaData").tabs();
//
//}
//
//function disablePagerButtons(tabProperties) {
//    if (tabProperties.page == 1) {
//        $("#" + tabProperties.id + "_pagingFirst").button("option", "disabled", true);
//        $("#" + tabProperties.id + "_pagingPrevious").button("option", "disabled", true);
//    } else {
//        $("#" + tabProperties.id + "_pagingFirst").button("option", "disabled", false);
//        $("#" + tabProperties.id + "_pagingPrevious").button("option", "disabled", false);
//    }
//    if (tabProperties.page == tabProperties.pageCount) {
//        $("#" + tabProperties.id + "_pagingLast").button("option", "disabled", true);
//        $("#" + tabProperties.id + "_pagingNext").button("option", "disabled", true);
//    } else {
//        $("#" + tabProperties.id + "_pagingLast").button("option", "disabled", false);
//        $("#" + tabProperties.id + "_pagingNext").button("option", "disabled", false);
//    }
//}
//
//
//function hidePagingButtons(tabProperties) {
//    $("#" + tabProperties.id + "_pagingFirst").hide();
//    $("#" + tabProperties.id + "_pagingPrevious").hide();
//    $("#" + tabProperties.id + "_pagingPagenumber").hide();
//    $("#" + tabProperties.id + "_nr_of_pages").hide();
//    $("#" + tabProperties.id + "_pagingNext").hide();
//    $("#" + tabProperties.id + "_pagingLast").hide();
//}
//
//function showPagingButtons(tabProperties) {
//    $("#" + tabProperties.id + "_pagingFirst").show();
//    $("#" + tabProperties.id + "_pagingPrevious").show();
//    $("#" + tabProperties.id + "_pagingPagenumber").show();
//    $("#" + tabProperties.id + "_nr_of_pages").show();
//    $("#" + tabProperties.id + "_pagingNext").show();
//    $("#" + tabProperties.id + "_pagingLast").show();
//}
//
//
//function loadCssFile(cssFile){
//    $("head").append("<link>");
//    css = $("head").children(":last");
//
//    css.attr({
//        type: 'text/css',
//        rel: 'stylesheet',
//        href: cssFile
//    });
//}
//
//
//function loadCss(){
//    loadCssFile('js/jquery/css/smoothness/jquery-ui-1.8.5.custom.css');
//    loadCssFile('css/wireframe.css');
//    loadCssFile('css/annetta.css');
//    loadCssFile('js/SmoothDivScroll-1.1/css/smoothDivScroll.css');
//    loadCssFile('js/jqueryFileTree/jqueryFileTree.css');
//    loadCssFile('js/imgnavigator/mbImgNav.css');
//}
//
//function buildWireframeHtml(){
//    $('body').html('<div id="main"></div>');
//    $('#main').append('<div id="menu"></div>');
//    $('#menu').append('<div id="menuTop"></div>');
//    $('#menuTop').append('<div id="logo">Versie: 18-05-2011</div>');
//    $('#menuTop').append('<div id="fileTree"></div>');
//    $('#main').append('<div id="content"></div>');
//    $('#content').append('<div id="contentTop"></div>');
//    $('#contentTop').append('<div id="editButtons"></div>');
//    $('#contentTop').append('<div id="archiveName"></div>');
//    $('#archiveName').append('<h2>Dora Russell</h2>');
//
//    $('#content').append('<div id="contentTab"></div>');
//    $('#contentTab').append('<ul id="contentTabs"></ul>');
//    $('#contentTab').append('<div id="contentMain"></div>');
//    $('#contentMain').append('<div id="tab_teasers" class="content" style="overflow:auto"></div>');
//}
//
//// Main method
//$(document).ready(function() {
//    buildWireframeHtml();
//    loadCss();
//
//    $('body').css({
//        width : vm_width,
//        height : vm_height
//    });
//
//
//    $.getScript('js/jquery/js/jquery-ui-1.8.5.custom.min.js',function(){
//        $('#menu').resizable({
//            maxHeight: '90%',
//            minHeight: '90%',
//            stop: function(event, ui) {
//                        var newWidth = (($('#main').width() - ui.size.width)) / $('#main').width() * 100 ;
//                        newWidth -= 4;
//                        $('#content').css({width : newWidth + '%'})
//                    }
//        });
//    });
//
//
//    $.getScript('js/TabProperties.js');
//    $.getScript('js/Defaults.js',function(){
//        defaults = new Defaults();
//    });
//
//    defaultsLoaded = false;
//
//
//    // and main window height, since we're using
//    // relative sizes
//
//    // Make the tabs clickable
//    setTabClickEvents();
//
//
//
//    // Make tree, fileTree calls makeTeasers()
//    $.getScript('js/jqueryFileTree/jqueryFileTree.js',function(){
//        filetree($('#fileTree'));
//    });
//
//
//
//    // setting global key handlers
//    $(document).keydown(function(event) {
//        var currentId = $('#contentTabs').find('li.current').find("a.tab").attr('id');
//        var propertiesTmp = $.grep(tabPropertiesArray, function(n, i) {
//            return n.id == currentId;
//        });
//        var properties = propertiesTmp[0];  // $.grep returns an array so this step is needed.
//
//        if (currentId != 'teasers' && !properties.overview) {
//            //37 l-arrow
//            //39 r-arrow
//            if (event.keyCode == '37') {   //l-arrow
//                properties.prevPage();
//                disablePagerButtons(properties);
//                showBigImage(properties);
//                if (overlay) showOverlay(properties);
//            }
//
//            if (event.keyCode == '39') {       //r-arrow
//                properties.nextPage();
//                disablePagerButtons(properties);
//                showBigImage(properties);
//                if (overlay) showOverlay(properties);
//            }
//
//            if (event.keyCode == '107') {        //plus
//                properties.zoomIn();
//                showBigImage(properties);
//            }
//            if (event.keyCode == '109') {       //minus
//                properties.zoomOut();
//                showBigImage(properties);
//            }
//        }
//    });
//
////    $(window).resize(function() {
////        var currentId = $('#contentTabs').find('li.current').find("a.tab").attr('id');
////        var propertiesTmp = $.grep(tabPropertiesArray, function(n, i) {
////            return n.id == currentId;
////        });
////        var properties = propertiesTmp[0];  // $.grep returns an array so this step is needed.
////        console.log(propertiesTmp[0]);
////        if (currentId != 'teasers' && !properties.overview) {
////                getPagingDetailsAndDefaults(properties,showBigImage);
////        }
////    });
//});
//
//
//
