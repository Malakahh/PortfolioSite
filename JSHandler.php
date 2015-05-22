<?php
	require_once 'config.php';
	require_once LIB_MOBILE_DETECT;

	class JSHandler
	{
		private $detect;
		private $itemsFolder;

		function __construct()
		{
			$this->detect = new Mobile_Detect();
			$this->itemsFolder = "Items";
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
			$itemsList = $this->GenerateItemsList();

			echo "<script src=\"libs/THREE/three.min.js\"></script>\n" .
				"<script src=\"libs/THREE/JSONLoader.js\"></script>\n" .
				"<script src=\"libs/THREE/THREEx.WindowResize.js\"></script>\n" .
				"<script src=\"libs/Bezier/bezier.js\"></script>\n" .
				"<script src=\"libs/MalImageZoom/MalImageZoom.js\"></script>\n" .
				"<script src=\"libs/history.js/scripts/bundled-uncompressed/html5/jquery.history.js\"></script>\n" .
				"<script>\n" . 
				"MalImageZoom(new MalImageZoomDescription());\n" .
				"var siteList = JSON.parse(\"" . str_replace("\"", "\\\"", $itemsList) . "\");\n" .
				$linkHandler . "\n" .
				$siteMap .
				"\n</script>";
		}
		
		private function GenerateItemsList()
		{
			$arr = [];
			
			foreach (scandir(DIR_BASE . $this->itemsFolder) as $category)
			{
				if (!in_array($category,array(".","..")))
				{
					$arr[$category] = [];
					foreach (scandir(DIR_BASE . $this->itemsFolder . "/" . $category) as $item)
					{
						if (!in_array($item,array(".","..")))
						{
							$i = explode(".", $item);
							$i = $i[0];
							
							$arr[$category][$i] = $this->itemsFolder  . "/" . $category . "/" . $item;
						}
					}
				}
			}
			
			return json_encode($arr);
		}
	}
?>