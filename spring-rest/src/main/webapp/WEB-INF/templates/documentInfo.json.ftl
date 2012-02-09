<#--Freemarker template-->
<@compress single_line=false>

<#assign callback = callback/>

<#if callback?has_content>${callback}({</#if>

	document:{
        metsId:"${metsId}"

    <#if pager?has_content>,
        pager: {
            count:${pager.count?string("0")},

            last: {
                label:"${pager.lastpage.label?html}",
                pageId:"${pager.lastpage.pageid?string("0")}",
                urls: {
                    <#--image:"${pager.lastpage.url}",-->
                    <#--thumbnail:"${pager.lastpage.thumbnailUrl}",-->
                    <#--transcription:"${pager.lastpage.transcriptionUrl}",-->
                    page_info:"${pager.lastpage.pageInfoUrl}"
                }
            } ,
            first: {
                label:"${pager.firstpage.label?html}",
                pageId:"${pager.firstpage.pageid?string("0")}",
                urls: {
                    <#--image:"${pager.firstpage.url}",-->
                    <#--thumbnail:"${pager.firstpage.thumbnailUrl}",-->
                    <#--transcription:"${pager.firstpage.transcriptionUrl}",-->
                    page_info:"${pager.firstpage.pageInfoUrl}"
                }
            } ,
            pages: {
                page: [

                    <#list pager.listofpages as pagerImageItem>
                    {
                        label:"${pagerImageItem.label?html}",
                        pageId:"${pagerImageItem.pageid?string("0")}",
                        urls: {
                            <#--image:"${pagerImageItem.url}",-->
                            <#--thumbnail:"${pagerImageItem.thumbnailUrl}",-->
                            <#--transcription:"${pagerImageItem.transcriptionUrl}",-->
                            page_info:"${pagerImageItem.pageInfoUrl}"
                        }
                    }
                    <#if pagerImageItem_has_next>,</#if>
                    </#list>
                ]
            }
        }
        </#if>

        <#if scale?has_content>
            , image_width:${image_width?string("0")}
            , image_height:${image_height?string("0")}
            , canvas_width:${canvas_width?string("0")}
            , canvas_height:${canvas_height?string("0")}
            , scale:${scale}
        </#if>

        <#if defaults?has_content>,
        defaults: {
            <@createDefaults defaultsitem=defaults />
                }
        </#if>
    }

<#if callback?has_content>})</#if>

</@compress>

<#macro createDefaults defaultsitem>
    <#list defaultsitem?keys as item>
    ${item}:

        <#if defaultsitem[item]?is_hash == true >
            { <@createDefaults defaultsitem=defaultsitem[item] /> }
        <#else>
            "${defaultsitem[item]}"
        </#if>

        <#if item_has_next>,</#if>

    </#list>
</#macro>
