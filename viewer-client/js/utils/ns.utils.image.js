//----------------------------------------------------------------------------------------------------------------------------------------------------------------
// **
// **
// **															[ Imgae ]   version 1.2 ] 
// **																	
// **	
//=================================================> image function to get image prperties and status <============================================================	


NS.Package('NS.UT.Image');
(function ($){
	NS.UT.Image = function(){
		
		var method = {
				// img object
				worning : 'src is not defined!',
			
				get : function(object){
					var img = new Image();
					// worning you need to youse src property
					if(img.src == undefined){
						$$(method.worning);
						return;
					}
					img.src = object.src;								
						if(NS.UT.Tools.IE){							
							$(img).ready(function(){
								if(object.succes){
									object.succes(img);
								}						
							});
						}else{								
							img.onload = function(){
								if(object.succes){
									object.succes(img);
								}							
							}					
						}										
						
						img.onerror = function(){
							if(object.error){
								object.error(img);
							}
						}
						
				
				},
				// get the size (width adn height) of the image
				getSize : function(src, functn){

					var img = new Image();
						img.src = src;
						
						if(NS.UT.Tools.IE){							
							$(img).ready(function(){
								if(functn){
									functn({
										height : img.height,
										width  :  img.width
									});
								}						
							});
						}else{								
							img.onload = function(){
								if(functn){
									functn({
										height : img.height,
										width  :  img.width
									});
								}							
							}					
						}									
				}
		};
		return function(){ 
			return {
				get 		: method.get, 
				getSize 	: method.getSize
			};
		}
	}();
})(jQuery);
/* ------------------------------------------------------------------------------------
	function  $UT.Image();

	returns two methods:
	
		1. get()
		2. getSize(); 
	
	method: get()
	-----------------------------------------------------------------------------------
	needs a object litoral format
	
		src : the target url of the image
		seucces : (function) zal uitgevoerd worden als de image met succes is geladen
		error	: zal uitgevoerd worden als de image niet geladen wordt
		
	method getSize()
	-----------------------------------------------------------------------------------
	2 parameters
		param 1  : (string) source of the image
		param 2  : (function) zal uitgevoered worden op status succes
		
		function(img) img object is result { height / width }

		
		
		
	voorbeeld: getSize / (is a new instantie)
	-----------------------------------------------------------------------------------
		
		var myImage = new $UT.Image();		
		var source = 'http://212.178.72.94/Store4U/images/complies/producten/1005HA-BLK015S.jpg';		
		myImage.getSize(source, function(size){
			$$(size);
		});

	voorbeeld: get()
	-----------------------------------------------------------------------------------
		
			$UT.Image().get({
				src : 'http://212.178.72.94/Store4U/images/complies/producten/1005HA-WHI014S.jpg',

				succes : function(img){
					$$(img);
				},
				error : function(){
					$$('error');
				}
			});	
			
	---------------------------------------------------------------------------------*/




