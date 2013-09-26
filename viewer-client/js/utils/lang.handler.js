/**
	het is mogelijk om placeholders te zetten in views die met ajax op gehaald worden 
	via de gateway cortoller die geconfigureerd zijn in de load.php
	de method "getModuleLang" isn implemented in "NS.App.GateWay"
	
	a html placeholder looks lijke {foo.bar} zal revereren naar lang obejct "NS.LANG.myModule.foo.bar"
	
	ook kunnen er place holders gebruikt worden voor variabelen in een string 
	
	notice! alle js files in de /lang/ directory van een module worden automatisch geladen maar als
	er een lang.js wordt gevonden zal de  GateWay coroller hem als eerste laden voor alle andere 
	html maar naar de index.php van de module.
	
	--------------------------------------------------------------------------------------------------
	bv:
	string reverense:  			NS.LANG.boe.die.bla = "ik ben een {myVar} string ding";

	$L.getLang('boe.die.bla', {
		'myVar' : 'erg mooi'
	});
	outputs: "ik ben een erg mooi string ding";
	
	--------------------------------------------------------------------------------------------------
	the method "getModuleLang" doet het zelde met als uitzondering dat hij verwacht dat de module "name"
	als namespace reverence gedevineerd staad in "NS.LANG"  dus bv:
	
	bv:
	string reverense:  			NS.LANG.currentModule.boe.die.bla = "ik ben een {myVar} string ding";

	$L.getLang('boe.die.bla', {
		'myVar' : 'erg mooi'
	});
	outputs: "ik ben een erg mooi string ding";	
	
	notice! the reverence naar de module wordt uit de globals gehaald "$G.modulePath"
	is the currebnt loaded module ....

	notice! logging staad per default aan "$L.errorLogging" errors kunnen gelezen worden in de log files 
	van de log module.
	
	
*/
(function($){
	NS.Package('NS.LANG');	
	NS.LANG.errorLogging = true;
	
	
	NS.LANG.replaceValueInToString = function(vars, str){
		for(var i in vars){
			str = str.replace(RegExp('{'+i+'}'), vars[i], str);
		}
		return str;
	};
	
	
	NS.LANG.noticeError = function(reverence, message, error_reporting){
		if(NS.LANG.errorLogging){
			if(error_reporting){
				var text  = message+' ';
					text += reverence;

		        console.warn('LANGUAGE ERROR '+text);
			}
		}
	};		
	
	/**
	 * get lang object or return error ...
	 *
	 * @param (string)	namespace 			reverence  NS.LANG object
	 * @param (object)	vars				asositive array with the key: placeholder target 
	 * @param (boolean)	error_raporrting	set error reporting off default true
	 * @return boolean:false | string
	*/
	NS.LANG.getLang = function(namespace, vars, error_reporting, getObj){
		
		
		
		var vars			= vars || {};
		var getObj  		= getObj || false;
		var error_reporting = (error_reporting == undefined)? true : error_reporting;
		var namespaces  	= [];
		var obj 			= {};
		var str 			= '';
		var style			= 'style="margin: 2px;"';
		
		if(namespace.indexOf('.') !== -1){
			namespaces = namespace.split('.');
			for(var i=0; i < namespaces.length; i++){
				var ns = namespaces[i];

				if(i == 0){
					if(NS.LANG[ns]){
					obj = NS.LANG[ns];
					str +='.'+ns;
					}else{

						NS.LANG.noticeError(str, 'object reference desent exist', error_reporting);
						return '[label]';						
					}
				}else{
					str +='.'+ns;
					if(obj[ns]){
						obj = obj[ns];			
						if(typeof(obj) == 'string'){
							return NS.LANG.replaceValueInToString(vars, obj);
						}
					}else{
						NS.LANG.noticeError(str, 'object reference desent exist', error_reporting);
						return '[label]';
					}
				}
			}
			if(typeof(obj) == 'string'){
				return NS.LANG.replaceValueInToString(vars, obj);
			}else{
				if(!getObj){
					NS.LANG.noticeError(str, 'object string reverence not reached', error_reporting);
					return '[label]';
				}else{
					return obj;
				}
			}
		}else{
			if(NS.LANG[namespace]){
				if(typeof(NS.LANG[namespace]) == 'string'){
					return NS.LANG.replaceValueInToString(vars, NS.LANG[namespace]);
				}else{
					if(!getObj){
						NS.LANG.noticeError(str, 'object string reverence not reached', error_reporting);
						return '[label]'
					}else{
						return NS.LANG[namespace];
					}
				}
			}else{
				NS.LANG.noticeError(str, 'object reference desent exist', error_reporting);
				return '[label]';				
			}
		}
	};
	
	/**
	 * get the object reverence bt namespace from the language object...
	 * notice! targeting placeholding is not posible ...
	 *
	 * @param string		namespace 			reverence  NS.LANG object
	 * @param boolean		error_raporrting 	set error reporting off default true
	 * @return boolean:false | object
	 */
	NS.LANG.getLangObject = function(namespace, error_reporting){
		var error_reporting = (error_reporting == undefined)? true : error_reporting;
		return NS.LANG.getLang(namespace, {}, error_reporting, true);
	};
	
	

	

})(jQuery);