package org.iish.visualmets.services;

import au.edu.apsr.mtk.base.*;
import au.edu.apsr.mtk.ch.METSReader;
import org.apache.log4j.Logger;
import org.iish.visualmets.dao.DocumentDao;
import org.iish.visualmets.datamodels.ImageItem;
import org.iish.visualmets.datamodels.PagerItem;
import org.iish.visualmets.util.FileHash;
import org.iish.visualmets.util.Security;
import org.springframework.beans.factory.annotation.Value;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import javax.xml.XMLConstants;
import javax.xml.namespace.NamespaceContext;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.*;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

/**
 * We read the imagery and mets from a url... and cache.
 * When the cache expires, we drop the data.
 */
public class MtrReader implements DocumentDao {

    @Value("#{visualmetsProperties['proxy.host']}")
    private String proxy_host = "/";
    @Value("#{visualmetsProperties['proxy.host.mets']}")
    private String proxy_host_mets = "/";

    private String trusted;
    private long cacheLimitInBytes;
    private String cacheFolder;
    private DocumentBuilderFactory dbf;
    private long cacheLimitInSeconds;

    public MtrReader() {
        dbf = DocumentBuilderFactory.newInstance();
        dbf.setIgnoringComments(true);
        dbf.setNamespaceAware(true);
        dbf.setValidating(false);
    }

    @Override
    public ImageItem getUrl(String eadId, String metsId, int pageId, String use) throws Exception {

        final METS mets = loadMetsDocument(metsId);
        ImageItem imageInfo = null;

        List<FileGrp> fileGrpByUse = mets.getFileSec().getFileGrpByUse(use);
        if (!fileGrpByUse.isEmpty()) {
            final FileGrp fileGrp = fileGrpByUse.get(0);
            final StructMap map = mets.getStructMapByType("physical").get(0);

            final au.edu.apsr.mtk.base.File file = getFileId(map, fileGrp, pageId);
            if (file != null) {
                imageInfo = new ImageItem();
                imageInfo.setEadid(eadId);
                imageInfo.setMetsid(metsId);
                imageInfo.setPageid(pageId);
                imageInfo.setUse(use);
                final FLocat fLocat = file.getFLocats().get(0);
                imageInfo.setUrl(fLocat.getHref());
                imageInfo.setMimetype(file.getMIMEType());
            }
        }
        return imageInfo;
    }

    @Override
    public ImageItem getUrls(FileGrp fileGrp, StructMap map, String use, String metsId, int pageId) throws Exception {

        ImageItem imageInfo = null;

        final au.edu.apsr.mtk.base.File file = getFileId(map, fileGrp, pageId);
        if (file != null) {
            imageInfo = new ImageItem();
            imageInfo.setMetsid(metsId);
            imageInfo.setPageid(pageId);
            imageInfo.setUse(use);
            final FLocat fLocat = file.getFLocats().get(0);
            imageInfo.setUrl(fLocat.getHref());
            imageInfo.setMimetype(file.getMIMEType());
        }
        return imageInfo;
    }

    private au.edu.apsr.mtk.base.File getFileId(StructMap map, FileGrp fileGrp, int pageId) throws METSException {

        final List<Div> divs = map.getDivs().get(0).getDivs();
        for (Div div : divs) {
            if (div.getOrder().equals(String.valueOf(pageId))) {
                final List<Fptr> fptrs = div.getFptrs();
                for (Fptr fptr : fptrs) {
                    final String fileID = fptr.getFileID();
                    final au.edu.apsr.mtk.base.File file = fileGrp.getFile(fileID);
                    if (file != null)
                        return file;
                }
            }
        }
        return null;
    }

    @Override
    public PagerItem getPager(String eadId, String metsId, int pageId, int start, int rows, String use) throws Exception {

        final METS mets = loadMetsDocument(metsId);
        final String url_tpl = proxy_host_mets + "rest/resource/reference_image?metsId=" + metsId + "&pageId=";
        //final String url_thumbnail_tpl = proxy_host_mets + "rest/resource/thumbnail_image?metsId=" + metsId + "&pageId=";
        final String url_transcription_tpl = proxy_host_mets + "rest/resource/get_transcription?metsId=" + metsId + "&pageId=";
        final String url_pageinfo_tpl = proxy_host_mets + "rest/pageInfo?metsId=" + metsId + "&pageId=";
        final PagerItem pagerItem = new PagerItem();
        pagerItem.setEadid(eadId); // ToDo: remove.. useless
        pagerItem.setMetsid(metsId);
        pagerItem.setUse(use);
        pagerItem.setPageId(pageId);
        pagerItem.setStart(start);
        pagerItem.setRows(rows);

        List<FileGrp> fileGrpByUse = mets.getFileSec().getFileGrpByUse(use);
        if (!fileGrpByUse.isEmpty()) {
            final FileGrp fileGrp = fileGrpByUse.get(0);
            final StructMap map = mets.getStructMapByType("physical").get(0);

            final List<Div> divs = map.getDivs().get(0).getDivs(); // ToDo: this assumes rather a lot about the METS structure.
            int documentCount = divs.size();
            pagerItem.setCount(documentCount);

            final Div divFirst = divs.get(0);
            ImageItem urlFirst = getUrls(fileGrp, map, use, metsId, Integer.parseInt(divFirst.getOrder()));
            pagerItem.getFirstpage().setUrl(url_tpl + divFirst.getOrder());
            pagerItem.getFirstpage().setThumbnailUrl(urlFirst.getUrl());
            pagerItem.getFirstpage().setLabel(divFirst.getLabel());
            pagerItem.getFirstpage().setPageid(Integer.parseInt(divFirst.getOrder()));
            pagerItem.getFirstpage().setTranscriptionUrl(url_transcription_tpl + divFirst.getOrder());
            pagerItem.getFirstpage().setPageInfoUrl(url_pageinfo_tpl + divFirst.getOrder());

            final Div divLast = divs.get(documentCount - 1);
            ImageItem urlLast = getUrls(fileGrp, map, use, metsId, Integer.parseInt(divLast.getOrder()));
            pagerItem.getLastpage().setUrl(url_tpl + divLast.getOrder());
            pagerItem.getLastpage().setThumbnailUrl(urlLast.getUrl());
            pagerItem.getLastpage().setLabel(divLast.getLabel());
            pagerItem.getLastpage().setPageid(Integer.parseInt(divLast.getOrder()));
            pagerItem.getLastpage().setTranscriptionUrl(url_transcription_tpl + divLast.getOrder());
            pagerItem.getLastpage().setPageInfoUrl(url_pageinfo_tpl + divLast.getOrder());

            int i = start - 1;
            int j = rows == -1 ? documentCount : start + rows - 1;

            int n = 0;
            long t = 0;
            for (int position = i; position < j && position < documentCount; position++) {
                Date from = new Date();
                final Div div = divs.get(position);
                final ImageItem url = getUrls(fileGrp, map, use, metsId, Integer.parseInt(div.getOrder()));
                pagerItem.add(url_tpl + div.getOrder(), div.getLabel(), Integer.parseInt(div.getOrder()), url.getUrl(), url_transcription_tpl + div.getOrder(), url_pageinfo_tpl + div.getOrder());
                Date to = new Date();
                long l = (to.getTime() - from.getTime());

                t += l;
                n++;
            }
        }

        return pagerItem;
    }

    @Override
    public PagerItem getPagerPageInfo(String eadId, String metsId, int pageId, int start, int rows, String use) throws Exception {

        final METS mets = loadMetsDocument(metsId);
        final String url_tpl = proxy_host_mets + "rest/resource/reference_image?metsId=" + metsId + "&pageId=";
        final String url_thumbnail_tpl = proxy_host_mets + "rest/resource/thumbnail_image?metsId=" + metsId + "&pageId=";
        final String url_transcription_tpl = proxy_host_mets + "rest/resource/get_transcription?metsId=" + metsId + "&pageId=";
        final PagerItem pagerItem = new PagerItem();
        pagerItem.setEadid(eadId); // ToDo: remove.. useless
        pagerItem.setMetsid(metsId);
        pagerItem.setUse(use); // ToDo: wat doen we hiermee?
        pagerItem.setPageId(pageId);
        pagerItem.setStart(start);
        pagerItem.setRows(rows);

        final StructMap map = mets.getStructMapByType("physical").get(0);
        final List<Div> divs = map.getDivs().get(0).getDivs(); // ToDo: this assumes rather a lot about the METS structure.
        int documentCount = divs.size();
        pagerItem.setCount(documentCount);

        int i = start - 1;
        for (int position = i; position < start + rows - 1 && position < documentCount; position++) {
            final Div div = divs.get(position);
            pagerItem.addPageInfo(
                    url_tpl + div.getOrder()
                    , div.getLabel()
                    , Integer.parseInt(div.getOrder())
                    , url_thumbnail_tpl + div.getOrder()
                    , url_transcription_tpl + div.getOrder()
            );
        }

        return pagerItem;
    }

    /**
     * Here we load the mets document ( or wrapper XML that contains the mets document ) to a cache.
     *
     * @param url
     * @return
     * @throws METSException
     * @throws IOException
     * @throws SAXException
     * @throws ParserConfigurationException
     */
    private METS loadMetsDocument(String url) throws Exception {

        final String filename = FileHash.SHA1(url);
        final String file = cacheFolder + filename;
        File f = new File(file);
        if (!f.exists()) {
            Security.authorize(trusted, new URI(url).getHost());
            Node node = requestMetsDocument(url);
            if (node != null)
                normalise(node, file);
        }
        InputStream in = new FileInputStream(f);
        METSReader mr = new METSReader();
        mr.mapToDOM(in);
        METSWrapper mw = new METSWrapper(mr.getMETSDocument());
        //mw.validate();
        return mw.getMETSObject();
    }

    /**
     * Clear the cache in case it exceeds the limit.
     *
     * @return
     */
    private int emptyCache() throws IOException {
        int count = 0;
        File folder = new File(cacheFolder);
        if (!folder.exists())
            folder.mkdirs();
        final boolean hasExpired = folder.lastModified() + cacheLimitInSeconds < new Date().getTime();
        if (folder.length() > cacheLimitInBytes || hasExpired) {
            final File[] files = folder.listFiles();
            for (File file : files) {
                try {
                    file.delete();
                    count++;
                } catch (Exception e) {
                }
            }
        }
        return count;
    }

    private Node requestMetsDocument(String url) throws IOException, ParserConfigurationException, SAXException, XPathExpressionException, TransformerException {

        DocumentBuilder db = dbf.newDocumentBuilder();
        final Document document = db.parse(url);
        return GetNode(document, "//mets:mets");
    }

    /**
     * The document is loaded, transformed and stored to a cache.
     * ToDo: depending on specifications, apply xslt stylesheets.
     *
     * @param node
     * @param file
     * @throws IOException
     * @throws TransformerException
     */
    private void normalise(Node node, String file) throws IOException, TransformerException {

        emptyCache();
        TransformerFactory transformerFactory =
                TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        DOMSource source = new DOMSource(node);
        StreamResult result = new StreamResult(new File(file));
        transformer.transform(source, result);
    }

    private Node GetNode(Node node, String xquery) throws XPathExpressionException {
        XPathExpression expr = getXPathExpression(xquery);
        return (Node) expr.evaluate(node, XPathConstants.NODE);
    }

    private XPathExpression getXPathExpression(String xquery) throws XPathExpressionException {
        XPathFactory factory = XPathFactory.newInstance();
        XPath xpath = factory.newXPath();

        // http://www.ibm.com/developerworks/library/x-javaxpathapi.html
        NamespaceContext ns = new NamespaceContext() {

            @Override
            public String getPrefix(String namespaceURI) {
                throw new UnsupportedOperationException();
            }

            @Override
            public Iterator getPrefixes(String namespaceURI) {
                throw new UnsupportedOperationException();
            }

            @Override
            public String getNamespaceURI(String prefix) {
                final String metsNs = "http://www.loc.gov/METS/";
                if (prefix == null)
                    throw new NullPointerException(metsNs);

                if (prefix.equalsIgnoreCase("mets"))
                    return metsNs;

                if (prefix.equalsIgnoreCase("xml"))
                    return XMLConstants.XML_NS_URI;

                return XMLConstants.NULL_NS_URI;
            }
        };

        xpath.setNamespaceContext(ns);
        XPathExpression expr = xpath.compile(xquery);

        return expr;
    }

    public void setTrusted(String trusted) {
        this.trusted = trusted;
    }

    public void setCacheFolder(String cacheFolder) {
        this.cacheFolder = cacheFolder;
    }

    public void setCacheLimitInBytes(long cacheLimitInBytes) {
        this.cacheLimitInBytes = cacheLimitInBytes;
    }

    public void setCacheLimitInSeconds(long cacheLimitInSeconds) {
        this.cacheLimitInSeconds = 1000L * cacheLimitInSeconds;
    }
}