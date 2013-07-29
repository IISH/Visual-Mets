/* short reference is var: $L  */
NS.LANG.en = {
    'error' : {
        'status' : "status ({status}) ",
        'code' : '<b>Error status: {code}</b> on server request',
        'exception' : 'Exception on Document object, the incoming data causes disruption of normal function',
        'image' : 'Error on image remote request (object id {id})',
        'page' : 'Unable to load the page'
    },
    errorCodes : {
        401 : {
            'text'  : 'Restricted access to this object',
            'fn'    : 'warning',
            'icon'  : 'file-access.png'
        }
    },
    'loader' : {
        'page' : 'loading pages',
        'data' : 'loading data',
        'loading' : {
            page : 'loading: {title}'
        }
    },
    'label' : {
        'zoomin' : 'zoom in',
        'zoomout' : 'zoom out',
        'darker' : 'darker',
        'lighter' : 'lighter',
        'contrast' : 'more contrast',
        'contrastInvert' : 'less contrast',
        'rotateleft' : 'rotate left',
        'rotateright' : 'rotate right',
        'firstpage' : 'first',
        'previous' : 'previous',
        'next' : 'next',
        'lastpage' : 'last',
        'transcription' : 'text',
        'overview' : 'thumbs',
        'fullscreen' : 'full screen',
        'narrowscreen' : 'narrow screen',
        'share' : 'embed',
        'print' : 'download/print',
        'copyright' : 'copyright',
        'reset' : 'reset',
        'help' : 'help'
    },
    copyright : {
        modal : {
            header : 'Copyright notice',
            body : '<div>Reproductions of material from the IISH collections will be delivered for use in research,<br />' +
                'teaching, or private study. It is in the patron\'s obligation to determine and satify copyright or other ' +
                'use restrictions when publishing or otherwise distributing materials found in the IISH\'s collections. </div>'
        }
    },
    help : {
        modal : {
            header : 'Help',
            body : '<div>place help text here please<br />' +
                'location is language file. </div>'
        }
    }
};