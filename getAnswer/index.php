<?php
error_reporting(0);
header('Content-Type: application/json; charset=utf-8');

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

$postUrl = 'https://game.quizizz.com/play-api/v4/proceedGame';

$hash = $_GET['hash'];
$playerId = $_GET['player_id'];
$questionId = $_GET['question_id'];
$questionType = $_GET['question_type'];
$time = $_GET['time'];

$postJson = new stdClass();
$postJson->roomHash = $hash;
$postJson->playerId = $playerId;
$postJson->response->attempt = 0;
$postJson->response->questionId = $questionId;
$postJson->response->questionType = $questionType;

if ($questionType == 'MCQ') {
    $postJson->response->response = 0;
} else if ($questionType == 'MSQ') {
    $postJson->response->response = [0];
} else if ($questionType == 'BLANK') {
    $resver2 = new stdClass();
    $resver2->version = "2.0";
    $resver2->text = "0";
    $resver2->media = null;
    $postJson->response->response = $resver2;
} else if ($questionType == 'OPEN') {
    $resver2 = new stdClass();
    $resver2->version = "2.0";
    $resver2->text = "0";
    $resver2->media = null;
    $postJson->response->response = $resver2;
}

$postJson->response->timeTaken = $time;
$postJson->response->isEvaluated = false;
$postJson->response->state = "attempted";
$postJson->response->provisional->scores->correct = 0;
$postJson->response->provisional->scores->incorrect = 0;
$postJson->response->provisional->scoreBreakups->correct->base = 0;
$postJson->response->provisional->scoreBreakups->correct->timer = 0;
$postJson->response->provisional->scoreBreakups->correct->streak = 0;
$postJson->response->provisional->scoreBreakups->correct->total = 0;
$postJson->response->provisional->scoreBreakups->correct->powerups = array();
$postJson->response->provisional->scoreBreakups->incorrect->base = 0;
$postJson->response->provisional->scoreBreakups->incorrect->timer = 0;
$postJson->response->provisional->scoreBreakups->incorrect->streak = 0;
$postJson->response->provisional->scoreBreakups->incorrect->total = 0;
$postJson->response->provisional->scoreBreakups->incorrect->powerups = array();
$postJson->response->provisional->teamAdjustments->correct = 0;
$postJson->response->provisional->teamAdjustments->incorrect = 0;

echo post($postUrl, $postJson);