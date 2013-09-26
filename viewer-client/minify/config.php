<?php
    include('debug.php');
    include('classes/Dirhandler.class.php');
    include('classes/JSMin.class.php');

    define('DS' ,"/");
    define('BASE' , preg_replace("/minify+.*$/", '', __FILE__));
    define('JS_DIR' ,BASE.'js'.DS);

    define('JQUERY' ,JS_DIR.'jquery'.DS);

    define('BOOTSTRAP' ,JS_DIR.'bootstrap'.DS);

    define('JS_LIB' ,JS_DIR.'lib'.DS);

    define('JS_UTILS' ,JS_DIR.'utils'.DS);

    // the main js file
    define('MAIN_LIB_FILE' ,JS_DIR.'mets2viewer.js');


    define('MAIN_LIB_FILE_MIN' ,JS_DIR.'mets2viewer.min.js');


define('COMMENT' ,"/** ----------------------------------------- *
 *      Written by the Ontwikkelfabriek       *
 * ------------------------------------------ */
");
?>