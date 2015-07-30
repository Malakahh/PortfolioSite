<?php
	require_once 'config.php';
	require_once LIB_MOBILE_DETECT;

	class StylesheetHandler
	{
		private $detect;

		function __construct()
		{
			$this->detect = new Mobile_Detect();
		}

		function UseStylesheet()
		{
			if (!$this->detect->isMobile())
			{
				$this->UseDesktopStylesheet();
			}
		}

		private function UseDesktopStylesheet()
		{
			$aboveFoldStyle = file_get_contents(DIR_CSS . "AboveFold.css");
			$navStyle = file_get_contents(DIR_CSS . "navigation.css");
			$lightbox = file_get_contents(DIR_CSS . "lightbox.css");
			echo "<style>\n" . $aboveFoldStyle . "\n" . $navStyle . "\n" . $lightbox . "\n</style>";
		}
	}
?>