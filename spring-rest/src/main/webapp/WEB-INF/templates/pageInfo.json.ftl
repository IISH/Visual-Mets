<#--Freemarker template-->
<@compress single_line=false>

<#assign callback = callback/>

<#if callback?has_content>${callback}({</#if>

	document:{
        metsId:"${metsId}"

    <#if pager?has_content>,
        <#--pager: {-->
                <#--page: [-->

                    <#list pager.listofpages as pagerImageItem>
                    <#--{-->
                        label:"${pagerImageItem.label?html}",
                        pageId:"${pagerImageItem.pageid?string("0")}",
                        image: {
                            url:"${pagerImageItem.url?html}",
                            width:"${pagerImageItem.imageWidth?string("0")}",
                            height:"${pagerImageItem.imageHeight?string("0")}",
                            mimetype:"${pagerImageItem.imageMimetype}"
                        },
                        thumbnail: {
                            url:"${pagerImageItem.thumbnailUrl}",
                            width:"${pagerImageItem.thumbnailWidth?string("0")}",
                            height:"${pagerImageItem.thumbnailHeight?string("0")}",
                            mimetype:"${pagerImageItem.thumbnailMimetype}"
                        },
                        transcription:"${pagerImageItem.transcription?html}"

                    <#--}-->
                    <#--<#if pagerImageItem_has_next>,</#if>-->
                    </#list>
                <#--]-->
        <#--}-->
        </#if>
    }

<#if callback?has_content>})</#if>

</@compress>
