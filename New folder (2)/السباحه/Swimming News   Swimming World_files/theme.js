jQuery(document).ready(function( $ ) {

	"use strict";


	/* Newsticker */
	$(".newsticker").flexslider({
		direction: "vertical",
		animation: "slide",
		pauseOnHover: true,
		controlNav: false,
		nextText: '<i class="fa fa-chevron-up"></i>',
		prevText: '<i class="fa fa-chevron-down"></i>'
	});

	/* Slider */
	$(".wpc-slider").flexslider({
		animation: "slide",
		pauseOnHover: true,
		controlNav: false,
		smoothHeight: true,
		slideshow: false,
		nextText: '<i class="fa fa-arrow-right"></i>',
		prevText: '<i class="fa fa-arrow-left"></i>',
	});

	/* Top Search */
	$("#top-search-access").click(function(){
		var obj = $(this);
		var is_active = obj.hasClass("active");
		if( is_active ) {
			$(".ticker").animate({ top: "0" }, 300, function(){
				obj.removeClass("active");
			});
			obj.html('<i class="fa fa-search"></i>');
		} else {
			$(".ticker").animate({ top: "-60px" }, 300, function(){
				obj.addClass("active");
				$(".top-search-input").focus();
			});
			obj.html('<i class="fa fa-times"></i>');
		}

		return false;
	});


	function getGridSize() {
		return (window.innerWidth < 768) ? 2 : 
			   (window.innerWidth < 992) ? 3 : 4;
	}

	/* Carousel */
	function carouselInit(){
		$(".wpc-carousel").each(function(){
			var $carousel = $(this);
			var $min = getGridSize();
			var $max = getGridSize();

			if( $(this).parents('.widget-sidebar:first').length ) {
				$min = 1;
				$max = 1;
			} else if( $(this).parents('.widget-primary:first').length ) {
				$min = 2;
				$max = 3;
			} else if( $(this).parents('.widget-top:first').length ) {
				$min = getGridSize();
				$max = getGridSize();
			}

			$carousel.find(".carousel").carouFredSel({
				responsive: true,
				width: '100%',
				auto: false,
				items: {
					visible: { min: $min, max: $max },
				},
				scroll: {
					items: 1,
					easing: "linear",
					duration: 800,
				},
				prev: $carousel.find(".carousel-nav .prev"),
				next: $carousel.find(".carousel-nav .next"),
			});

		});
	}

	$(window).load(function(){
		carouselInit();
	});

	var resizeTimer;
	$(window).resize(function(){
		clearTimeout( resizeTimer );
		resizeTimer = setTimeout( carouselInit(), 100 );
	});


	/* Flickr */
	$(".flickr-images a").hover(function(){
		$(this).parent().siblings().find("a").stop().animate({ opacity: ".3" }, 300);
	}, function() {
		$(this).parent().siblings().find("a").stop().animate({ opacity: "1" }, 300);
	});

	/* Stream tab */
	$(".post-stream-tab").tabs();

	/* Menu */
	$(".site-menu li, .top-menu li").hover(function(){
		$(this).find("ul").first().stop().slideToggle(300);
	});

	/* Back to top */
	$(".back-to-top a").click(function(){
		$("html, body").animate({ scrollTop: 0 }, 800);
		return false;
	});

	$(".sidebar-access-link").click(function(){
		$(".sidebar").css({ "display": "block" });
		$(".sidebar").animate({ "right": "420" }, 300);
		return false;
	});

	/* Share */
	$(".social-share-access").click(function(){
		var $is_on = $(this).hasClass("on");
		if($is_on) {
			$(".share-links").stop().animate({ opacity: 0 }, 300);
			$(this).removeClass("on");
		} else {
			$(".share-links").stop().animate({ opacity: 1 }, 300);
			$(this).addClass("on");
		}
		return false;
	});

	/* off canvas */
	$(".off-canvas-menu li").has("ul").append("<span class='off-canvas-child'>+</span>");
	$(".off-canvas-child").on("click",function(){
		var $parent = $(this).parent();
		$parent.find("ul:first").stop().slideToggle(300);
		return false;
	});
	$(".mobile-menu-button").click(function(){
		var $is_on = $(this).hasClass("on");
		if( $is_on ) {
			$("body").stop().animate({ "left": "0" }, 300);
			$("#off-canvas-nav").animate({ "right": "-300px" }, 300);
			$(this).removeClass("on");
		} else {
			$("body").stop().animate({ "left": "-300px" }, 300);
			$("#off-canvas-nav").animate({ "right": "0" }, 300);
			$(this).addClass("on");
		}
		return false;
	});
	$(".off-canvas-close").click(function(){
		$("body").stop().animate({ "left": "0" }, 300);
		$("#off-canvas-nav").animate({ "right": "-300px" }, 300);
		$(".mobile-menu-button").removeClass("on");
		return false;
	});

	/* Fitvids */
	$('.oembed-wrap').fitVids();

	/* PrettyPhoto */
	$(".gallery").each(function(){
		var _id = $(this).attr("id");
		$(this).find("a").attr("rel", "prettyPhoto["+_id+"]");
	});
	$("a[rel^=prettyPhoto]").prettyPhoto({
		social_tools: "",
	})

});