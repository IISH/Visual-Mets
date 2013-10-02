(function ($) {
    NS.Package('NS.App.mets2Viever');
    NS.Package('NS.App.mets2');
    App = NS.App;


    /**
     * ----------------------------------------------------------------------------------------------------
     * for development use de development.html file if you are ready go to
     * /minify/index.php this script will generate a new minified file in /js/mets2viewer.min.js
     *
     * @param option arguments
     * @option language     String          default language set in (en) ISO_3166-1 landcodes format see (nl.lang.js)
     * @option template     String          the html to load if this is not set it will look in the dom (target) for the html
     * @option target       Array|jQuery    jquery selector target to place the viewer
     * @option height       int             height of the viewer default "auto" it will adapt to the parent
     * @option width        int             width of the viewer default "auto" it will adapt to the parent
     * @option debug        boolean         by turning debug mode on it will show console information (firefox, add firebug)
     * @option layout       String          the name reference of the layout that must be present at onload
     * @option layoutConfig Object          it's possible to overwrite event the layout loading behaviour's
     * @option layoutConfig.*
     * @see Controller.LayoutManager, file mets2.layout.manager.js, line 45
     *
     * ----------------------------------------------------------------------------------------------------
     * for all the extend methods, this must be loaded before all other extend methods
     * example:
     * ....................................................................................................
     *
     var viewer = App.mets2Viewer({
        template :'http://visualmets.socialhistoryservices.org/template/template.handler.php?callback=?',
        target : $('#metsViewSample'),
        height : 500,
        width : 900,
        debug  : true,
        layout : 'thumbnail',
        layoutConfig : {
            toFullScreen : {
                'thumbnail' : 'thumbnailFullScreen',
                'page'      : 'pageFullScreen'
            },
            toDefaultScreen   : {
                'thumbnailFullScreen' : 'thumbnail',
                'pageFullScreen'      : 'page'
            },
            toStart : {
                fullScreen    : {
                    'pageFullScreen' : 'thumbnailFullScreen'
                },
                defaultScreen : {
                    'page' : 'thumbnail'
                }
            }
       }
    });

     viewer.init({
        'url'      : 'http://visualmets.socialhistoryservices.org/rest/document?',
        'metsId'   : $('input[name=metsId]').val(),
        'defaults' : true,
        'pager' : {
            'start' : 0,
            'rows'  : -1
        }
    });
     viewer.load();
     * ....................................................................................................
     *
     * @param option arguments
     * @returns {Controller}       the target of the html match viewer jquery selector
     */
    App.mets2Viewer = function (option) {

        var model = new App.mets2.Model(option);
        var view = new App.mets2.View(model);
        return new App.mets2.Controller(model, view);
    };

    /**
     * ----------------------------------------------------------------------------------------------------
     * the jQuery plugin variant the init options is integrated here in a key's value's
     *
     * @param options arguments
     * @option template    String   set the the url for the template handler for getting remotely the template
     * @option debug       Boolean  set debug mode for development                          default "false"
     * @option layout      string   for loading the layout by name see layoutInterface      default "thumbnail"
     *
     * @returns {Controller}   the target of the html match viewer jquery selector
     * ......................................................................
     *
     $('#metsViewSample').mets2Viewer({
        template :'http://visualmets.socialhistoryservices.org/rest/mets2.template.html?callback=?',
        debug  : true,
        layout : 'thumbnail',
        initialize : {
            'url'      : 'http://visualmets.socialhistoryservices.org/rest/document?',
            'metsId'   : $('input[name=metsId]').val(),
            'defaults' : true,
            'pager' : {
                'start' : 0,
                'rows'  : -1
            }
        }
 });
     * ....................................................................................................
     *
     * @param option arguments
     */
    $.fn.extend({
        //This is where you write your plugin's name
        mets2Viewer: function (options) {

            options.target = this;
            options.layout = options.layout || 'thumbnail';
            options.debug = (options.debug == undefined) ? false : options.debug;
            // initialize options
            options.initialize.url = options.initialize.url || 'http://visualmets.socialhistoryservices.org/rest/document?';
            options.initialize.defaults = (options.initialize.defaults == undefined) ? false : options.initialize.defaults;


            //Iterate over the current set of matched elements
            var model = new App.mets2.Model(options);

            var view = new App.mets2.View(model);
            var controller = new App.mets2.Controller(model, view);

            // execute init ...
            controller.init(options.initialize);
            // execute load ...
            controller.load();

            return controller;
        }
    });

    /**
     * the extend method builds methods and objects
     * TODO this has to be rewritten its buget!!!
     * @param arg1  Object|String
     * @param arg2  function        (optional)
     */
    Function.prototype.extend = function (arg1, arg2) {
        arg1 = arg1 || null;
        arg2 = arg2 || null;

        // prototype a method to one of the mvc components
        if (typeof(arg1) === "string" && typeof(arg2) === 'function') {
            this.prototype[arg1] = arg2;
        }
        /**
         * prototype  a object to one of the mvc components,
         * by using deep copy technique of jquery method "extend"
         */
        else if (typeof(arg1) === "object" && arg2 == null) {
            jQuery.extend(true, this.prototype, arg1);
        }
    };

    /**
     * the route method for binding event functionality
     * @param arg1
     * @param arg2
     */
    Function.prototype.route = function (arg1, arg2) {
        arg1 = arg1 || null;
        arg2 = arg2 || null;
        if (typeof(arg1) === 'string' && typeof(arg2) === 'object') {
            if (!this.prototype['events']) {
                this.prototype['events'] = {};
            }
            this.prototype['events'][arg1] = arg2;
        }
    };


    /**
     * mapping functionality to make custom parameters
     * this functionality provide that every written plugin of components
     * can add his own mets2Viewer arguments with default behaviour
     *
     * the param is is array with objects see example below.
     * define with the key the Model[field] and the value (String) the options target

     * sample:
     -------------------------------------------------------------
     App.mets2.Model.map([
     {
         debugMode : 'debug',
         default   : false
     }
     ]);
     ------------------------------------------------------------
     * this will create a field in the model "debugMode" like; Model.debugMode
     * also create a option "target" and is this is not used it will be "default" set on false
     -------------------------------------------------------------
     var viewer = App.mets2Viewer({
        debug : true
    });
     -------------------------------------------------------------
     * now the options "debug" is cerated and will automatically be mapped on "Model.debugMode"
     *
     * @param arg1 array
     */
    Function.prototype.map = function (arg1) {
        for (var i = 0; i < arg1.length; i++) {
            if (!this.prototype['Map']) {
                this.prototype['Map'] = [];
            }
            this.prototype.Map.push(arg1[i]);
        }
    };


    /**
     * interface functionality this is written to help by developing the necessary field and methods
     * correctly implemented
     * @param reference the object reference its object must return methods
     * @param Interface the interface for the object
     * @constructor
     */
    App.mets2.Implement = function (reverence, Interface) {

        var methods = {
            methodExist: function (method) {
                var fount = false;
                var i = 0;
                while (!fount && i < $UT.size(reverence)) {
                    if (reverence[method]) {
                        fount = true;
                    }
                    i++;
                }
                return fount;
            }
        };
        if (App.mets2[Interface]) {
            var interfc = new App.mets2[Interface]();
            if (reverence && !reverence['name']) {
                console.error("INTERFACE EXCEPTION on [" + Interface + "] requires field [name]");
            } else {
                for (var name in interfc) {
                    if (interfc.hasOwnProperty(name)) {

                        if (!methods.methodExist(name) && typeof(interfc[name]) === "function") {
                            console.warn('INTERFACE WARNING, the method [' + name + '] is not yet implemented in to [' + $UT.ucwords(reverence.name) + 'Layout]!');
                            reverence[name] = interfc[name];

                        } else {
                            if (!reverence[name] || (typeof(reverence[name]) !== typeof(interfc[name]))) {
                                console.warn('INTERFACE WARNING, the field {[' + name + ']' + ((!typeof(reverence[name]) !== undefined) ? ':' + typeof(interfc[name]) : '') + '} is not or incorrectly implemented in to  [' + $UT.ucwords(reverence.name) + 'Layout]!');
                                reverence[name] = interfc[name];
                            }
                        }

                    }
                }
            }
        } else {
            console.error("INTERFACE EXCEPTION error, interface [" + Interface + "] dos not exist", App.mets2);
        }
    };


    /**
     * Model
     * @param options arguments
     * @constructor
     */
    App.mets2.Model = function (options) {


        this.frame = []; // frame metsviewer selector
        this.version = 2.2;
        this.url = "";   // main request url

        this.Document = null;  // the documented data object
        this.param = {};    // the request parameters
        this.imageParam = {};    // the request image page parameters
        this.metsId = "";
        this.options = {};

        this.themePath = 'css/themes/';
        this.theme = 'default';

        // argument parser for!
        this.autoOptionMapping(options);

        this.getDocument = function () {
            return this.Document;
        };
        /**
         * set the Document object
         * @see controller.request
         * @param doc Object
         */
        this.setDocument = function (doc) {
            this.Document = doc;
        };
        /**
         * set request parameters
         * @return Object
         */
        this.getParam = function () {
            return this.param;
        };
        /**
         * set request parameters,
         * @see controller.init
         * @param param
         * @return void
         */
        this.setParam = function (param) {
            this.param = param;
        };
        /**
         * active debug mode for viewing console information
         * @returns boolean
         */
        this.isDebugActive = function () {
            return this.debugMode;
        };
        /**
         * get the request url
         * @returns String
         */
        this.getUrl = function () {
            return this.url;
        };

        /**
         * set the request url
         * @see controller.load
         * @returns void
         */
        this.setUrl = function (url) {
            this.url = url;
        };

        /**
         * add parameters to the image request url
         * @param param
         * @return void
         */
        this.addParamToImage = function (param) {
            this.imageParam = $.extend(this.imageParam, param);
        };

        /**
         * this function allows to reset images parameters by removing them
         */
        this.resetParamImage = function () {
            this.imageParam = {};
        };

        /**
         * get the image parameters
         * @return param Object
         */
        this.getImageParam = function () {
            return this.imageParam;
        };

        /**
         * get (img) page the page url
         * Notice! the scale factor will be rendered by the view element Canvas
         * @returns {string}
         */
        this.getImageUrl = function () {
            return this.getDocumentPages()[0].url + '&' + $.param(this.getImageParam());
        };

        /**
         * get the transcription url
         * @returns {string}
         */
        this.getThumbnailUrl = function () {
            return this.getDocumentPages()[0].transcription_url;
        };

        /**
         * get the transcription url
         * @returns {string}
         */
        this.getTranscriptionUrl = function () {
            return this.getDocumentPages()[0].transcription_url;
        };

        /**
         * replace the image url (first pos)
         * @param url
         * @return void
         */
        this.setImageUrl = function (url) {
            this.getPages()[0].url = url;
        };

        this.hasDocumentPages = function () {
            var status = false;
            try {
                if (this.Document.pager.pages.page) {
                    if (this.Document.pager.pages.page.length > 0) {
                        status = true;
                    }
                }
            } catch (e) {
                status = false;
            }
            return status;
        };
        /**
         * get the pager object from de Model.Document
         * @returns {{}}
         */
        this.getDocumentPager = function () {
            var pager = {};
            if (this.hasDocumentPages()) {
                pager = this.Document.pager;
            }
            return pager;
        };
        /**
         * get the pages from the Model.Document
         * @returns {Array}
         */
        this.getDocumentPages = function () {
            var pages = [];
            if (this.hasDocumentPages()) {
                pages = this.getDocumentPager().pages.page;
            }
            return pages;
        };
        this.getPDFurl = function () {
            var url = '';
            if (this.hasDocumentPages()) {
                url = this.getDocument().pdfUrl;
            }
            return url;
        };

        /**
         * returns the mets id
         * @returns {string}
         */
        this.getMetsID = function () {
            return this.metsId;
        };

        /**
         * store the mets id
         * @param id String
         */
        this.setMetsID = function (id) {
            this.metsId = id;
        };

        this.isDifferentMetsID = function () {

            return (this.metsId !== this.getDocument().metsId);
        };

        this.getTheme = function () {
            return this.theme;
        };

        this.getThemePath = function () {
            return this.getHostUrl() + '/' + this.themePath + this.getTheme() + '/';
        };

        /**
         * get the label language value
         * @see NS.LANG.getLang
         * @param str
         * @param param
         * @return String
         */
        this.getLabel = function (str, param) {
            var output = '';
            if (param) {
                output = NS.LANG.getLang(this.language + '.' + str, param);
            } else {
                output = NS.LANG.getLang(this.language + '.' + str);
            }
            return output;
        };


        /**
         * get the label language object reverence
         * @see NS.LANG.getLang
         * @param str
         * @param param
         */
        this.getLabelObject = function (str, param) {
            var output = '';
            if (param) {
                output = NS.LANG.getLangObject(this.language + '.' + str, param);
            } else {
                output = NS.LANG.getLangObject(this.language + '.' + str);
            }
            return output;
        };
    };

    App.mets2.Model.prototype.autoOptionMapping = function (options) {
        // make option reference point....
        for (var i in options) {
            if (options.hasOwnProperty(i)) {
                this.options[i] = options[i];
            }
        }
        // capture options mapping and defaults
        for (var m = 0; m < this.Map.length; m++) {
            for (var o in this.Map[m]) {
                if (this.Map[m].hasOwnProperty(o)) {

                    if (o !== "default") {
                        if (typeof(this.Map[m][o]) == "object") {
                            var obj = this.Map[m][o];
                            for (var a in obj) {
                                if (this[o] == undefined) {
                                    this[o] = {};
                                }
                                if (obj.hasOwnProperty(a)) {
                                    if (this.options[obj[a]]) {

                                        this[o][a] = this.options[obj[a]];
                                    } else {
                                        this[o][a] = this.Map[m]['default'];
                                    }
                                }
                            }
                        } else {
                            if (this.options[this.Map[m][o]]) {
                                this[o] = this.options[this.Map[m][o]];
                            } else {
                                if (typeof(this[o]) !== "object") {
                                    this[o] = this.Map[m]['default'];
                                }
                            }
                        }

                    }
                }
            }
        }

    };


    /**
     * Controller
     * @param model
     * @param view
     * @constructor
     */
    App.mets2.Controller = function (model, view) {
        this.model = model;
        this.view = view;
        this.event = new App.Observer();

        this.getModel = function () {
            return this.model;
        };
        this.getView = function () {
            return this.view;
        };
        this.disableDebugger = function () {
            this.model.debugMode = false;
        };
        this.isDebugActive = function () {
            return this.model.isDebugActive();
        };

        this.getLabel = function (str, param) {
            return this.model.getLabel(str, param);
        };

        this.getLabelObject = function (str, param) {
            return this.model.getLabelObject(str, param);
        };
    };

    /**
     * the auto binding method for the inner property "events"
     * it will automatic bind the events to the button on name reference
     * also it will make a method to the view and prototype the methods
     * to the event, so that the methods are accessible inside the function declaration
     *
     * -- example code --------------------------------------------------------------------\
     App.mets2.Controller.route('next',{
    events : {
        'click.1' : function(){
            console.info('yes next click event: 1');
            console.log(this);
            this.testNext();
            this.actionNext();
        },
        'click.2' : function(){
            console.info('yes next click event: 2');
            console.log(this);
        }
    },
    methods : {
        testNext : function(){

            console.info('do [testNext] function');
            console.log(this);
        },
        actionNext : function(){
            console.info('do [actionNext] function');

        }
    }
});
     *
     *
     * In this example we make add click events to the next button separated by namespaces
     * in the property "events" are the events and type of events decelerated
     * in de property "methods" we declare the methods that can be used in de event function "click.1, click.2"
     *
     * notice! in the Controller will also the method "next" created, and will return all the function that "method"
     * in this example Controller.Next() will be created and returns the method "testNext" and "actionNext"
     *
     * in this library there is the convention that a method that returns methods, that is written to simulate a class behaviour
     * must be written with first character uppercase
     *
     */
    App.mets2.Controller.prototype.autoBind = function () {

        var events = this.events;
        var buttons = this.model.button;

        for (var eventName in events) {
            if (events.hasOwnProperty(eventName)) {

                for (var btnName in buttons) {
                    if (buttons.hasOwnProperty(btnName)) {
                        // find the event
                        if (btnName == eventName) {

                            var btn = buttons[btnName];
                            var obj = events[eventName];

                            // create the view method's
                            // ad add the methods definitions to it
                            (function (methodName, methods, contrl, btn) {
                                contrl[NS.UT.Tools.ucwords(methodName)] = function () {
                                    methods = $.extend(methods, contrl);
                                    methods.btn = btn;
                                    return methods;
                                };
                            })(btnName, obj.methods, this, btn);
                            // capture type's events..
                            for (var type in obj.events) {
                                if (obj.events.hasOwnProperty(type)) {
                                    // bind the event sto the button
                                    // capture to create private scope
                                    (function (btn, obj, type, contrl) {
                                        btn.on(type + '.mets2', function () {


                                            // add the controller object reference
                                            obj.events[type].prototype = contrl;

                                            for (var name in obj.methods) {
                                                if (obj.methods.hasOwnProperty(name)) {
                                                    // inherit the function of method's
                                                    obj.events[type].prototype[name] = obj.methods[name];
                                                }
                                            }
                                            // add button reverence
                                            obj.events[type].prototype.btn = $(this);

                                            new obj.events[type]();
                                            return false;
                                        });
                                    })(btn, obj, type, this);
                                }
                            }

                        }
                    }
                }
            }
        }
    };


    /**
     * View
     * @param model
     * @constructor
     */
    App.mets2.View = function (model) {
        this.model = model;

        this.getModel = function () {
            return this.model;
        };
        this.isDebugActive = function () {
            return this.model.isDebugActive();
        };

        this.getLabel = function (str, param) {
            return this.model.getLabel(str, param);
        };

        this.getLabelObject = function (str, param) {
            return this.model.getLabelObject(str, param);
        };
    };
})(jQuery);

