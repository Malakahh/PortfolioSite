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
			$linkHandler = file_get_contents(LOC_JS . "DesktopLinkHandler.js");
			echo "<script type=\"text/javascript\">\n" . $linkHandler . "\n</script>";
		}
	}
?>