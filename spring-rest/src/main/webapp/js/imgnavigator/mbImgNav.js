/*
 *
 * (mb)ImageNavigator
 * 				developed by Matteo Bicocchi on JQuery
 *         � 2002-2009 Open Lab srl, Matteo Bicocchi
 *			    www.open-lab.com - info@open-lab.com
 *       	version 2.0
 *       	tested on: 	Explorer and FireFox for PC
 *                  		FireFox and Safari for Mac Os X
 *                  		FireFox for Linux
 *         GPL (GPL-LICENSE.txt) licenses.
 *
 *
 */

(function($){
  jQuery.fn.imageNavigator = function (options){

    return this.each (function ()
    {

      this.options={
        areaWidth: 500,
        areaHeight:500,
        defaultnavWidth:150,
        draggerStyle:"2px dotted red",
        navOpacity:1.0,
        loaderUrl:"loading.gif",
        additionalContent:"",
        imageUrl:"sadfsadf",
        tabId: 0
      };
      $.extend (this.options, options);

      options= this.options;
      var imgNav= this;
      var tabId = options.tabId;

      $("#tabMetadata_" + tabId).find(".nav").remove();


      var additionalContent, draggableElement, applContainer,image,imageW,imageH,imageContainer,imageContainerW,imageContainerH,navLocator,navigationThumb,navigationThumbW,navigationThumbH,nav,navW,navH,image_isHoriz,cont_isHoriz,ratio,actualIdx=0,onScreen=false,navCoordinateX,navCoordinateY;

      $(imgNav).css({
        width : imgNav.options.areaWidth
      });

      var images= $(imgNav).find(".imagesContainer");
      $(imgNav).empty();

      if ($.metadata){
        $.metadata.setType("class");
        $(images).each(function(){
          if ($(this).metadata().imageUrl) $(this).attr("imageUrl",$(this).metadata().imageUrl);
          if ($(this).metadata().navPosition) $(this).attr("navPosition",$(this).metadata().navPosition);
          if ($(this).metadata().navWidth) $(this).attr("navWidth",$(this).metadata().navWidth);
          if ($(this).metadata().NavCoordinates) $(this).attr("NavCoordinates",$(this).metadata().NavCoordinates);
        });
      }

//      var imageURL=$(images[0]).attr("imageUrl");

      var imageURL=options.imageUrl;

      //var navPos=$(images[0]).attr("navPosition");
      var navPos=options.navPosition;
      //var navWidth= $(images[0]).attr("navWidth")?$(this).attr("navWidth"):imgNav.options.defaultnavWidth;//100;
      var navWidth = options.navWidth;

      var titles=$(images).find(".title");
      var descriptions=$(images).find(".description");
      var additionalContents=$(images).find(".additionalContent");


      $(imgNav).append("<div class='imageContainer'>");

      imageContainer=$(imgNav).find(".imageContainer");
      $(imageContainer).css({
        padding: "5px",
        overflow:"hidden",
        position: "relative",
        width:this.options.areaWidth+"px",
        height:this.options.areaHeight+"px"
      });
      var loader="<table id='loader' style='display:none;' cellpadding='0' cellspacing='0' width='100%' height='100%'><tr><td valign='middle' align='center'><img src='"+imgNav.options.loaderUrl+"' alt='loading'></td></tr></table>";
      $(imageContainer).append(loader);

      var canClick=true;

      $(imgNav).append("<div class='descriptionBox'>");
      var descriptionBox=$(imgNav).find(".descriptionBox");
      $(descriptionBox).html(descriptions[0]);

      startNav(imageURL);

      function startNav(u) {
        navW=null;
        ratio=null;
        if (applContainer){
          $(applContainer).remove();
        }
        $(titles).each(function(i){
          if (i==actualIdx)
            $(this).addClass("selected");
          else
            $(this).removeClass("selected");
        });
        navW=navWidth;
        var imageObj = new Image();
        imageObj.src=null;
        //u=u+"?rdm="+Math.random();
        imageObj.src = u;
        imageObj.onload =function(){buildnav(u);};
        imageObj.onerror = imageFailed;
        //$("#loader").fadeIn(500);
      }

      function imageFailed() {
        alert("Laden niet gelukt: "+this.src);
      }

      function buildnav(u) {
        imageContainerW=$(imageContainer).width();
        imageContainerH=$(imageContainer).height();

        $("#loader").fadeOut(500, function(){canClick=true;});
        $(titles).bind("click",function(){return true;});
        $(imageContainer).hover(function(){
          if($.browser.msie) $(nav).show();
          else
            $(nav).show();
        });
//        $(imageContainer).mouseleave(function(){
//          if($.browser.msie) $(nav).hide();
//          else
//            $(nav).hide();
//        });

        //applContainer
        $(imageContainer).append("<div class='applContainer'>");
        applContainer = $(imgNav).find(".applContainer");
        $(applContainer).css({
          position:"relative",
          height:$(imageContainer).height()
        });

        $(applContainer).append("<div class='draggableElement'>");
        draggableElement=$(applContainer).find(".draggableElement");

        //image
        $(draggableElement).append("<image class='navImage'>");
        image= $(draggableElement).find(".navImage");

        $(image).mouseover(function(){
            $(image).css({cursor: "url(css/images/openhand.png), url(css/images/openhand.cur),e-resize"});
            //$(image).css({cursor: "url(../../images/cursors/grab.gif), url(../../images/cursors/openhand.cur),e-resize"});
        });
        $(image).mousedown(function(){
            $(image).css({cursor: "url(css/images/closedhand.png), url(css/images/closedhand.cur),e-resize"});
        });
        $(image).mouseup(function(){
            $(image).css({cursor: "url(css/images/openhand.png), url(css/images/openhand.cur),e-resize"});
            //$(image).css({cursor: "url(../../images/cursors/grab.gif), url(../../images/cursors/openhand.cur),e-resize"});
        });


        //additionalContent
        $(draggableElement).append("<div class='additionalContent'>");
        additionalContent=$(draggableElement).find(".additionalContent");
        $(additionalContent).css({position:"absolute", top:"0"});


        $(descriptionBox).html(descriptions[actualIdx]);
        $(additionalContent).html(additionalContents[actualIdx]);

        $(image).attr("src",u);
        $(image).hide();
//		jQuery.fx.off = true

        imageH=$(image).outerHeight();
        imageW=$(image).outerWidth();

        console.log(imageH);
        $(draggableElement).css({
//            position: "absolute"
            marginLeft: "auto",
            marginRight: "auto",
            width: imageW+'px'
        });
        //$(image).fadeIn(1000, function(){

          var t,l;
          if (!$(images[actualIdx]).attr("NavCoordinates")){
            t=-(imageH/2-($(nav).height()*3));
            l=-(imageW/2-($(nav).width()*3));
          }else{
            t=-(navCoordinateY-($(imageContainer).height()/2));
            l=-(navCoordinateX-($(imageContainer).width()/2));
            if (t>0) t=0;
            if (l>0) l=0;
          }

		$(image).show();

        var x1 = $(imageContainer).offset().left-imageW+$(imageContainer).outerWidth();
        var y1 = $(imageContainer).offset().top-imageH+$(imageContainer).outerHeight();
        var x2 = $(imageContainer).offset().left;
        var y2 = $(imageContainer).offset().top;

        $(draggableElement).draggable({
          containment:[x1,y1,x2,y2],
          start:function(){
            $(nav).hide();
            //$(draggableElement).css({cursor:"move"});
          },
          stop:function(e,ui){
            refreshThumbPos(ui.position.left,ui.position.top);

            //$(draggableElement).css({cursor:"default"});
            //$(draggableElement).css({cursor:"default"});
            $(nav).show();
          }
        });


        $("#tabMetadata_" + tabId).append("<div class='nav'>");
        nav = $("#tabMetadata_" + tabId).find(".nav");

        $(nav).css({
          position:"absolute",
          opacity: imgNav.options.navOpacity,
          left: "50%",
          marginLeft: "-50px"
        });

        //ZONE SELECTOR
        $(nav).append("<div id='navLocator'>");
//        navLocator= $(imgNav).find("#navLocator");      **
        navLocator= $(nav).find("#navLocator");
        $(navLocator).css({
          zIndex: 2,
          position: "absolute",
          border : imgNav.options.draggerStyle,
          backgroundColor: $.browser.msie?"white":"transparent",
          opacity: $.browser.msie?.5:1
         // opacity:0.0;
        });

        $(navLocator).bind("dblclick",function(){fitonScreen();});
        $(navLocator).draggable({
          containment: 'parent',
          start:function(){
            $(navLocator).css({cursor:"move"});
          },
          drag:function(e,ui){
            refreshImagePos(ui.position.left,ui.position.top);
          },
          stop:function(ui){
            $(navLocator).css({cursor:"default"});
          }
        });

        if($(image).outerWidth() < imgNav.options.areaWidth){
            $(draggableElement).draggable( "option", "axis", 'y' );
            $(navLocator).width();
        }

        if($(image).outerHeight() < imgNav.options.areaHeight){
            $(draggableElement).draggable( "option", "axis", 'x' );
            $(navLocator).draggable( "option", "axis", 'x' );
        }

        if($(image).outerHeight() < imgNav.options.areaHeight && $(image).outerWidth() < imgNav.options.areaWidth){
            $(nav).remove();
            $(draggableElement).draggable( "option", "disabled", true );
            $(draggableElement).css({opacity : 1.0});
            $(image).unbind();
        }

        //THUMB
        $(nav).append("<image class='navigationThumb'>");
//        navigationThumb= $(imgNav).find(".navigationThumb");
        navigationThumb= $(nav).find(".navigationThumb");
        $(navigationThumb).attr("src",u);
        $(navigationThumb).bind("dblclick",function(){fitonScreen();});

        image_isHoriz= imageH < imageW;
        cont_isHoriz= imageContainerH < imageContainerW;
        ratio= imageH/navH;
        resetAllValue();
      }

      function fitonScreen(){
        if(!onScreen){
          navLocator.oldX=$(navLocator).css("left");
          navLocator.oldY=$(navLocator).css("top");
          draggableElement.oldX=$(draggableElement).css("left");

          draggableElement.oldY=$(draggableElement).css("top");


          var controller=((navW*imageContainerH)/navH)<imageContainerW;


          if(controller){
            $(image).css("width",imageContainerW);
          }else{
            $(image).css("height",imageContainerH);
		  }

		  // $(image).css("width",1000);
		  // $(image).css("height",1000);
          onScreen=true;
          $(navLocator).css("top",0);
          $(navLocator).css("left",0);
          $(draggableElement).css("top",0);
          $(draggableElement).css("left",0);
          $(draggableElement).bind("mousemove",imgNav.doNothing=function(){return false;});
          $(additionalContent).hide();

        } else{

          $(image).width("");
          $(image).height("");
          onScreen=false;
          $(draggableElement).css("top",draggableElement.oldY);
          $(draggableElement).css("left",draggableElement.oldX);
          $(navLocator).css("top",navLocator.oldY);
          $(navLocator).css("left",navLocator.oldX);
          $(draggableElement).unbind("mousemove",imgNav.doNothing);
          $(additionalContent).show();

        }
        resetAllValue();
        var x=$(navLocator).offsetLeft;
        var y=$(navLocator).offsetTop;
        refreshImagePos(x,y);
      }

      function refreshImagePos(x,y){
        ratio= imageH/navH;
        var posX=-(arguments[0]+1)*ratio;
        var posY=-(arguments [1]+1)*ratio;
        $(draggableElement).css("top",posY);
        $(draggableElement).css("left",posX);
      }

      function refreshThumbPos(x,y){
        ratio= imageH/navH;
        var posX=-(arguments[0]+1)/ratio;
        var posY=-(arguments[1]+1)/ratio;
        if(posX < 0) posX = 0;

        if($(draggableElement).draggable( "option", "axis") == 'y') posX = 0;
        if($(draggableElement).draggable( "option", "axis") == 'x') posY = 0;

        $(navLocator).css({
          top:posY,
          left:posX
        });
      }

      function setnavDim(){
        navW=!navW?imageContainerW/4:navW;
        navH=(navW*imageH)/imageW;
        $(navigationThumb).height(parseFloat(navH));
        navigationThumbW=$(navigationThumb).width();
        navigationThumbH=$(navigationThumb).height();
        //			$(nav).css({
        //				overflow:"hidden",
        //				width:navigationThumbW,
        //				height: navigationThumbH+10
        //			})
      }

      function setnavLocatorDim(){
        var w = (imageContainerW*navW)/imageW - 2; // subtract twice the thickness of the locator
        if(w > navigationThumbW){
            w = navigationThumbW - 2;
        }
        $(navLocator).width(w);

        var h = (imageContainerH*navH)/imageH;
        if(h > navigationThumbH){
            h = navigationThumbH;
        }
        $(navLocator).height(h);

      }

      function setnavPos(){
        switch(navPos){
          case "TL":
            $(nav).css("left",0);
            $(nav).css("top",0);
            break;
          case "TR":
            $(nav).css("top",0);
            $(nav).css("left",(imageContainerW-navigationThumbW));
            break;
          case "BL":
            $(nav).css("top",(imageContainerH-navigationThumbH));
            break;
          case "BR":
            $(nav).css("left",(imageContainerW-navigationThumbW));
            $(nav).css("top",(imageContainerH-navigationThumbH));
            break;
          default:
            var dim=($(imageContainer).width())-navigationThumbW;
            $(nav).css("left", dim);
            break;
        }
      }

      function resetAllValue(){
        imageContainerW=$(imageContainer).width();
        imageContainerH=$(imageContainer).height();
        cont_isHoriz= imageContainerH < imageContainerW;
        imageH=$(image).height();
        imageW=$(image).width();

        setnavDim();
        setnavLocatorDim();
        //setnavPos();
      }

      function fullScreen(){
        if(!image) return;
        $(image).width("");
        $(image).height("");
        if($.browser.msie) $(nav).show();
        else
          $(nav).fadeIn(500);
        imageContainer.oldW=$(imageContainer).css("width");
        imageContainer.oldH=$(imageContainer).css("height");
        imageContainer.style.width= $(window).outerWidth();
        $(window).bind("resize", function(){fullScreen();});
        resetAllValue();
      }


    });
  };

  jQuery.fn.extend (
  {
    getMouseX : function (e)
    {
      var mouseX;
      if ($.browser.msie) {
        mouseX = event.clientX + document.body.scrollLeft;
      } else {
        mouseX = e.pageX;
      }
      if (mouseX < 0) {
        mouseX = 0;
      }
      return mouseX;
    },
    getMouseY : function (e)
    {
      var mouseY;
      if ($.browser.msie) {
        mouseY = event.clientY + document.body.scrollTop;
      } else {
        mouseY = e.pageY;
      }
      if (mouseY < 0) {
        mouseY = 0;
      }
      return mouseY;
    }
  });

})(jQuery);
