<?php
require_once( 'settings.php' );

$sg = new speedGraphSettings();
$sg->set();
cachedEcho($sg->get(),"application/javascript");