/* global siteList */
/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="SiteMap.js" />
/// <reference path="../libs/history.js/scripts/bundled-uncompressed/html5/jquery.history.js" />

var category, item;

function DecodeUrl(url)
{
	var pageUrl = (typeof url === "undefined") ? window.location.href.split("//")[1] : url;
	var split = pageUrl.split('/');
	category = (typeof split[2] !== "undefined" && split[2].length > 0) ? split[2] : undefined;
	item = (typeof split[3] !== "undefined" && split[3].length > 0) ? split[3] : undefined;
}

function EncodeUrl() {
	var base = "/PortfolioSite/";
	
	if (typeof category !== "undefined" && siteList.hasOwnProperty(category))
	{
		if (typeof item !== "undefined")
		{
			if (siteList[category].hasOwnProperty(item))
			{
				return base + siteList[category][item];
			}
			else
			{
				return base + "404.php";	
			}			
		}
		
		return base + "Pages/" + category + ".php";
	}
	else
	{
		return base + "404.php";
	}
}

function Rebind()
{
	$(".internallink").click(function(event) {
		event.preventDefault();
		DecodeUrl($(this).prop("href").split("//")[1]);
		ChangeContent(EncodeUrl());
	});
}

var scriptStateChange = false;
function PushState(data,title,url) {
	scriptStateChange = true;
	History.pushState(data, title, url);
	scriptStateChange = false;
}

function ChangeContent(target) {
	$.get(target, function(data) {
		if (target != undefined)
		{
			var url = "/PortfolioSite/";
			if (typeof category !== "undefined")
			{
				url += category + "/";
				if (typeof item !== "undefined")
				{
					url += item;
				}
			}

			PushState(null, null, url);
			$("#middle").html(data); //override page content with new content
			Rebind();
		}
	});
}

$(document).ready(function() {
	var siteMap;
	
	window.onstatechange = function () {
		if (!scriptStateChange)
		{
			DecodeUrl();
			category = (typeof category === 'undefined') ? "About" : category;
			
			if (typeof siteMap !== "undefined")
			{
				console.log("Category: " + category);
				siteMap.transition.currentLocation = category;
				siteMap.transition.currentLCoord = siteMap.transition.locations[category].clone();
			}
			
			ChangeContent(EncodeUrl());
		}
	};
	
	window.onstatechange();

	//Load map
	siteMap = new SiteMap((siteList.hasOwnProperty(category)) ? category : "About");
	var transitionInProgress = false;

	//Intercept nav clicks
	$(".navlink").click(function(event) {
		event.preventDefault();
		function OnTransitionEnd()
		{
			$("#content").show();
			transitionInProgress = false;
		}

		if (!transitionInProgress)
		{
			category = $(this).html();
			item = undefined;
			
			if (siteList.hasOwnProperty(category))
			{
				transitionInProgress = true;
				$("#content").hide();
				siteMap.StartTransition(category, OnTransitionEnd);
			}
			
			ChangeContent(event.target);
		}
	});
	
	
});