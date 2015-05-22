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
	console.log("Decode - category: " + category + " item: " + item);
}

function EncodeUrl() {
	console.log("Encode - category: " + category + " item: " + item);
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
			
			console.log("url: " + url);
			History.pushState(null, null, url);
			$("#middle").html(data); //override page content with new content
		}
	});
}

$(document).ready(function() {
	DecodeUrl();

	category = (typeof category === 'undefined') ? "About" : category;

	ChangeContent(EncodeUrl());

	//Load map
	var siteMap = new SiteMap((siteList.hasOwnProperty(category)) ? category : "About");
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