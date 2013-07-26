<#--Freemarker template-->
<@compress single_line=true>

<?xml version="1.0" encoding="UTF-8"?>

<document>
    <#-- repeat some values -->
    <eadId>${eadId}</eadId>
    <metsId>${metsId}</metsId>
    <pageId>${pageId}</pageId>
    <#--<breadcrumb>${breadcrumb}</breadcrumb>-->
    <note>${note}</note>
    <pdfUrl>${pdfUrl}</pdfUrl>
    <code>${code}</code>
    <message>${message}</message>

    <#if pager?has_content>
    <pager>
        <start>${pager.start?string("0")}</start>
        <rows>${pager.rows?string("0")}</rows>
        <count>${pager.count?string("0")}</count>
        <pageId>${pager.pageId}</pageId>


        <pages>
            <#list pager.listofpages as pagerImageItem>
                <page>
                    <label>${pagerImageItem.label}</label>
                    <pageid>${pagerImageItem.pageid?string("0")}</pageid>
                    <url>${pagerImageItem.url?xml}</url>
                    <thumbnail_url>${pagerImageItem.thumbnailUrl?xml}</thumbnail_url>
                </page>
            </#list>
        </pages>

        <first>
            <page>
                <label>${pager.firstpage.label}</label>
                <pageid>${pager.firstpage.pageid?string("0")}</pageid>
                <url>${pager.firstpage.url?xml}</url>
                <thumbnail_url>${pager.firstpage.thumbnailUrl?xml}</thumbnail_url>
            </page>
        </first>
        <last>
            <page>
                <label>${pager.lastpage.label}</label>
                <pageid>${pager.lastpage.pageid?string("0")}</pageid>
                <url>${pager.lastpage.url?xml}</url>
                <thumbnail_url>${pager.lastpage.thumbnailUrl?xml}</thumbnail_url>
            </page>
        </last>
    </pager>
    </#if>

    <#if scale?has_content>
        <image_width>${image_width?string("0")}</image_width>
        <image_height>${image_height?string("0")}</image_height>
        <canvas_width>${canvas_width?string("0")}</canvas_width>
        <canvas_height>${canvas_height?string("0")}</canvas_height>
        <scale>${scale}</scale>
    </#if>

    <#-- add defaults to document -->
    <#if defaults?has_content>
    <defaults>
    <@createDefaults defaultsitem=defaults />
    </defaults>
    </#if>
</document>

</@compress>

<#macro createDefaults defaultsitem>
     <#list defaultsitem?keys as item>
     <${item}>

        <#if defaultsitem[item]?is_hash == true >
            <@createDefaults defaultsitem=defaultsitem[item] />
        <#else>
            ${defaultsitem[item]}
        </#if>

     </${item}>
     </#list>
</#macro>
