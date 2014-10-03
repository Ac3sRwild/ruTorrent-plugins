<?php
$ip = file_get_contents('http://phihag.de/ip/');
$lan_ip = $_SERVER['SERVER_ADDR'];
//$ip = file_get_contents("http://icanhazip.com/");

if ($ip) {
        $theSettings->registerPlugin($plugin["name"],$pInfo["perms"]);
        $jResult .= "plugin.ip = ".escapeshellarg($ip)."; plugin.lan_ip = ".escapeshellarg($lan_ip).";";
}
else
        $jResult .= "plugin.disable();";