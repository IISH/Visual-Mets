<#--Freemarker template-->
<@compress single_line=false>
    <#assign callback = callback/>
    <#assign folders = toc/>

    <#if callback?has_content>${callback}({</#if>

toc:{

    <#list folders as folder1>
    <#--<#if folders?has_content>-->
        <#if folder1.breadcrumbs?has_content>
        breadcrumbs: [
            <#list folder1.breadcrumbs as item1>
            {
            index: "${item1.index}"
            , title: "${item1.title?html}"
            }

                <#if item1_has_next>,</#if>
            </#list>

        ]
        ,
        </#if>
    <#--</#if>-->
    </#list>

    <#list folders as folder2>
        <#if folder2.docs?has_content>
        docs: [
            {
                <#if folder2.docs??>
                item:[
                    <#list folder2.docs as item2>
                    {
                    metsId: "${item2.metsId}",
                    title: "${item2.title?html}",
                    url: "${item2.thumbnail?html}"
                    }

                        <#if item2_has_next>,</#if>
                    </#list>
                ]
                </#if>
            }

            <#if folder2_has_next>,</#if>

        ]
        ,
        </#if>
    </#list>

folder:[
    <#list folders as folder>
        <#if folder.index?has_content>

            {
            index: "${folder.index}",
            title: "${folder.title?html}",
            haschildren:${folder.haschildren}

                <#if folder.metsitems??>
                , item:[
                    <#list folder.metsitems as item>
                    {
                    metsId: "${item.metsId}",
                    title: "${item.title?html}",
                    url: "${item.thumbnail?html}"
                    }

                        <#if item_has_next>,</#if>
                    </#list>
                ]
                </#if>
            }

            <#if folder_has_next>,</#if>
        </#if>
    </#list>
]







}

    <#if callback?has_content>})</#if>

</@compress>