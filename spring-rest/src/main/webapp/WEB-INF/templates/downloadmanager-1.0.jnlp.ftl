<@compress single_line=true>

<?xml version="1.0" encoding="UTF-8"?>
<jnlp spec="1.0+"
      codebase="http://localhost:8080/" href="jnlp.html">
    <information>
        <title>Mets Download manager</title>
        <vendor>Social history services</vendor>
    </information>
    <resources>
        <!-- Application Resources -->
        <jar href="http://localhost:8080/${pageName}.jar"
             main="true"/>

    </resources>
    <application-desc
            name="Mets Download manager"
            main-class="org.iisg.visualmets.downloadmanager.DownloadManager"
            width="300"
            height="300">
        <#if metsId?has_content>
            <param name="mets" value="${metsId}"/></#if>
    </application-desc>
    <update check="background"/>
</jnlp>

</@compress>