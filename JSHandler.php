<?php
	require_once 'config.php';
	require_once LIB_MOBILE_DETECT;

	class JSHandler
	{
		private $detect;

		function __construct()
		{
			$this->detect = new Mobile_Detect();
		}

		function UseJS()
		{
			if (!$this->detect->isMobile())
			{
				$this->UseDesktopJS();
			}
		}

		private function UseDesktopJS()
		{
			$siteMap = file_get_contents(LOC_JS . "SiteMap.js");
			$linkHandler = file_get_contents(LOC_JS . "DesktopLinkHandler.js");

			echo "<script src=\"libs/THREE/three.min.js\"></script>\n" .
				"<script src=\"libs/THREE/JSONLoader.js\"></script>\n" .
				"<script src=\"libs/THREE/THREEx.WindowResize.js\"></script>\n" .
				"<script src=\"libs/Bezier/bezier.js\"></script>\n" .
				"<script src=\"libs/MalImageZoom/MalImageZoom.js\"></script>\n" .
				"<script>\n" . 
				"MalImageZoom(new MalImageZoomDescription());\n" .
				$linkHandler . "\n" .
				$siteMap .
				"\n</script>";
		}
	}
?>