<?php
require_once( '../plugins/speedgraph/settings.php');
$theSettings->registerPlugin($plugin["name"],$pInfo["perms"]);
$sg = speedGraphSettings::load();
$jResult.=$sg->get();
