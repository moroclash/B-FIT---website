
// Absolute Banner Manager : Autorotate Script
// Copyright(c) XIGLA SOFTWARE - http://www.xigla.com


// Create ABM Tag reference
document.createElement("abm");


var _xlaABMrotating = 0;

function xlaABMloadbanners(){


    // Flash detection
   var flashenabled = 0;
    var MM_contentVersion = 6;
    var plugin = (navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"]) ? navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin : 0;
    if ( plugin ) {
    	flashenabled=1
    }  else if (navigator.userAgent && navigator.userAgent.indexOf("MSIE")>=0 && (navigator.appVersion.indexOf("Win") != -1)) {
		flashenabled = 1;
   }

   

 	// Look ABM tags
 	var arr = document.getElementsByTagName("abm");
	var myobj=null;
    var bannerparams = '';
	for (var i=0; i< arr.length; i++){
          myobj=arr.item(i)
          var z = "";
          var k="";
          myobj.id="__xlaABMadlayer_" + i;

          if	((typeof myobj.attributes.zone!='undefined') && (myobj.attributes.zone!==null)) z = myobj.attributes.zone.value
          if	((typeof myobj.attributes.keywords!='undefined') && (myobj.attributes.keywords!==null)) k = myobj.attributes.keywords.value
		 // 0 : Zoneid, 1 : Keywords : 
          bannerparams = bannerparams + z + "_" + k + "|";
         var  c= "?ln=" + i + "&z=" + z + "&k=" + escape(k) + "&fl=" + flashenabled + "&" + Math.random();
          
          var autorotate = '';
          if	((typeof myobj.attributes.autorotate!='undefined') && (myobj.attributes.autorotate!==null)) autorotate = myobj.attributes.autorotate.value;
          if (autorotate!="no" && autorotate!="off" && autorotate!="false") autorotate='';

          if (_xlaABMrotating==0 || autorotate==''){
               var head=document.getElementsByTagName('head')[0];
                var s=document.createElement('script'); 
                s.type= 'text/javascript'; 
                s.src="//ads.swimmingworldmagazine.com/absolutebm.aspx" + c;
                head.appendChild(s);
          }
	}   

    _xlaABMrotating=1;

setTimeout("xlaABMloadbanners()",600000);

   
}


function _xlaABMdg(l,w){
    
    if (typeof jQuery != 'undefined'){
    	 $("#__xlaABMadlayer_" + l).fadeOut(50);
         $("#__xlaABMadlayer_" + l).html(w);
         $("#__xlaABMadlayer_" + l).fadeIn(2000);
        
    } else {
    	 document.getElementById("__xlaABMadlayer_" + l).innerHTML = w;
    }
    
}


// Start Banner Loading upon page load
$(document).ready(function() {
  // Handler for .ready() called.
  xlaABMloadbanners()
});

 




