<#--Freemarker template-->
<@compress single_line=true>
    <#assign folders = toc />

<?xml version="1.0" encoding="UTF-8"?>
    <toc>

        <#list folders as folder>

            <#if folder.breadcrumbs?has_content>
                <breadcrumbs>
                <#list folder.breadcrumbs as item2>
                    <item>
                        <index>${item2.index}</index>
                        <title>${item2.title?xml}</title>
                    </item>
                </#list>
                </breadcrumbs>
            </#if>

            <#if folder.index?has_content>
            <folder>
                <index>${folder.index}</index>
                <title>${folder.title?xml}</title>
                <haschildren>${folder.haschildren}</haschildren>
                <#if folder.metsitems??>
                    <#list folder.metsitems as item>
                    <item>
                        <metsId>${item.metsId}</metsId>
                        <title>${item.title?xml}</title>
                        <url>${item.thumbnail}</url>
                    </item>
                    </#list>
                </#if>
            </folder>
            </#if>

            <#if folder.docs?has_content>
                <docs>
                    <#list folder.docs as item>
                        <item>
                            <metsId>${item.metsId}</metsId>
                            <title>${item.title?xml}</title>
                            <url>${item.thumbnail}</url>
                        </item>
                    </#list>
                </docs>
            </#if>

        </#list>
    </toc>

</@compress>