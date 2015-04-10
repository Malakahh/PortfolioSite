function ChangeContent(target) {
	$.get(target, function(data) {
		$("#content").html(data); //override page content with new content
	});
}

$(document).ready(function() {
	//Intercept nav clicks
	$(".navlink").click(function(event) {
		ChangeContent(event.target);
		return false; //Cancel click event
	});
});