<?php
header('content-type: application/json; charset=utf-8');

    $callback = $_GET["callback"];

    $data = array("template" => trim(file_get_contents('mets2.template.html')));

    echo $callback.'('.json_encode($data) .')';
exit;
?>