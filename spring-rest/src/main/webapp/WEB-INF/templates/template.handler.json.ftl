<@compress single_line=true>

    <#assign callback = callback/>

    <#if callback?has_content>${callback}({</#if>"template":"<div class='mets-toolbar'>
    <div class='mets-bar' style='padding: 0 2px 5px 2px;'>
        <ul class='mets-breadgrumb'></ul>
    </div>

    <div class='mets-bar'>
        <div class='mets-button-wrapper'>
            <a href='#' class='mets-button'><i class='mets-icon reset'></i></a>
        </div>
        <div class='mets-button-wrapper'>
            <a href='#' class='mets-button'><i class='mets-icon zoomin'></i></a>
            <a href='#' class='mets-button'><i class='mets-icon zoomout'></i></a>
            <a href='#' class='mets-button'><i class='mets-icon fullsize'></i></a>
        </div>
        <div class='mets-button-wrapper'>
            <a href='#' class='mets-button'><i class='mets-icon darker'></i></a>
            <a href='#' class='mets-button'><i class='mets-icon lighter'></i></a>
        </div>
        <div class='mets-button-wrapper'>
            <a href='#' class='mets-button'><i class='mets-icon contrast'></i></a>
            <a href='#' class='mets-button'><i class='mets-icon contrastInvert'></i></a>
        </div>
        <div class='mets-button-wrapper'>
            <a href='#' class='mets-button'><i class='mets-icon rotateleft'></i></a>
            <a href='#' class='mets-button'><i class='mets-icon rotateright'></i></a>
        </div>
        <div class='mets-button-wrapper mets-align-center'>
            <a href='#' class='mets-button'><i class='mets-icon firstpage'></i></a>
            <a href='#' class='mets-button'><i class='mets-icon previous'></i></a>
            <div class='mets-label pagination-label'>0&nbsp; / 0&nbsp;</div>
            <a href='#' class='mets-button'><i class='mets-icon next'></i></a>
            <a href='#' class='mets-button'><i class='mets-icon lastpage'></i></a>
        </div>
        <div class='mets-button-wrapper mets-align-right'>
            <a href='#' class='mets-button'><i class='mets-icon transcription'></i></a>
            <a href='#' class='mets-button'><i class='mets-icon overview'></i></a>
            <a href='#' class='mets-button'><i class='mets-icon fullscreen'></i></a>
        </div>

        <div class='mets-clear'></div>
    </div>
</div>
<div class='mets-message mets-error mets-hide'></div>
<div class='mets-canvas'>

    <div class='mets-loader-frame mets-hide'>
        <div class='mets-loader'>
            <div class='mets-loader-img'></div>
            <div class='mets-loader-text'>loading page</div>
        </div>
    </div>
    <img src='' class='mets-image mets-hide' />
    <div class='mets-text mets-text-vertical mets-hide'></div>
    <div class='mets-logo-holder'></div>
</div>
<div class='mets-toolbar mets-toolbar-footer'>
    <div class='mets-bar'>
        <div class='mets-label mets-text-label mets-align-left'>
            <div id='mets-description-link' class='mets-hide'><b>Permanent link to description: </b><span></span></div>
            <div id='mets-image-link' class='mets-hide'><b>Permanent link to image: </b><span></span></div>
        </div>
        <div class='mets-button-wrapper mets-align-right'>
            <a href='#' class='mets-button'><i class='mets-icon share'></i></a>
            <a href='#' class='mets-button'><i class='mets-icon print'></i></a>
            <a href='#' class='mets-button'><i class='mets-icon copyright'></i></a>
            <a href='#' class='mets-button'><i class='mets-icon help'></i></a>
        </div>
        <div class='mets-clear'></div>
    </div>
</div>

<div class='mets-modal mets-hide'>
    <div class='mets-modal-header'>
        <button type='button' class='mets-close'>&times;</button>
        <h3>Modal header</h3>
    </div>
    <div class='mets-modal-body'>
        <p>One fine body…</p>
    </div>
    <div class='mets-modal-footer'>
        <a href='#' class='mets-btn mets-btn-close'>Close</a>
    </div>
</div>"<#if callback?has_content>})</#if>

</@compress>