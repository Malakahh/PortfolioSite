function HashToUrl(hash)
{
	return "/PortfolioSite/Pages/" + hash.replace("#", "") + ".php";
}

function ChangeContent(target) {
	$.get(target, function(data) {
		$("#content").html(data); //override page content with new content
	});
}

$(document).ready(function() {

	location.hash = (location.hash != "") ? location.hash : "#About"
	ChangeContent(HashToUrl(location.hash));

	//Load map
	LoadSiteMap();
	var transitionInProgress = false;

	//Intercept nav clicks
	$(".navlink").click(function(event) {

		function OnTransitionEnd()
		{
			$("#content").show();
			transitionInProgress = false;
		}

		if (!transitionInProgress)
		{
			transitionInProgress = true
			$("#content").hide();
			StartTransition("#" + $(this).html(), OnTransitionEnd);
			ChangeContent(event.target);
		}

		return false; //Cancel click event
	});
});