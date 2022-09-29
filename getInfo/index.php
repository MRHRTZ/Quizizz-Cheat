<?php
function fetch($url)
{
    $ip = $_SERVER['REMOTE_ADDR'];
    $setUA = 'Opera/9.80 (BlackBerry; Opera Mini/4.5.33868/37.8993; HD; en_US) Presto/2.12.423 Version/12.16';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_REFERER, $url);
    curl_setopt($ch, CURLOPT_USERAGENT, $setUA);
    $ret = curl_exec($ch);
    curl_close($ch);
    return $ret;
}

$hash = $_GET['hash'];
$getUrl = "https://quizizz.com/_api/main/game/$hash/quiz-info";
echo fetch($getUrl);