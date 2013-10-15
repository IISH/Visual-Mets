/* short reverence is var: $L  */
NS.LANG.en = {
    'error' : {
        'status' : "status ({status}) ",
        'code' : 'Error status: {code on server request:',
        'exception' : 'Exception on Document object, the incoming data causes dysfunction',
        'image' : 'Error on image remote request (object id {id})',
        'page' : 'Unable to load the page'
    },
    errorCodes : {
        401 : {
            'text'  : '<b>Access restricted</b>',
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
            body : '<div>1. As part of its mission, the IISH makes its collections publicly available for use in research, teaching, and private study.<br />' +
'2. Where known, the IISH provides information about copyright owners and terms governing the appropriate use of materials. This information can be found in the description of an item in the catalogue. Due to the nature of historical collections, however, we are not always able to identify copyright holders or to provide correct information.<br />' +
'3. The IISH in most cases does not own the copyrights in its collections.<br />' +
'4. Reproductions of material from the IISH collections will be delivered for use in research, teaching, or private study.<br />' +
'5. It is the patron\'s obligation to determine and satisfy copyright or other use restrictions when publishing or otherwise distributing materials found in the IISH\'s collections.<br />' +
'6. The IISH does not intermediate in questions about copyrights held by third parties.<br />' +
'7. Unless IISH holds copyright to an item, we cannot give or deny permission to publish or to otherwise distribute it. Permission and possible fees may be required from the copyright owner independently of the IISH.<br />' +
'8. The IISH accepts no liability whatsoever arising from the use of its materials. </div>'
        }
    },
    help : {
        modal : {
            header : 'Help',
            body : '<div>The IISH viewer is available in compact and fullscreen view. The compact view has a toolbar with navigation on top. Clicking on an image will show the image larger.' +
'The icons on top right allow to change the view to thumbs or fullscreen.<br /><br />' +
'In fullscreen view you will find three toolbars:<br />' +
'1. the top toolbar shows information on the context with a link back to the inventory.<br />' +
'2. the second toolbar shows icons on the left to adapt the image (zoom, contrast, rotate). On the right you can change the view to text (if available), thumbs, or narrowscreen.<br />' +
'3. the toolbar below shows permanent links to the image and description. On the right you will find links to extra options: embed, download, copyright, and help.</div>'
        }
    }
}; 