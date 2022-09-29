<?php
function post($url, $data)
{
    $data_string = json_encode($data);
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    curl_close($ch);
    return $result;
}

$pin = $_GET['pin'];
$postData = new stdClass();
$postUrl = "https://game.quizizz.com/play-api/v5/checkRoom";
$postData->roomCode = $pin;
$check = post($postUrl, $postData);
echo $check;
