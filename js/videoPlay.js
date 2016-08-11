var videos = document.getElementsByTagName('video');
var playBtns = document.getElementsByClassName('videoOverlayPlayBtn');	

for (let i = 0; i < videos.length; i++)
{
	videos[i].addEventListener('click', function(e) {
		if (e.target.paused)
		{
			e.target.play();
		}
		else
		{
			e.target.pause();
		}
	}, false);

	videos[i].addEventListener('play', function(e) {
		playBtns[i].style.display = "none";
	}, false);

	videos[i].addEventListener('pause', function(e) {
		playBtns[i].style.display = "initial";
	}, false);
}
