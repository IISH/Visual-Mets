<?php
define("N", "\n");
define("DUMP_FILE", 'DUMP.html');

function dump($param){
    var_dump($param);
}

function dump_to_file($file_path, $data){

    ob_start();
    if(is_array($data)){
        print_r($data);
    }else if(is_string($data)){
        echo $data.N.N;
    }else{
        var_dump($data);
    }
    $var  = str_repeat('.', 40).'['.date('d-m-Y (H:i)').' sec:'.date('s').']'.str_repeat('.', 40).N;
    $var .= $_SERVER['REQUEST_URI'].N;
    $var .= str_repeat('.', 107).N;
    $var .= ob_get_contents();
    ob_end_clean();
    file_put_contents($file_path, $var, FILE_APPEND);
}

function dumpf($data, $file_path=false){
    dump_to_file((!$file_path)?DUMP_FILE:$file_path, $data);
}
?>