<?php
	require_once "config.php";
	require_once "StylesheetHandler.php";
	require_once "JSHandler.php";

	$ssHandler = new StylesheetHandler();
	$jsHandler = new JSHandler();
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<meta charset="UTF-8">
		<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
		<link href='http://aon-cdn.googlecode.com/files/myriadpro-regular_0.ttf' rel='stylesheet' type='text/css'>
		<?php
			echo "<base href=\"" . LOC_BASE . "\"/>";
			$ssHandler->UseStylesheet();
		?>
	</head>
	<body>
		<?php include "navigation.php"; ?>
		<div id="content">	
			<div id="top">
			</div>
			<div id="middleWrapper">
				<div id="middle">
				</div>
			</div>
			<div id="bottom"/>
			</div>
		</div>
		<?php
			echo "<script src=\"" . LOC_BASE . "libs/lightbox/lightbox.min.js\"></script>";
			$jsHandler->UseJS();
		?>
	</body>
</html>