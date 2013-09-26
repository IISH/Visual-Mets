/**
 * @vesrion 1.1
 * @name "Observer"
  * @description
  * this class is written for the ned for a simple iplemenation for the Observer design patern
  * in a class or function
  *
 */


NS.Package('NS.App.Observer');
NS.App.Observer = function(){
	this.fn = [];
};
NS.App.Observer.prototype = {
	
		addListenerOnce : function (type, fn){
				this.fn.push({
					type 	: type,
					fn 		: fn,
					once    : true
				}); 			
		},
		
		addListener : function (type, fn){
				this.fn.push({
					type 	: type,
					fn 		: fn,
					once    : false	   			
				}); 
		},
		
		removeListener : function(type){
			for(var i=0; i< this.fn.length; i++){
				if(this.fn[i].type == type){
					this.fn.splice(i, 1);
				}	
			}
		},
			   	
		fire : function (type, param){
			for(var i=0; i< this.fn.length; i++){
				if(this.fn[i].type == type){
					this.fn[i].fn.apply(this, Array.prototype.slice.call(arguments, 1));
					if(this.fn[i].once){
						this.fn.splice(i, 1);
					}
				}
			}
		}
};
