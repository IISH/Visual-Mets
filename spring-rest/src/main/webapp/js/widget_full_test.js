var tabPropertiesArray = new Array();
var defaults;
var defaultsLoaded;
var canvasWidth;
var canvasHeight;
var overlay = false;

var nrOfTabs = 0;
var tabId = 0;
var MAX_NR_TEASERS = 20;
var oldvmStartpage = 0;

function shortenString(string) {
    if (string.length > 25) {
        return string.substring(0, 25) + '...';
    } else {
        return string;
    }
}

function makeTeasers(data) {
    $("div#tab_teasers").html('');
    //
    var breadcrumbs = "";
    if (data.toc.breadcrumbs != undefined) {
        $("a#teasers").text(shortenString(data.toc.breadcrumbs[data.toc.breadcrumbs.length - 1].title));
        $.each(data.toc.breadcrumbs, function(i, val) {
            var shortTitle = shortenString(this.title);

            breadcrumbs += '<a href="' + shortTitle + '" title="' + this.title + '" class="breadcrumb general" rel="' + this.index + '">' + this.title + '</a> > ';
        });
    } else {
        $("a#teasers").text("Inventory");
    }


    if (data.toc.docs != undefined) {
        $("div#tab_teasers").append('<div class = "teaserHolder" id = "docs" > </div>');
        //$("#docs").append('<div class="general"><a class="breadcrumb general" href="' + shortenString(docBreadcrumb.title) + '" rel="' + docBreadcrumb.index + '"> ' + docBreadcrumb.title + '</a></div>');
        $("#docs").append('<div class="general">' + breadcrumbs.substring(0, breadcrumbs.length - 2) + '</div>');
        $("#docs").append('<div id = "docsButtonLeft" class = "scrollingHotSpotLeft" > </div>');
        $("#docs").append('<div id = "docsButtonRight" class = "scrollingHotSpotRight" > </div>');
        $("#docs").append('<div id = "docsScrollWrapper" class = "scrollWrapper" > </div>');
        $("#docsScrollWrapper").append('<div id = "docsScrollableArea" class = "scrollableArea" > </div>');

        $.each(data.toc.docs[0].item, function(i, val) {
            var url = this.url;
            $("#docsScrollableArea").append('<a class="general" href="#" rel=""><img title="' + this.title + '" src="' + url + '" width=80/></a>');

            $("#docsScrollableArea a:last").click(function (e) {
                e.preventDefault();
                buildDetailTab(val.metsId, val.title, 1, breadcrumbs.substring(0, breadcrumbs.length - 2)); // '1' -> start with page 1
            });
        });
    }

//    $.getScript(vm_proxy_host_mets + 'js/SmoothDivScroll-1.1/js/jquery.smoothDivScroll-1.1.js', function() {
//        $("div#docs").smoothDivScroll({
//            scrollWrapper: "div#docsScrollWrapper",
//            autoScroll: "onstart",
//            autoScrollDirection: "left",
//            visibleHotSpots: "always"
//        });
//    });

    $.each(data.toc.folder, function(i, val) {
        var shortTitle = shortenString(this.title);
        var teaserId = "teaserHolder" + i;
        var buttLeftId = "buttonLeft" + i;
        var buttRightId = "buttonRight" + i;
        var scrollWrapperId = "scrollWrapper" + i;
        var scrollAreaId = "scrollableArea" + i;
        var title = this.title;

        var breadcrumbTotal = breadcrumbs + '<a href="' + shortTitle + '" title="' + this.title + '" class="breadcrumb general" rel="' + this.index + '">' + this.title + '</a>';

        $("div#tab_teasers").append('<div class = "teaserHolder" id = "' + teaserId + '" > </div>');
        $("#" + teaserId).append(breadcrumbTotal);

        $("#" + teaserId).append('<div id = "' + buttLeftId + '" class = "scrollingHotSpotLeft" > </div>');
        $("#" + teaserId).append('<div id = "' + buttRightId + '" class = "scrollingHotSpotRight" > </div>');
        $("#" + teaserId).append('<div id = "' + scrollWrapperId + '"class = "scrollWrapper" > </div>');
        $("#" + scrollWrapperId).append('<div id = "' + scrollAreaId + '" class = "scrollableArea" > </div>');

        var lastLoaded;

        $.each(data.toc.folder[i].item, function(i, val) {
            var url = this.url;

            if (i == MAX_NR_TEASERS) return false;
            $("#" + scrollAreaId).append('<a class="general" href="#" rel=""><img title="' + this.title + '" src="' + url + '" width=80/></a>');
            lastLoaded = url;

            $("#" + scrollAreaId + " a:last").click(function (e) {
                e.preventDefault();
                buildDetailTab(val.metsId, val.title, 1, breadcrumbTotal); // '1' -> start with page 1
            });
        });

//        $.getScript(vm_proxy_host_mets + 'js/SmoothDivScroll-1.1/js/jquery.smoothDivScroll-1.1.js', function() {
//            $("div#" + teaserId).smoothDivScroll({
//                scrollWrapper: "div#" + scrollWrapperId,
//                autoScroll: "onstart",
//                autoScrollDirection: "left",
//                visibleHotSpots: "always"
//            });
//        });
    });

    setTimeout(function() {
        a();
    }, 1000);

    function a() {
        $.each(data.toc.folder, function(i, val) {
            var teaserId = "teaserHolder" + i;
            var scrollWrapperId = "scrollWrapper" + i;
            $.getScript(vm_proxy_host_mets + 'js/SmoothDivScroll-1.1/js/jquery.smoothDivScroll-1.1.js', function() {
                $("div#" + teaserId).smoothDivScroll({
                    scrollWrapper: "div#" + scrollWrapperId,
                    autoScroll: "onstart",
                    autoScrollDirection: "left",
                    visibleHotSpots: "always"
                });
            });
        });
    }

    $(".breadcrumb").click(function(event) {
        event.preventDefault();
        var rel = $(this).attr("rel");
        var folder = $("[rel='" + rel + "']");
        //var folder = $('[id=' + event.currentTarget. + ']');
        var folderId = folder.attr("rel");
        open(folder.parent(), folderId);
    });
    addTab("teasers", "Table of Contents");

}

function tabExists(id) {
    return ($("#contentTabs #" + id).length != 0);
}

function addTab(id, title) {
// hide other tabs
    $("#content li").removeClass("current");
    $("#content .content").hide();
    //$("#menu .menuBottom").hide();

    if (title.length > 20) title = title.substring(0, 20) + '...';
    if (id == "teasers") {
        if (!tabExists(id)) {
            $("#contentTabs").append('<li class = "current teasers"><a class = "tab" id = "teasers" href="#" style="padding-top: 3px;" >' + title + '</a></li>');
            $("#content #tab_teasers").show();
        } else {
            $("#content #tab_teasers").show();
            $("a#teasers").parent().addClass("current")
        }
    } else {
        //buildBottomTabs();
        $("#contentTabs").append("<li class = 'current'><a class = 'tab' id = '" + id + "' href='#'>" + title + "</a></li>");
        $("#contentTabs li.current").append('<a href="#" class="remove"><img id="closeicon" src="' + vm_proxy_host_mets + 'css/images/opblauwcloseicon.png" alt=""></a>');
        $("#content #tab_" + id).show();
    }
}


function setTabClickEvents() {
    $('#content a.tab').live('click', function() {
        // Get the tab name
        var tabid = $(this).attr("id");
        // hide all other tabs

        $(".content").hide();
        $("#content #closeicon").attr("src", vm_proxy_host_mets + "css/images/opwitcloseicon.png");
        $("#content li").removeClass("current");
        $("#content .toolbar").hide();

        // show current tab
        $("#content #tab_" + tabid).show();
        $(this).parent().addClass("current");
        $("#content .current #closeicon").attr("src", vm_proxy_host_mets + "css/images/opblauwcloseicon.png");
        //showEditButtons(tabid);
    });

    $('#content a.remove').live('click', function() {
        // Get the tab name
        var tabid = $(this).parent().find(".tab").attr("id");

        // remove tab and related content
        $("#content #tab_" + tabid).remove();

        // remove tab div
        $(this).parent().remove();

        // remove the corresponding edit buttons
        //$("#content #editButtons_" + tabid).remove();

        // remove from properties array
        tabPropertiesArray = $.grep(tabPropertiesArray, function(n, i) {
            return n.id != tabid;
        });

        // if current tab is removed and if there are still tabs left, show the last one
        if ($("#content li.current").length == 0 && $("#content li").length > 0) {
            // find the last tab
            var lasttab = $("#content li:last-child");
            lasttab.addClass("current");
            $("#content .current #closeicon").attr("src", vm_proxy_host_mets + "css/images/opblauwcloseicon.png");

            // get its link name and show related content
            var lasttabid = $(lasttab).find("a.tab").attr("id");
            $("#content #tab_" + lasttabid).show();
            //showEditButtons(lasttabid);
        }
        nrOfTabs--;
    });

}

// builds a new div, and adds it to a new tab
function buildDetailTab(metsId, title, page, breadcrumb) {
    var tabProperties = new TabProperties();
    tabProperties.title = title;
    tabProperties.id = tabId;
    tabProperties.page = page;
    tabProperties.metsId = metsId;
    tabProperties.breadcrumb = breadcrumb;
    canvasWidth = $("#content").width();
    canvasHeight = Math.ceil(0.707 * $("#main").height()); // 0.707 is the ratio between the canvas height

    tabPropertiesArray[nrOfTabs] = tabProperties;
    tabProperties.overviewPage = 1;

    $("#content").append('<div id = "tab_' + tabId + '" class = "content"></div>');
    $("#content #tab_" + tabId).append('<div id = "img_' + tabProperties.id + '" class = "image"></div>');

    $("#content #img_" + tabId).append('<div id = "testDirectLink_' + tabProperties.id + '"><a href="">link</a>&nbsp;</div> ');
    $("#testDirectLink_" + tabProperties.id).css('top', '484px');
    $("#testDirectLink_" + tabProperties.id).css('position', 'relative');

    $("#testDirectLink_" + tabId).append('<a href="">i</a>');


    $("#content #testDirectLink_" + tabId + " a:first").click(function (e) {
        e.preventDefault();
        var document = $(".nochildren-expanded").children().attr("rel");
        if (document == undefined) document = "";
        var directLink = "?&document=" + document + "&metsId=" + metsId + "&page=" + page + "&title=" + title;
        alert(directLink);
    });
    $("#content #testDirectLink_" + tabId + " a:last").click(function (e) {
        e.preventDefault();
        var directLink = "Test: (c) 2012 IISG Amsterdam www.iisg.nl";
        alert(directLink);
    });


    addTab(tabProperties.id, tabProperties.title);
    nrOfTabs++;
    tabId++;

    getPagingDetailsAndDefaults(tabProperties);
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

function doGlobalSearch() {
    var tempTabId = tabId;
    var globalSearchString = $("#globalSearchField").val();
    if (!globalSearchString) {
        return false;
    }

    // NEW GCU
    if (!vm_search) {
        return false;
    }

    $("#content").append('<div id = "tab_' + tabId + '" class = "content"></div>');
    //$("#content #tab_" + tabId).append('<div id = "img_' + tabProperties.id + '" class = "image"></div>');

    // NEW GCU
    var searchUrl = "";
    var searchParameter = "";
    if (vm_search != "") {
        searchUrl = vm_search.split(/\?(.+)/)[0] + "?";
        searchParameter = vm_search.split(/\?(.+)/)[1];
    }

    $.ajax({
        type: "GET",
        //url: "http://api.iisg.nl/solr/ziegler/srw?",
        //data: 'query=cql.serverChoice="' + globalSearchString + '"&version=1.1&operation=searchRetrieve&recordSchema=info:srw/schema/1/ziegler-v1.1&maximumRecords=10&startRecord=1&resultSetTTL=300&recordPacking=xml&stylesheet=',
        // NEW GCU
        url: searchUrl,
        data: searchParameter.replace("::SEARCH::", globalSearchString),
        success: function (data) {
            if (data.result == undefined) {
                $("#content #tab_" + tempTabId).append('<div id = "globalSearchResults"><p>No results found...</p></div>');
            } else if (data.result.length == undefined) {
                $("#content #tab_" + tempTabId).append('<div id = "globalSearchResults"><p><a href="#"><img src="' + data.result.thumbnail + '"></a></p></div>');
                $("#content #tab_" + tempTabId + " a:last").click(function (e) {
                    e.preventDefault();
                    buildDetailTab(data.result.url, data.result.title, 1, '');
                });
            } else {
//                    $("#content #tab_" + tabId).append('<div id = "globalSearchResults"><p>No results found...</p></div>');

                $.each(data.result, function(key, value) {
                    //$("#content #tab_" + tabId).append('<div id = "globalSearchResults"><p>+ value +</p></div>');
                    //$("#content #tab_" + tabId).append('<div id = "globalSearchResults"><p>test</p></div>');
                    $("#content #tab_" + tempTabId).append('<div id = "globalSearchResults"><p><a href="#"><img src="' + value.thumbnail + '"></a></p></div>');
                    $("#content #tab_" + tempTabId + " a:last").click(function (e) {
                        e.preventDefault();
                        buildDetailTab(value.url, value.title, 1, '');
                    });
                });
            }
        },
        dataType: "jsonp"
    });
    var t = new TabProperties();
    t.id = tempTabId;
    tabPropertiesArray[nrOfTabs] = t;
    addTab(tempTabId, "Search Results");     //
    nrOfTabs++;
    tabId++;
}


function loadCss() {
    loadCssFile(vm_proxy_host_mets + 'js/jquery/css/smoothness/jquery-ui-1.8.5.custom.css');
    loadCssFile(vm_proxy_host_mets + 'css/wireframeShared.css');
    loadCssFile(vm_proxy_host_mets + 'css/wireframeFull.css');
    loadCssFile(vm_proxy_host_mets + 'css/annetta.css');
    loadCssFile(vm_proxy_host_mets + 'js/SmoothDivScroll-1.1/css/smoothDivScroll.css');
    loadCssFile(vm_proxy_host_mets + 'js/jqueryFileTree/jqueryFileTree.css');
}


function a(breadcrumbs) {
    $.each(breadcrumbs, function() {
        var a = $("[id='" + this.title.substring(0, 16) + "']").parent();
        var c = $("#tree [rel='" + this.index + "']").parent();
//                var a = $("#tree [rel='" + this.index + "']");
        var b = this.index;
        open(c, b);
    });
}


function openDocument(folder, metsId, title, page) {

    $.ajax({
        async: false,
        type: "GET",
        url: vm_proxy_host_mets + "rest/archive/toc2",
        data: "eadId=" + vm_ead + "&folderId=" + folder + "&namespace=" + vm_ead_namespace,
        success: function(data) {

            var breadcrumbs = "";
            if (data.toc.breadcrumbs != undefined) {
                $.each(data.toc.breadcrumbs, function(i, val) {
                    var shortTitle = shortenString(this.title);
                    if (i != data.toc.breadcrumbs.length - 1) {
                        breadcrumbs += '<a href="' + shortTitle + '" title="' + this.title + '" class="breadcrumb general" rel="' + this.index + '">' + this.title + '</a> > ';
                    } else {
                        breadcrumbs += '<a href="' + shortTitle + '" title="' + this.title + '" class="breadcrumb general" rel="' + this.index + '">' + this.title + '</a>';
                    }
                });

                setTimeout(function() {
                    a(data.toc.breadcrumbs);
                }, 1000);

            } else {

                breadcrumbs = "";
            }
            var command = "buildDetailTab('" + metsId + "','" + title + "','" + page + "','" + breadcrumbs + "')";

            setTimeout(command, 1000);
            setTimeout("vm_startpage = oldvmStartpage;", 5000);
        },
        timeout: 30000,
        error:function(x, e) {
        }
        ,
        dataType: "jsonp"
    });

}


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

// Main method
$(document).ready(function() {
    loadCss();

    $.getScript(vm_proxy_host_mets + 'js/jquery/js/jquery-ui-1.8.5.custom.min.js', function() {
        $('#tree').resizable({
            handles: 'e',
            minWidth: 145,
            maxWidth: 695,
            stop: function(event, ui) {
                $('#tree #root').remove();
                filetree($('#tree'));
            }
        });
    });

    $.getScript(vm_proxy_host_mets + 'js/imgnavigator/mbImgNavLite.js');


    $("#vm_content").append('<div id="tree"></div>');

    $("#tree").append('<div id="treeTop" style="height: 100px;"></div>');


    $("#vm_content").append('<div id="content"></div>');
    $("#content").append('<div id="contentTop">');
    //$("#contentTop").append('<div id="globalSearch"><input id="globalSearchField"><button id="globalSearchSubmit">Zoeken</button></div>');


    $("#contentTop").append("<div class='title'>" + vm_title + "</div>");
    $("#content").append('<ul id="contentTabs"></ul>');

    $("#content").append('<div id="tab_teasers" class="content F"></div>');

    $.getScript(vm_proxy_host_mets + 'js/jqueryFileTree/jqueryFileTree.js', function() {
        filetree($('#tree'));
    });

    $.ajaxSetup({async: false});
    $.getScript(vm_proxy_host_mets + 'js/widgetLite.js', function() {
        var document = $.getUrlVar('document');
        var metsId = $.getUrlVar('metsId');
        var title = $.getUrlVar('title');
        var page = $.getUrlVar('page');

        if (document != undefined
            && metsId != undefined
            && title != undefined
            && page != undefined) {
            if (vm_startpage != undefined) {
                oldvmStartpage = vm_startpage;
                vm_startpage = page;
            } else {
                vm_startpage = page;
            }

            var command = "openDocument('" + document + "','" + metsId + "','" + title + "','" + page + "')";
            setTimeout(command, 300);
        }


    });
    $.ajaxSetup({async: true});

    setTabClickEvents();


});



