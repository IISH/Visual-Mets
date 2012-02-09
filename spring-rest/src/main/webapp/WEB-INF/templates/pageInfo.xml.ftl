<#--Freemarker template-->
<@compress single_line=true>

<?xml version="1.0" encoding="UTF-8"?>

<document>
    <#-- repeat some values -->
    <metsId>${metsId}</metsId>

    <#if pager?has_content>
    <#--<pager>-->
            <#list pager.listofpages as pagerImageItem>
                <#--<page>-->
                    <label>${pagerImageItem.label}</label>
                    <pageid>${pagerImageItem.pageid?string("0")}</pageid>
                    <image>
                        <url>${pagerImageItem.url?xml}</url>
                        <width>${pagerImageItem.imageWidth?string("0")}</width>
                        <height>${pagerImageItem.imageHeight?string("0")}</height>
                        <mimetype>${pagerImageItem.imageMimetype}</mimetype>
                    </image>
                    <thumbnail>
                        <url>${pagerImageItem.thumbnailUrl?xml}</url>
                        <width>${pagerImageItem.thumbnailWidth?string("0")}</width>
                        <height>${pagerImageItem.thumbnailHeight?string("0")}</height>
                        <mimetype>${pagerImageItem.thumbnailMimetype}</mimetype>
                    </thumbnail>
                    <transcription>
                        ${pagerImageItem.transcription?html}
                    </transcription>
                <#--</page>-->
            </#list>
    <#--</pager>-->
    </#if>
</document>

</@compress>
