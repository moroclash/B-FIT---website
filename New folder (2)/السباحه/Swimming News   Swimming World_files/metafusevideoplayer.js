///MFICOMPRESS
/// <reference path="jquery-1.11.0-vsdoc.js" />
/// <reference path="MetafuseBase.js" />

/***************************************************
Popup Video Player
****************************************************/
function MetafuseVideoPlayer(streamerBaseUrl, downloadBaseUrl)
{
	this.PlayerID = "popupVideoPlayer";
	this.StreamerBaseUrl = null;
	this.DownloadBaseUrl = null;
	//this.FlashSwfUrl = flashSwfUrl;
	this.VeilElement = null;
	this.VeilElementPreviousZIndex = null; //in case the veil is already in use this property helps us keep track of that
	this.IsUsePopupPlayer = null;

	//default width of the popup layer
	this.Width = "862"; //  "875";
	//default height of the popup layer
	this.Height = "485";


	var self = this;
	// Provide a reference to the open source video player object
	this.videoPlayer = null;
	// Provide a reference to the html5 video tag element
	this.$videoElement = null;

	this.IsFlashSupported = function ()
	{
		return _V_.flash.isSupported();
	};

	this.IsFlashPluginCurrent = function ()
	{
		return _V_.flash.version()[0] >= 10;
	};

	this.IsHtml5Supported = function ()
	{
		return _V_.html5.isSupported();
	};



	//this.IsFlashSupported = _V_.flash.isSupported();
	//this.IsHtml5Supported = _V_.html5.isSupported();


	// This can only be called after the page has loaded since it needs to attach handlers to all instances of the 
	// #videoThumbPlayer elements that exist on the form. Use ClientScript.RegisterStartupScript() to add this call to the form.
	this.SetupPopupPlayer = function ()
	{
		$(document).ready(function ()
		{
			self.IsUsePopupPlayer = !IsTouchDevice();

			/*
			if (usePopupPlayer != null)
			{
				self.IsUsePopupPlayer = usePopupPlayer;
			}

			self.IsUsePopupPlayer = true;
			
			if (window["BrowserTools"])
			{
				if (window["BrowserTools"].BrowserIsMobileDevice || window["BrowserTools"].BrowserIsTabletDevice)
				{
					self.IsUsePopupPlayer = false;
				}
			}
			*/

			if (!self.StreamerBaseUrl || self.StreamerBaseUrl == "")
			{
				self.StreamerBaseUrl = "rtmp://videos.projectinsight.net/cfx/st/";
			}
			if (!self.DownloadBaseUrl || self.DownloadBaseUrl == "")
			{
				self.DownloadBaseUrl = "http://cdn.projectinsight.net/";
			}

			if (!document.getElementById("vcontainer"))
			{
				$("body").append($("<div id='voverlay'></div>"));
				$("#voverlay").append($("<div id = 'vcontainer'></div>"));
			}


			var $anchors = $("a[rel=#voverlay]");

			if (!self.IsUsePopupPlayer)
			{
				$anchors.each(function (index, value)
				{
					/*
					var $videoImg = $(this).find("img");

					if (!$videoImg.length)
					{
					var $videoImgSpan = $("<span></span>");
					$videoImgSpan.css("margin", "6px");

					$videoImg = $("<img />");
					$videoImg.attr("id", aid + "_thumb");
					$videoImg.attr("src", "");
					$videoImg.attr("width", "40");
					$videoImg.attr("height", "20");

					$videoImgSpan.append($videoImg);
					$(this).append($videoImgSpan);
					}

					$(this).click(function (event)
					{
					event.preventDefault();
					});

					var anchorHtml = "";
					*/
					var aid = $(this).attr("id");
					var src = $(this).attr("href");
					var file;
					var fileUrl;

					if (src.indexOf(".swf") > 0)
					{
						if (src.indexOf("/") == 0)
						{
							src = "http://www.projectinsight.net" + src;
						}

						var url = $.url(src);

						file = url.param("file");
						fileUrl = file;

						if (fileUrl.indexOf(self.DownloadBaseUrl) != 0)
						{
							fileUrl = self.DownloadBaseUrl + file;
						}
					}
					else
					{
						fileUrl = src;
					}

					$(this).attr("href", fileUrl);

					/*

					var $newVideoElement = $(aid + "_video");

					if (!$newVideoElement.length)
					{
					// Set the player up
					$newVideoElement = $("<video></video>");
					$newVideoElement.attr("id", aid + "_video");
					$newVideoElement.attr("poster", $videoImg.attr("src"));
					$newVideoElement.attr("preload", "auto");
					$newVideoElement.attr("width", $videoImg.width());
					$newVideoElement.attr("height", $videoImg.height());
					}

					// Set the media up
					var $media = $("<source />");
					$media.attr("src", fileUrl);
					$media.attr("type", "video/mp4");
					$newVideoElement.append($media);

					// Hide the anchor element while we add elements to it in order to avoid any visual flickers.
					$(this).toggle();

					// Hide the thumbnail image
					$videoImg.hide();

					// Add the HTML5 video element to the anchor
					$(this).append($newVideoElement);

					// Show the anchor again.
					$(this).toggle();
					*/
				});
			}
			else
			{
				$anchors.overlay(
				{

					effect: 'apple',

					onClose: function ()
					{

						var $altVidDiv = $("#alternateVideoDiv");
						if ($altVidDiv.length)
						{
							$altVidDiv.hide();
						}

						if (self.videoPlayer != null)
						{
							self.videoPlayer.pause();
							try { self.videoPlayer.destroy(); } catch (ex) { }
							self.videoPlayer = null;
						}

						if (self.VeilElement != null)
						{

							//if the veil is already up for some other reason
							if (self.VeilElementPreviousZIndex != null)
							{
								self.VeilElement.style.zIndex = self.VeilElementPreviousZIndex;
							}
							else
							{
								self.VeilElement.style.display = "none";
								self.VeilElement.style.zIndex = 0;
							}
						}

						$("#vcontainer").empty();
					},


					// create video object for overlay

					onBeforeLoad: function ()
					{
						// Add a veil under the video container
						var $metafuseVeilObjectDiv = $("#mfivideoveil");
						if (!$metafuseVeilObjectDiv.length)
						{
							$("body").append($("<div id='mfivideoveil' class='video-veil'></div>"));
							self.VeilElement = document.getElementById("mfivideoveil");
							self.VeilElement.style.height = $(document).height() + "px";
							self.VeilElement.style.width = '100%';

							self.VeilElementPreviousZIndex = null;
						}
						else if (self.VeilElement == null)
						{
							self.VeilElement = document.getElementById("mfivideoveil");
							self.VeilElementPreviousZIndex = null;
							//veil is already in use
							if (self.VeilElement.style.display != "none")
							{

								self.VeilElementPreviousZIndex = self.VeilElement.style.zIndex;

							}

						}

						self.VeilElement.style.display = "";
						self.VeilElement.style.zIndex = 9999;


						// check and create overlay container
						var $video_overlay = $("#video_overlay");

						if (!$video_overlay.length)
						{
							$video_overlay = $("<div></div>");
							$video_overlay.attr(
							{
								id: "video_overlay"
							});
							$("#vcontainer").append($video_overlay);
						};

						var wmkText = "";
						var wmkLink = "";

						if (!self.IsFlashPluginCurrent() && !self.IsHtml5Supported())
						{
							wmkText = "The Adobe Flash player is required to view this video.";
							wmkLink = "http://www.adobe.com/go/getflash/";
						}

						c = wmkText ? $('<div></div>') : 0;

						if (c)
						{
							c.css(
							{
								position: 'absolute',
								left: '38px',
								top: '38px',
								padding: '0 0 0 0'
							});
							$("#vcontainer").append(c);
						};


						// for IE use iframe
						if (c && document.all)
						{
							var f = $('<iframe src="javascript:false"></iframe>');
							f.css(
							{
								position: 'absolute',
								left: 0,
								top: 0,
								width: '100%',
								height: '100%',
								filter: 'alpha(opacity=0)'
							});

							f.attr(
							{
								scrolling: "no",
								framespacing: 0,
								border: 0,
								frameBorder: "no"
							});

							c.append(f);
						};

						var d = c ? $(document.createElement("A")) : c;
						if (d)
						{
							d.css(
							{
								position: 'relative',
								display: 'block',
								'background-color': '#E4EFEB',
								color: '#837F80',
								'font-family': 'Lucida Grande,Arial,Verdana,sans-serif',
								'font-size': '11px',
								'font-weight': 'normal',
								'font-style': 'normal',
								padding: '1px 5px',
								opacity: .7,
								filter: 'alpha(opacity=70)',
								width: 'auto',
								height: 'auto',
								margin: '0 0 0 0',
								outline: 'none'
							});

							d.attr(
							{
								href: wmkLink
							});
							d.attr(
							{
								target: "_blank"
							});
							d.html(wmkText);
							d.bind('contextmenu', function (eventObject)
							{
								return false;
							});

							c.append(d);
						}

						var useStreamUrlInput = document.getElementById("useStreamUrlInput");
						if (!useStreamUrlInput)
						{
							useStreamUrlInput = document.createElement("input");
							useStreamUrlInput.id = "useStreamUrlInput";
							useStreamUrlInput.type = "hidden";
							useStreamUrlInput.value = "true";
						}

						var useStreamUrl = (useStreamUrlInput.value == "true");
						//useStreamUrl = false;

						// create SWF
						var src = this.getTrigger().attr("href");
						var source;
						var query;
						var path;
						var provider;
						var streamer;
						var file;
						var fileUrl;
						var playerUrl;

						if (src.indexOf(".swf") > 0)
						{
							// create SWF
							var url = $.url(src);

							source = url.attr("source");
							query = url.attr("query");
							path = url.attr("path");
							provider = url.param("provider");
							streamer = url.param("streamer");
							file = url.param("file");
							playerUrl = source.replace("?" + query, "");
							fileUrl = file;

							//self.FlashSwfUrl = playerUrl;

							if (fileUrl.indexOf(self.DownloadBaseUrl) != 0)
							{
								fileUrl = self.DownloadBaseUrl + file;
							}
						}
						else
						{
							fileUrl = src;
						}

						if (typeof (d) != 'number' && (!c || !c.html || !c.html()))
						{
							return;
						}

						var isYouTube = (fileUrl.indexOf("youtube.com") > 0);

						if (isYouTube)
						{
							// Set the player up
							var $iframe = $("<iframe></iframe>");
							//$iframe.attr("id", self.PlayerID);
							$iframe.attr("src", fileUrl);
							$iframe.attr("frameborder", "0");
							$iframe.attr("autoplay", "false");
							$iframe.attr("allowfullscreen", "true");
							$iframe.attr("width", self.Width);
							$iframe.attr("height", self.Height);
							$video_overlay.append($iframe);
						}
						else
						{
							if (self.IsFlashSupported() || self.IsHtml5Supported())
							{
								self.$videoElement = $("#" + self.PlayerID);

								if (!self.$videoElement.length)
								{
									// Set the player up
									self.$videoElement = $("<video></video>");
									self.$videoElement.attr("id", self.PlayerID);
									self.$videoElement.attr("class", "video-js vjs-default-skin");
									self.$videoElement.attr("controls", "true");
									self.$videoElement.attr("autoplay", "false");
									self.$videoElement.attr("preload", "auto");
									self.$videoElement.attr("width", self.Width);
									self.$videoElement.attr("height", self.Height);
									self.$videoElement.attr("data-setup", "{\"techOrder\": [\"html5\", \"flash\"]}");

									$video_overlay.append(self.$videoElement);
								}

								//self.$videoElement.html("");

								// Set the media up
								var $media = $("<source />");
								$media.attr("src", fileUrl);
								$media.attr("type", "video/mp4");
								self.$videoElement.append($media);


								// See if the player already exists
								// If a Flash swf URL was provided then set it.
								//if (self.FlashSwfUrl != null && self.FlashSwfUrl != "")
								//{
								//	_V_.options.flash.swf = self.FlashSwfUrl;
								//}

								try
								{
									if (self.videoPlayer == null)
									{
										self.videoPlayer = _V_(self.PlayerID);

										self.videoPlayer.src([{ type: "video/mp4", src: fileUrl}]);

										// Start playback when the player is ready
										self.videoPlayer.ready(function ()
										{
											var myPlayer = this;
											myPlayer.play();
										});

									}
								}
								catch (ex) { }

								var voverlay = document.getElementById("voverlay");
								var userProfileLink = document.getElementById("userProfileLink");
								var isYouTube = src.toLowerCase().indexOf("youtube.com") > 0;
								if (!isYouTube && userProfileLink)
								{
									voverlay.style.height = "540px";

									var playerElement = document.getElementById("video_overlay");
									var alternateVideoDiv = document.getElementById("alternateVideoDiv");
									if (!alternateVideoDiv)
									{
										alternateVideoDiv = document.createElement("div");
										alternateVideoDiv.id = "alternateVideoDiv";
									}
									alternateVideoDiv.style.backgroundColor = "white";
									alternateVideoDiv.style.color = "black";
									//alternateVideoDiv.style.height = "20px";
									//alternateVideoDiv.style.width = "200px";
									alternateVideoDiv.style.padding = "5px";
									alternateVideoDiv.style.position = "absolute";
									alternateVideoDiv.style.zIndex = 100;
									alternateVideoDiv.innerHTML = "<b><a href=\"javascript:void(0);\" onclick=\"MetafuseVideoPlayer.SwitchPopupPlayerToDownloadUrl(this,'" + src + "');\">Problems viewing the video?</a></b>";

									$("#vcontainer").append(alternateVideoDiv);
								}
							}
						}
					}
				});
			}
		});
	};

	this.SwitchPopupPlayerToDownloadUrl = function (hyperlink, src)
	{
		hyperlink.style.display = "none";

		src = src.replace("provider=rtmp", "provider=http");
		src = src.replace("streamer=" + this.StreamerBaseUrl + "&file=", "file=" + this.DownloadBaseUrl);

		var playerElement = document.getElementById("playerID");
		jwplayer(playerElement).load(src);
		jwplayer(playerElement).play();
	};

	this.SwitchEmbeddedPlayerToDownloadUrl = function (playerElementId, videoDownloadUrl, switchStreamHyperLink)
	{
		switchStreamLink.style.display = "none";
		var playerElement = document.getElementById(playerElementId);
		jwplayer(playerElement).load(videoDownloadUrl);
		jwplayer(playerElement).play();
	};

};
//create the video player
var MetafuseVideoPlayer = new MetafuseVideoPlayer();



function IsTouchDevice()
{
	var touch = (('ontouchstart' in window)
		  || (navigator.MaxTouchPoints > 0)
		  || (navigator.msMaxTouchPoints > 0));

	return touch;
};