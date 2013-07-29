<?php
    include_once('config.php');

    function minify($file, $filesize, $minify=true){

        if(file_exists($file)){
            if(is_writable($file)){ //
                if($minify){
                    $content = JSMin::minify(file_get_contents($file));
                }else{
                    $content = file_get_contents($file);
                }

                file_put_contents(MAIN_LIB_FILE_MIN, $content, FILE_APPEND);
                echo '<span style="color: #029a0d;">&#10004;</span> '.$file.' <span style="color: #b0b0b0; font-style: italic;">'.$filesize.'</span><br />';
            }else{
                echo '<span style="color: darkred;">&#10006; '.$file.' (error on writing)</span><br />';
            }

        }else{
            echo '<span style="color: darkred;">&#10006; '.$file.' (file dos not exist)</span><br />';
        }
    }
?>
<!DOCTYPE HTML>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <title>:: metsviewer minify ::</title>

    <link href="../css/bootstrap.css" rel="stylesheet" type="text/css" media="screen" />

    <style type="text/css">

        .container{
        }
    </style>
</head>
<body>

<form class="container" method="POST" action="<?php echo $_SERVER['PHP_SELF']; ?>" style="border-radius: 15px; padding: 20px; background: #e2e2e2; margin-bottom:20px;margin-top: 30px;">
    <div class="row-fluid">
        <div class="span8"> <h1>Javascript <span style="color: #6996cc;">minifier</span></h1></div>
        <div class="span4">
            <button type="submit" name="minify" class="btn btn-primary btn-large pull-right" style="margin-top: 8px;">Start</button>
        </div>
    </div>
    <div class="row-fluid">
    <?php

    if (ob_get_level() == 0){
        ob_start();
    }
    if(isset($_POST['minify'])){
        // start by removing the file
        @unlink(MAIN_LIB_FILE_MIN);
        $dir =  new Dirhandler();

        file_put_contents(MAIN_LIB_FILE_MIN, COMMENT);


        // dependencies libs ....................................................................................................
        $jquery = $dir->getFiles(JQUERY, '.js');
        echo '<h3>jQuery files</h3>';
        echo '<pre style="color: #5a5a5a;">';
        for($q=0; $q < count($jquery); $q++){
            ob_flush();
            flush();
            usleep(10000);
            minify(JQUERY.$jquery[$q], $dir->formatBytes(filesize( JQUERY.$jquery[$q])), false);
        }
        echo '</pre>';


        $bootstrap = $dir->getFiles(BOOTSTRAP, '.js');
        echo '<h3>Bootstrap files</h3>';
        echo '<pre style="color: #5a5a5a;">';
        for($b=0; $b < count($bootstrap); $b++){
            ob_flush();
            flush();
            usleep(10000);
            minify(BOOTSTRAP.$bootstrap[$b], $dir->formatBytes(filesize( BOOTSTRAP.$bootstrap[$b])), false);
        }
        echo '</pre>';

        // minify utils ....................................................................................................


        $utils = $dir->getFiles(JS_UTILS, '.js');

        echo '<h3>Utilities files</h3>';
        echo '<pre style="color: #5a5a5a;">';
        for($j=0; $j < count($utils); $j++){
            ob_flush();
            flush();
            usleep(10000);
            minify(JS_UTILS.$utils[$j], $dir->formatBytes(filesize( JS_UTILS.$utils[$j])));
        }
        echo '</pre>';

        // minify lib ....................................................................................................

        $lib = $dir->getFiles(JS_LIB, '.js');


        // add first file
        file_put_contents(MAIN_LIB_FILE_MIN, JSMin::minify(file_get_contents(MAIN_LIB_FILE)), FILE_APPEND);
        echo '<h3>Library files</h3>';
        echo '<pre style="color: #5a5a5a;">';
        echo '<span style="color: #029a0d;">&#10004;</span> '.MAIN_LIB_FILE.' <span style="color: #b0b0b0; font-style: italic;">'.$dir->formatBytes(filesize( MAIN_LIB_FILE)).'</span><br />';

        for($i=0; $i < count($lib); $i++){

            //echo str_pad('',4096)."\n";

            ob_flush();
            flush();
            usleep(10000);

            minify(JS_LIB.$lib[$i], $dir->formatBytes(filesize( JS_LIB.$lib[$i])));

        }
        echo '</pre>';

        ob_end_flush();
    }
    ?>
     </div>
     <?php if(isset($_POST['minify'])): ?>
     <div class="row-fluid">
        loacation minified file:
        <?php
        echo '<a href="../js/mets2viewer.min.js" class="btn btn-success" target="_blank">mets2viewer.min.js  '.$dir->formatBytes(filesize(MAIN_LIB_FILE_MIN)).')</a>';
        ?>
     </div>
     <?php endif; ?>
</form>