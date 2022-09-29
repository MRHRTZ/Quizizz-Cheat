<?php
$uas = array();
$stream = fopen("uaList.txt", "r");
while (($line = fgets($stream)) !== false) {
    array_push($uas, $line);
}

echo $uas[array_rand($uas, 1)];