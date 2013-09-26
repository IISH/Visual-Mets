
NS.Package('NS.UT.Tools');

(function ($){
    NS.UT.Tools = {
        // minify compatible
        version  : '2.4.5',
        getIEVersion : function(){
            var rv = -1; // Return value assumes failure.
            if (navigator.appName == 'Microsoft Internet Explorer'){
                var ua = navigator.userAgent;

                var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null)
                    rv = parseFloat( RegExp.$1 );
            }
            return rv;
        },
        /**
         *
         * @param value
         * @param character
         * @return {*}
         */
        trim  : function(value, character){
            if(value != undefined){
                var _str = character || 's';
                var _reg = new RegExp("^\\"+_str+"+|\\"+_str+"+$", "g");
                return ((value == '')? value : value.replace(_reg,''));
            }
        },
        /**
         *
         * @param data
         * @return {Boolean}
         */
        isEmpty  : function(data){
            if(typeof(data) === 'string'){
                return (data == '')? true : false;

            }else if(NS.UT.Tools.isArray(data)){
                return (data.length == 0)? true : false;

            }else{
                var _count = 0;
                for(var i in data){
                    _count++;
                    if(_count > 0){
                        break;
                    }
                }
                return (_count == 0)? true : false;
            }
        },


        /**
         * update a existing object by nested child fields
         * @notice convert string reverence to data reverence
         * @see String.prototype.convert
         * @param data      Object
         * @param reverence Object
         * @return new object reverence
         */
        updateObjectReverence : function (data, reverence){
            for(var i in data){
                if(data.hasOwnProperty(i)){
                    if(typeof(data[i]) == 'object'){

                        if(reverence[i] == undefined){
                            reverence[i] = {};
                        }
                        this.updateObjectReverence(data[i], reverence[i]);
                    }else{
                        if(typeof(data[i])=='string'){
                            reverence[i] = data[i].convert();
                        }else{
                            reverence[i] = data[i];
                        }
                    }
                }
            }
            return reverence;
        },

        /**
         * get theb length of a array or object
         * @param obj
         * @returns {*}
         */
        size : function(obj){
            if(typeof(obj) === "object"){
                var c=0;
                for(var o in obj){
                    if(obj.hasOwnProperty(o)){
                        c++;
                    }
                }
                return c;
            }else{
                return obj.length;
            }
        },

        /**
         *
         * @param {string} str      object reverence based on name space
         * @param obj_reverence     optional scope reverence default window
         * @return {Boolean}
         */
        isObject : function(str, obj_reverence){
            var namespaces = [];
            var obj = {};
            var reverence = obj_reverence || window;

            if(str.indexOf('.') !== -1){
                namespaces = str.split('.');

                for(var i=0; i < namespaces.length; i++){
                    var ns = namespaces[i];
                    if(i == 0){
                        if(reverence[ns] !== undefined){
                            obj = reverence[ns];
                        }else{
                            return false;
                        }
                    }else{
                        if(obj[ns] !== undefined){
                            obj = obj[ns];
                        }else{
                            return false;
                        }
                    }
                }
            }else{
                if(reverence[str] === undefined){
                    return false;
                }
            }
            return true;
        },
        /**
         * extension on netive parseFloat parse european number
         * @param value
         * @return {Number}
         */
        parseFloat : function(value){
            value = NS.UT.Tools.trim(value);
            if(new RegExp("^[0-9]+(\\,)+[0-9]+$", "").test(value)){
                value = value.replace(new RegExp("\\,", "g"), '.');
            }
            return parseFloat(value);
        },
        /**
         * check on number compatible for european number
         * @param str
         * @return {Boolean}
         */
        isNumber : function(str){
            if(str){
                str = NS.UT.Tools.trim(str);
                if(new RegExp("^[0-9]+(\\,)+[0-9]+$", "").test(str)){
                    str = str.trim().replace(new RegExp("\\,", "g"), '.');
                }
                return (isNaN(str))?false:true;
            }
            return false;
        },

        nl2br : function(value){
            if(value && typeof(value) === 'string'){
                return value.replace(new RegExp('\\n|\\r', 'g'), '<br />');
            }
        },
        /**
         *
         * @param str
         * @return {String}
         */
        ucwords : function (str){
            var _newstr = '';
            str = str.split(' ');
            for (var c = 0; c < str.length; c++) {
                _newstr += str[c].substring(0, 1).toUpperCase() + str[c].substring(1, str[c].length)+'';
            }
            return _newstr;
        },
        /**
         * create a Uppercase string and remove underscores
         * @param str
         * @return {String}
         */
        prettyText : function (str){
            str = NS.UT.Tools.ucwords(str);
            return str.replace(new RegExp('_'),' ', str);
        },
        /**
         *
         * @param str
         * @return {String}
         */
        stripslashes : function (str) {
            return (str + '').replace(new RegExp("\\\\(.?)","g"), function (s, n1) {
                switch (n1) {
                    case '\\':
                        return '\\';
                    case '0':
                        return '\u0000';
                    case '':
                        return '';
                    default:
                        return n1;
                }
            });
        },

        /**
         * array whit will append to te list to check if url is localhost
         * @param host
         * @return {Boolean}
         */
        isLoacalhost : function (host){
            host = host || [];
            var _adress = ['localhost','127.0.0.1','server'];
            _adress.push(host);
            for(var i=0; i < _adress.length; i++){
                if(_adress[i] == window.location.host){
                    return true;
                }
            }
            return false;
        },
        /**
         * check if its a array or not
         * @param obj
         * @return {Boolean}
         */
        isArray : function (obj) {
            if(obj){
                if (obj.constructor.toString().indexOf("Array") == -1){
                    return false;
                }else{
                    return true;
                }
            }
            return false;
        },
        /**
         *
         * @param prefix
         * @return {String}
         */
        createId : function (prefix){
            prefix = prefix || '';
            var _str = '';
            for(var i=0; i < 5; i++){
                _str += Math.floor(Math.random()*10);
            }
            return prefix+_str+'-'+new Date().getTime();
        },

        /**
         * sleep function temout and clearing
         * @param fn
         * @param time
         */
        sleep : function(fn, time){
            var counter=0;
            var t = window.setTimeout(function(){
                fn(counter++);
                window.clearTimeout(t);
            }, time);
        },

        /**
         * simple timer
         * @param fn        is the function to execute
         * @param time      time interval time set
         * @return {Object} method "stop" to stop the interval
         */
        timer : function(fn, time){
            var counter=0;
            var t = window.setInterval(function(){
                fn(counter++);
            }, time);
            return {
                stop : function(){
                    window.clearInterval(t);
                }
            }
        },

        timerInst : {},
        /**
         * added by version: 1.9.0
         * almost the same as "sleep" but this window overwite is valiable
         * you can use this function for keypress function zoals "keyup"
         * @param fn
         * @param time
         */
        delay : function(fn, time){
            if(NS.UT.Tools.timerInst.stop){
                NS.UT.Tools.timerInst.stop();
            }
            NS.UT.Tools.timerInst = $UT.timer(function(i){
                NS.UT.Tools.timerInst.stop();
                if(fn){ // IE fix
                    fn(i);
                }
            }, time);
        },

        /**
         * method returns all atributes of a element
         * @param elem
         * @return {*}
         */
        getAttributes : function(elem){

            var _elem = (elem.length > 0)? elem : $(elem),
                _data = {};
            if(typeof(_elem[0]) == 'object'){

                for(var i=0; i < _elem[0].attributes.length; i++){
                    _data[_elem[0].attributes[i].nodeName] = _elem[0].attributes[i].nodeValue;
                }
                return _data;
            }
            return false;
        },

        /**
         * @option obj.target       (Object)
         * @option obj.src      	(String)
         * @option obj.cssClass     (String)
         * @option obj.css      	(Object)
         * @option obj.id       	(String)
         * @option obj.text     	(String)
         * @option obj.overlay      (Boolean)
         * @option obj.center       (Boolean) set loader modal
         * @option obj.top     	    (Integer) set the top of the loader
         * @option obj.left     	(Integer) set the left of the loader
         * object retursn method remove needs param selectror id
         */
        loader : function(obj){
            var div =  $('<div>');
            var text =  $('<div>');
            var loader =  $('<img>');
            obj = obj || {};
            obj.src 		= (obj.src)?  		loader.attr({src : obj.src})  : '';
            obj.cssClass = (obj.cssClass)? 	div.addClass(obj.cssClass)    : '';
            obj.css 		= (obj.css)?      	div.css(obj.css)              : '';
            obj.id 		= (obj.id)?       	obj.id                        : 'ut-loader';

            div.attr({id : obj.id}).appendTo(obj.target);
            if(obj.center){
                div.css({
                    'position' : 'absolute',
                    'z-index' : '1000001',
                    'top'  : obj.top  || Math.round(($(obj.target).height() - div.height())/2 ),
                    'left' : obj.left || Math.round(($(obj.target).width() - div.width())/2 )
                });
            }
            loader.appendTo(div);
            (obj.text)? text.html(obj.text).appendTo(div) : '';
            if(obj.overlay){
                $('<div>')
                    .attr({
                        id : obj.id+'-overlay'
                    })
                    .css({
                        'z-index' : '1000000',
                        'height'  : $(obj.target).height(),
                        'width' 	:  $(obj.target).width()
                    }).appendTo(obj.target);
            }
            return {
                remove : function(target){
                    $(target).remove();
                    $(target+'-overlay').remove();
                }
            }
        },
        /**
         * get params from a url
         * @param (String) the url
         * @param (Boolean) if set on true it will try to decode the url vars value's
         * return (Object)
         */
        getUrlVars : function(str, bool){

            var _pieces = str.replace(new RegExp("^.*(\\?)"),'').split("&"), _values = [], _data = {};
            for(var i=0; i < _pieces.length; i++){
                _values = _pieces[i].split("=");
                _data[_values[0]] = (bool)? decodeURIComponent(_values[1]) : _values[1];
            }
            return _data;
        },
        /**
         * check if the string is mumeric (float compatible)
         */
        isNumeric : function(value){
            return new RegExp('^[0-9]*(\\.)?[0-9]*$').test(value);
        },

        /**
         * parse a obejct in to valid value's
         */
        parseVars : function(data, setings){

            setings = setings || {};

            for(var i in data){
                if(data.hasOwnProperty(i)){
                    if(typeof(data[i]) === 'object'){

                        if(setings[i] == undefined){
                            setings[i] = data[i];
                        }
                        this.parseVars(data[i], setings[i]);
                    }else{
                        setings[i] = data[i].convert();
                    }
                }
            }
            return setings;
        },

        // give a height en width base on margin in "%"
        getRelativeViewPort : function(factor, target){

            target = target || 'body';
            var _height = $(target).height(), _width = $(target).width();
            return {
                height : Math.round((factor / 100) * _height),
                width  : Math.round((factor / 100) * _width )
            }
        },
        // ---- detect boundary view port handler  ----
        /**
         * patram = option
         * option[viewport] (String)  the view port default
         * option[event]    (Object)  the mouse cursor position
         * option[element]  (Object)  the element to colculate the detect boundery viewport
         * return true if boundery is reatch
         */
        boundaryViewPort : function(option, factor){


            option.viewport = option.viewport || window;


            var _viewport_height = $(option.viewport).height(),
                _viewport_width  = $(option.viewport).width(),
                _element_height  = $(option.element).height(),
                _element_width   = $(option.element).width(),
                _factorHeight 	  = (factor)? Math.round((factor / 100) * _viewport_height) : 0,
                _factorWidth	  = (factor)? Math.round((factor / 100) * _viewport_width) : 0,
                _event           = (option.event.offset)? option.event.offset() : option.event;

            return {
                top   	: ( ((_viewport_height - _event.top) + _element_height)  >  (_viewport_height - _factorHeight) )? true : false,
                right   : ( (_event.left + _element_width) >  (_viewport_width - _factorHeight))? true : false,
                bottom  : ( (_event.top + _element_height) > (_viewport_height - _factorHeight))? true : false,
                left    : ( _event.left < _element_width)? true : false
            }
        },
        // check if extesion utility
        isExtension : function(pattern, subject){
            // string
            if(typeof(pattern) == 'string'){
                if(new RegExp(pattern, 'gi').test(subject)){
                    return true;
                }
                // or array
            }else{
                for(var i =0; i < pattern.length; i++){
                    if(new RegExp(pattern[i], 'gi').test(subject)){
                        return true;
                    }
                }
            }
            return false;
        },

        getExtension : function(param){
            return param.replace(new RegExp("/.*(\.)/"), '');
        },
        getFile : function(param){
            return param.replace(new RegExp(".*(\/)"), '');
        },
        getPath : function(param){
            return param.slice(0,param.lastIndexOf('/')+1);
        }
    };


    /** ------------ (aspectRatio) -------------

     give back the aspectRatio in width and height

     @ param = object
     @option option.currentHeight   (Integer)   the current width of the object
     @option option.currentWidth 	(Integer)   the current height of the object
     @option option.newHeight  	    (Integer)   give the your height for the formule
     @option option.newWidth 		(Integer)   give the your width for the formule

     @return (Object)  whit new height en width
     */
    NS.UT.Tools.aspectRatio =  function(option){

        if(option.newHeight){
            // render the new width
            var _h = option.currentHeight;
            var _w = option.currentWidth;
            var _newWidth = (option.newHeight * _w) / _h;

            return {
                width  : Math.round(_newWidth),
                height : option.newHeight
            }
        }else if(option.newWidth){

            // render the new height
            var _h = option.currentHeight;
            var _w = option.currentWidth;
            var _newHeight = (option.newWidth * _h) / _w;

            return {
                width  : option.newWidth,
                height : Math.round(_newHeight)

            }
        }else{
            $$('the option input is empty or not a valid input!')
        }

    };


    /**
     @ param = object
     @option[currentHeight]  (Integer)   the current height of the object
     @option[currentWidth]	(Integer)   the current width of the object
     @option[height] 		(Integer)   give the your height for the function
     @option[width]		    (Integer)   give the your width for the  function
     */
    NS.UT.Tools.boundary = function(option){

        var _result = {
            width  : 0,
            height : 0
        };
        var _getWidth = this.aspectRatio({
            currentWidth  : option.currentWidth,
            currentHeight : option.currentHeight,
            newHeight	  : option.height
        });
        // new size
        var _newSize = this.aspectRatio({
            currentWidth  : _getWidth.width,
            currentHeight : _getWidth.height,
            newWidth	  : option.width
        });

        if(_newSize.height > option.height){
            _result.height = option.height;
        }else{
            _result.height = _newSize.height;
        }
        if(_getWidth.width >  option.width){
            _result.width = option.width;
        }else{
            _result.width = _getWidth.width;
        }
        return _result;
    };


    /**
     de inline loader is geschreven om naast een button of een andere plek een
     loading message te tonen met uscces status functionaliteid
     html is wel requered!
     -------
     <div class="inline-loader">
     <img src="images/loader-small.gif" alt="sending..." class="left"/>
     <span></span>
     </div>
     -------

     @option option.target 	    (String)   target loader holder default ".inline-loader"
     @option option.loadText	(String)   loading text 		default "De inforamtie wordt verstuurd."
     @option option.seccesText  (String)   secces text			default "De inforamtie is succesvol verstuurd."
     @option option.errorText   (String)   error text			default "Server error on request!"
     @option option.loadImg	    (String)   loading image 		default "De inforamtie wordt verstuurd."
     @option option.seccesImg   (String)    secces image			default "De inforamtie is succesvol verstuurd."
     @option option.errorImg    (String)    error image			default "Server error on request!"
     @option option.onOpen 	    (Finction)  collback function triggerst on open status
     @option option.onClose 	(Finction)  collback function triggerst on close status
     @retens method
     open					parameter is function closure
     close					parameter is function closure
     error					parameter is function closure param = string(text message)
     */
    NS.UT.Tools.inlineLoader = function(option){
        option = option || {};
        var _option = {
            target 		: option.target		 || '.inline-loader',
            loadText  	: option.loadText    || 'sending',
            loadImg  	: (option.loadImg == undefined)? false : option.loadImg,
            seccesText 	: option.seccesText  || 'De inforamtie is succesvol verstuurd.',
            seccesImg 	: option.seccesImg   || 'images/icons/16x16/accept.png',
            errorText 	: option.errorText   || 'Server error on request!',
            errorImg 	: option.errorImg    || 'images/icons/16x16/error.png',
            onOpen	 	: option.onOpen  || false,
            onClose	 	: option.onClose || false
        };

        var _loader = $(_option.target);
        var _span   = _loader.find('span');
        var _img 	= _loader.find('img');
        var _src 	= _img.attr('src');
        var _c = 0;

        var _timer = function(){};


        return {
            target : $(_option.target),
            open : function (fn){
                if(_loader.length > 0){
                    if(_option.onOpen){
                        _option.onOpen( _loader );
                    }
                    if(_option.loadImg){
                        _img.attr('src', _option.loadImg);
                    }
                    _span.text(_option.loadText);
                    _timer = NS.UT.Tools.timer(function (){
                        _c++;
                        var _point = '.';
                        if(_c == 4){
                            _c=0;
                        }
                        for(var i=0; i< _c; i++){
                            _point +='.';
                        }
                        _span.html(_option.loadText+''+_point+'');
                    },800);

                    _loader.css('display', 'inline-block');
                    if(fn){
                        fn(_loader);
                    }
                }
            },
            success : function(text,fn){
                _option.loadText = text;
                this.close(fn, text);
            },
            close : function (fn, text){
                if(_loader.length > 0){
                    _option.seccesText = text || _option.seccesText;
                    _timer.stop();
                    _img.attr('src', _option.seccesImg);
                    _span.html(_option.seccesText);

                    NS.UT.Tools.sleep(function(){
                        _loader.hide();
                        _img.attr('src', _src);
                        _span.text(_option.loadText);
                        if(fn){
                            fn(_loader);
                        }
                        if(_option.onClose){
                            _option.onClose( _loader );
                        }
                    }, 2000);
                }
            },
            error : function (text){
                if(_loader.length > 0){
                    text = text || _option.errorText;
                    _timer.stop();
                    _img.attr('src',  _option.errorImg);
                    _span.html('<span class="black">'+text+'</span>');
                }
            }
        }
    };



    /** -------------  getScroll X Y ------------------------------------
     *  gte the X and Y position of the current scrollbar for the window
     *
     */
    NS.UT.Tools.getScrollPosition = function(){

        var scrOfX = 0, scrOfY = 0;
        if( typeof( window.pageYOffset ) == 'number' ) {
            //Netscape compliant
            scrOfY = window.pageYOffset;
            scrOfX = window.pageXOffset;

        } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
            //DOM compliant
            scrOfY = document.body.scrollTop;
            scrOfX = document.body.scrollLeft;

        } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
            //IE6 standards compliant mode
            scrOfY = document.documentElement.scrollTop;
            scrOfX = document.documentElement.scrollLeft;
        }
        return {
            X : scrOfX,
            Y : scrOfY
        }
    };


    /**
     * @param elements  (String)   jquery field selector or selectors
     * @param reset  	(Boolean)  set default back on blur 			default true added by (1.7.8)
     */
    NS.UT.Tools.fieldFocus = function (selector, reset){

        var _selector = $(selector);
        var reset = (reset == undefined)? true : reset;

        for(i=0; i < _selector.length; i++){

            // create scope for private vars...
            (function(_this){

                var _cash 	 = '',
                    _default =  '';
                $(_this).bind('focus.fieldFocus', function(){

                    var _self = $(this);
                    if(_default == '' || _self.val() == _default){
                        _default = _self.val();
                        _self.val('');
                    }
                    //
                    _self.removeClass('fieldBlur');
                    _self.addClass('fieldFocus');
                });
                $(_this).bind('blur.fieldFocus', function(){

                    var _self = $(this);

                    if(reset){
                        if(_self.val() == ''){
                            _self.val(_default);
                        }else{
                            _cash = _self.val();
                        }
                    }
                    _self.removeClass('fieldFocus');
                    _self.addClass('fieldBlur');
                });
            })( $(_selector[i]) );

        }
    };

    NS.UT.Tools.isMobile = function(){
        var agents = ['android', 'webos', 'iphone', 'ipad', 'blackberry'];
        for(var i in agents) {
            if(navigator.userAgent.match('/'+agents[i]+'/i')) {
                return true;
            }
        }
        return false;
    };

    String.prototype.isNumeric = function(){
        return new RegExp('^[0-9]*(\\.)?[0-9]*$').test(this);
    };

    String.prototype.convert = function(){
        if(typeof(this) !== 'boolean' || typeof(this) !== 'object'){
            if(this == 'true'){
                return true;
            }else if(this == 'false'){
                return false;
            }else if(this == 'null'){
                return null;
            }else if(this.isNumeric()){
                return parseFloat(this);
            }else{
                return this.toString();
            }
        }else{
            return this;
        }
    };


    // important for IE!...
    Array.prototype.indexOf = function(obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) { return i; }
        }
        return -1;
    };






    //  ---------------------------------- [ extend tools to direct name space ] -------------------------------------
    $.extend(NS.UT, NS.UT.Tools);



})(jQuery);