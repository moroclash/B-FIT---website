

/**
* hoverIntent r6 // 2011.02.26 // jQuery 1.5.1+
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne brian(at)cherne(dot)net
*/
(function ($) { $.fn.hoverIntent = function (f, g) { var cfg = { sensitivity: 7, interval: 100, timeout: 0 }; cfg = $.extend(cfg, g ? { over: f, out: g} : f); var cX, cY, pX, pY; var track = function (ev) { cX = ev.pageX; cY = ev.pageY }; var compare = function (ev, ob) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); if ((Math.abs(pX - cX) + Math.abs(pY - cY)) < cfg.sensitivity) { $(ob).unbind("mousemove", track); ob.hoverIntent_s = 1; return cfg.over.apply(ob, [ev]) } else { pX = cX; pY = cY; ob.hoverIntent_t = setTimeout(function () { compare(ev, ob) }, cfg.interval) } }; var delay = function (ev, ob) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); ob.hoverIntent_s = 0; return cfg.out.apply(ob, [ev]) }; var handleHover = function (e) { var ev = jQuery.extend({}, e); var ob = this; if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t) } if (e.type == "mouseenter") { pX = ev.pageX; pY = ev.pageY; $(ob).bind("mousemove", track); if (ob.hoverIntent_s != 1) { ob.hoverIntent_t = setTimeout(function () { compare(ev, ob) }, cfg.interval) } } else { $(ob).unbind("mousemove", track); if (ob.hoverIntent_s == 1) { ob.hoverIntent_t = setTimeout(function () { delay(ev, ob) }, cfg.timeout) } } }; return this.bind('mouseenter', handleHover).bind('mouseleave', handleHover) } })(jQuery);


function SetupNavigationMenu(menuItemClass, menuItemChildClass)
{

	hiConfig = {
		sensitivity: 3, // number = sensitivity threshold (must be 1 or higher)
		interval: 150, // number = milliseconds for onMouseOver polling interval
		timeout: 150,
		over: function (event)
		{
			var $div = $(this).children('.' + menuItemChildClass);
			var data = "nav" + $div[0].id;

			//if we have data (then it was diverted to JS)
			if (window[data])
			{
				var html = window[data] + "<div class=\"clear\"></div>";
				$div.html('');
				$div.html(html);
			}

			$div.stop(true, true).fadeIn({ duration: 'fast' });


		},
		out: function ()
		{
			$(this).children('.' + menuItemChildClass).stop(true, true).fadeOut({ duration: 'fast',
				complete: function ()
				{
					var $div = $(this).children('.' + menuItemChildClass);

					$div.html('');
				}
			});
		}
	}
	var $divs = $('.' + menuItemClass);

	$divs.hoverIntent(hiConfig);

};

//modifies the dom so that the layers show on the touch screens
function ModDom(isMouseOut)
{
	var modDomSpan = document.getElementById("modDomSpan");
	if (modDomSpan)
	{
		if (isMouseOut)
		{
			modDomSpan.style.display = "none";
		}
		else
		{
			modDomSpan.style.display = "block";
		}
	}
};
