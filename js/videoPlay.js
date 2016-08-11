var videos;

window.onload = function()
{
	videos = document.getElementsByTagName('video');

	for (i = 0; i < videos.length; i++)
	{
		videos[i].addEventListener('click',function(e){
			if (e.target.paused)
				e.target.play()
			else
				e.target.pause();
		},false);
	}
}