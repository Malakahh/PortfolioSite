var MalAnimationRunning = MalAnimationRunning || false;

function MalImageZoomDescription() 
{
	this.UseClass = ".MalImageZoom";
	this.ApplyToTag = "img";
}

function MalImageZoom (IZDesc) 
{
	var time = 750;

	var prevTop, prevLeft, prevW, prevH, prevPos;
	var prevParent;
	var newTop;

	function ZoomIn(el) 
	{
		if (MalAnimationRunning)
			return;

		MalAnimationRunning = true;

		el.removeClass(IZDesc.UseClass.split('.').join(""));
		
		prevTop 	= el.offset().top;
		prevLeft 	= el.offset().left;
		prevW 		= el.width();
		prevH 		= el.height();
		prevParent 	= el.parent();
		prevPos 	= el.css("position");

		newTop = 25;

		var newHeight 	= $(window).height() - 50;
		var newWidth 	= prevW * (newHeight / prevH);
		if (newWidth >= $(window).width() - 50)
		{
			newWidth 	= $(window).width() - 50;
			newHeight 	= prevH * (newWidth / prevW);
			newTop 		= $(window).height()/2 - newHeight/2;
		}
		
		el.appendTo("body");
		el.css({
			position: 	"fixed",
			top: 		prevTop - $(window).scrollTop(),
			left: 		prevLeft,
			width: 		prevW,
			height: 	prevH,
			zIndex: 	"9999"
		});

		el.animate({
			top: 		newTop,
			left: 		$(window).width()/2 - newWidth/2,
			width: 		newWidth,
			height: 	newHeight
		}, time, function() {
			el.off();
			el.click(function() {
				ZoomOut(el);
				return false;
			});
			MalAnimationRunning = false;
		});
	}

	function ZoomOut(el) 
	{
		if (MalAnimationRunning)
			return;

		MalAnimationRunning = true;

		el.css({
			position: 	"absolute",
			top: 		$(window).scrollTop() + newTop
		});

		el.animate({
			top: 		prevTop,
			left: 		prevLeft,
			width: 		prevW,
			height: 	prevH
		}, time, function() {
			el.appendTo(prevParent);
			el.css("position", prevPos);
			el.addClass(IZDesc.UseClass.split('.').join(""));
			el.off();
			el.removeAttr("style");
			MalAnimationRunning = false;
		});
	}

	$(document).ready(function() {

		$(document).on("click", IZDesc.UseClass, function() {
			ZoomIn($(this));
			return false;
		});
	});
}