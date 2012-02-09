<#import "spring.ftl" as spring >

<!DOCTYPE html
        PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <title><@spring.message 'IndexTitle_t' /></title>
    <meta http-equiv="content-type" content="text/xml; charset=utf-8">
</head>
<body>
<h1><@spring.message 'IndexTitle_t' /></h1>

<p><@spring.message 'IndexShouldBeCalledDirectly_t' /></p>
<hr/>
<h2>1. <@spring.message 'IndexTableOfContentsExample_t'/>: /rest/archive/toc</h2>

<p><a href="/rest/archive/toc?eadId=ead_10767897&amp;folderId=0&amp;callback=json12345">/rest/archive/toc?eadId=ead_10767897&amp;folderId=0&amp;callback=json12345</a>
</p>
<img src="css/images/toc.jpg" alt=""/>
<hr/>
<h2>2. Full page view of a document: rest/document</h2>
<p><a href="/rest/document?eadId=ead_10767897&metsId=1">/rest/document?eadId=ead_10767897&metsId=1</a></p>
<p>Toont alles wat bekend is over het document op basis van parameters. Deze zijn:</p>
<ol>
    <li><b>pager[optioneel|default=false] =></b> toont de pager. In de pager staat de eerste, laatste en alle thumbnail pagina
        verwijzingen in een bereik (max. 20). <br/>
                        <cite>&lt;pager&gt;<br/>
                &lt;start&gt;1&lt;/start&gt;<br/>
                &lt;rows&gt;20&lt;/rows&gt;<br/>
                &lt;pages&gt;<br/>
                    &lt;page&gt;&lt;label&gt;page 1&lt;/label&gt;<br/>
                        &lt;number&gt;1&lt;/number&gt;<br/>
                        &lt;url&gt;http://webstore.iisg.nl/dorarussel/Jpeg/Russel_001/Russel_001_0001_thumbnail.jpg&lt;/url&gt;<br/>
                    &lt;/page&gt;<br/>
                    &lt;page&gt;etc&lt;/page&gt;<br/>
                &lt;/pages&gt;<br/>
                &lt;first&gt;<br/>
                    &lt;page&gt;&lt;label&gt;page 1&lt;/label&gt;<br/>
                        &lt;number&gt;1&lt;/number&gt;<br/>
                        &lt;url&gt;http://webstore.iisg.nl/dorarussel/Jpeg/Russel_001/Russel_001_0001_thumbnail.jpg&lt;/url&gt;<br/>
                    &lt;/page&gt;<br/>
                &lt;/first&gt;<br/>
                &lt;last&gt;<br/>
                    &lt;page&gt;&lt;label&gt;page 170&lt;/label&gt;<br/>
                        &lt;number&gt;170&lt;/number&gt;<br/>
                        &lt;url&gt;http://webstore.iisg.nl/dorarussel/Jpeg/Russel_001/Russel_001_0170_thumbnail.jpg&lt;/url&gt;<br/>
                    &lt;/page&gt;<br/>
                &lt;/last&gt;<br/>
            &lt;/pager&gt;</cite><br/>
    </li>
    <ol>
        <li><b>pager.start</b> => begin van de pagina set in de pager</li>
        <li><b>pager.rows</b> => aantal pagina's in de set</li>
    </ol>
    <li>
        <b>defaults[optioneel|default=false]</b> => retourneert de bewerkingen die kunnen worden uitgevoerd op een TYPE object (
        thumbnail, reference, audio, etc. )
        en bepaalt de uiterste waardes.
    </li>
    <li><b>scale:default=false</b> => retourneert de schaal 
        <ul>
            <li><b>scale.width[optioneel]</b></li> => breedte canvas client. zie PageId hieronder
            <li><b>scale.height[optioneel]</b></li> => hoogte canvas client. zie PageId hieronder
            <li><b>scale.PageId[optioneel:default=1]</b> = > retourneert de schaal relatief aan de scale.width en scale.height opgegeven waardes. Het wordt berekent aan de hand van de opgegeven afbeelding</li
        </ul>
        <br/>
            <cite>&lt;scale&gt;40&lt;/scale&gt;</cite>
    </li>
</ol>
<img src="css/images/document.jpg" alt=""/>
<hr/>
<p>Same call, but now with the toggle at the client:</p>
<img src="css/images/documents.jpg" alt=""/>
<h2><@spring.message 'IndexSolrServer_t'/></h2>
<a href="http://localhost:8983/solr/"><@spring.message 'IndexHere_t'/></a>


</body>
</html>