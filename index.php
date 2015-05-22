<?php
	require_once "config.php";
	require_once "StylesheetHandler.php";
	require_once "JSHandler.php";

	$ssHandler = new StylesheetHandler();
	$jsHandler = new JSHandler();
?>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<meta charset="UTF-8">
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
		<?php
			echo "<base href=\"" . LOC_BASE . "\"/>";
			$ssHandler->UseStylesheet();
			$jsHandler->UseJS();
		?>
	</head>
	<body>
		<?php include "navigation.php"; ?>
		<div id="content">	
			<div id="top">
			</div>
			<div id="middle">
			</div>
			<div id="bottom"/>
			</div>
		</div>
	</body>
</html>