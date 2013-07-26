
// http://code.google.com/p/jsdoc-toolkit/wiki/TagReference
// http://code.google.com/p/jsdoc-toolkit/wiki/TagParam

var NS = function () {};
    NS = NS.prototype = function () {};


NS.Package = function (sName) {

    //split the name by dots
    var namespaces=sName.split('.') || [sName];
    var nlen=namespaces.length;
       
    var root = window;
    var f    = function() {};

    for(var i=0;i<nlen;i++) {
        var ns = namespaces[i];
        if(typeof(root[ns])==='undefined'){
            root = root[ns] = {};
            root = root.prototype = f;
        }
        else
           root = root[ns];
    }
};


NS.Package('NS.UT');

/* lang definitions  */
NS.Package('NS.LANG');

/* App namespaces */
NS.Package('NS.App');







window["$IE"]	=/*@cc_on!@*/false;
window["$UT"]   = NS.UT;
window["$L"]    = NS.LANG;
window["$App"]  = NS.App;


NS.Package('NS.G');
NS.G = {
	debugModel    : true,
	development	  : false	// de same as php "DEVELOPMENT"

};
window["$G"]    = NS.G;


if(!window['console']){
    console.error = function(param){};
    console.info = function(param){};
    console.log = function(param){};
    console.warn = function(param){};
}

// short name consoler function for firefox
window["$$"] =  function(param){
	if($G.debugModel){
		(!window.console)? alert(param) : console.log(param);
	}
	
};

/* short cut prototyping added by 1.3.8 */
Function.prototype.method = function(name, fn){
	this.prototype[name] = fn;
};


// global executible object vor ajax ready state 
// gebruik dit als je soqwiezo dit altijd wilt doen
// bij iedere ajax request
