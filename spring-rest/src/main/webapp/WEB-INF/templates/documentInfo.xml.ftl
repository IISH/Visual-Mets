<#--Freemarker template-->
<@compress single_line=true>

<?xml version="1.0" encoding="UTF-8"?>

<document>
    <#-- repeat some values -->
    <metsId>${metsId}</metsId>

    <#if pager?has_content>
    <pager>
        <count>${pager.count?string("0")}</count>

        <pages>
            <#list pager.listofpages as pagerImageItem>
                <page>
                    <label>${pagerImageItem.label}</label>
                    <pageid>${pagerImageItem.pageid?string("0")}</pageid>
                    <urls>
                        <#--<image>${pagerImageItem.url?xml}</image>-->
                        <#--<thumbnail>${pagerImageItem.thumbnailUrl?xml}</thumbnail>-->
                        <#--<transcription>${pagerImageItem.transcriptionUrl?xml}</transcription>-->
                        <page_info>${pagerImageItem.pageInfoUrl?xml}</page_info>
                    </urls>
                </page>
            </#list>
        </pages>

        <first>
            <page>
                <label>${pager.firstpage.label}</label>
                <pageid>${pager.firstpage.pageid?string("0")}</pageid>
                <urls>
                    <#--<image>${pager.firstpage.url?xml}</image>-->
                    <#--<thumbnail>${pager.firstpage.thumbnailUrl?xml}</thumbnail>-->
                    <#--<transcription>${pager.firstpage.transcriptionUrl?xml}</transcription>-->
                    <page_info>${pager.firstpage.pageInfoUrl?xml}</page_info>
                </urls>
            </page>
        </first>
        <last>
            <page>
                <label>${pager.lastpage.label}</label>
                <pageid>${pager.lastpage.pageid?string("0")}</pageid>
                <urls>
                    <#--<image>${pager.lastpage.url?xml}</image>-->
                    <#--<thumbnail>${pager.lastpage.thumbnailUrl?xml}</thumbnail>-->
                    <#--<transcription>${pager.lastpage.transcriptionUrl?xml}</transcription>-->
                    <page_info>${pager.lastpage.pageInfoUrl?xml}</page_info>
                </urls>
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
