package org.iish.visualmets.services;

import au.edu.apsr.mtk.base.*;
import au.edu.apsr.mtk.ch.METSReader;
import org.iish.visualmets.dao.DocumentDao;
import org.iish.visualmets.datamodels.ImageItem;
import org.iish.visualmets.datamodels.PagerItem;
import org.iish.visualmets.util.ControllerUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.util.Date;
import java.util.List;

/**
 * We read the imagery and mets from a url... and cache.
 * When the cache expires, we drop the data.
 */
public class MtrReader implements DocumentDao {

    @Value("#{visualmetsProperties['proxy.host']}")
    private String proxy_host = "/";

    @Autowired
    public CacheService cacheService;

    private String trusted;
    private long cacheLimitInBytes;
    private String cacheFolder;
    private long cacheLimitInSeconds;

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
                imageInfo.setUrl(ControllerUtils.redirect(fLocat.getHref()));
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
        final String url_tpl = proxy_host + "rest/resource/reference_image?metsId=" + metsId + "&pageId=";
        //final String url_thumbnail_tpl = proxy_host_mets + "rest/resource/thumbnail_image?metsId=" + metsId + "&pageId=";
        final String url_transcription_tpl = proxy_host + "rest/resource/get_transcription?metsId=" + metsId + "&pageId=";
        final String url_pageinfo_tpl = proxy_host + "rest/pageInfo?metsId=" + metsId + "&pageId=";
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

            for (int position = i; position < j && position < documentCount; position++) {
                Date from = new Date();
                final Div div = divs.get(position);
                final ImageItem url = getUrls(fileGrp, map, use, metsId, Integer.parseInt(div.getOrder()));
                pagerItem.add(url_tpl + div.getOrder(), div.getLabel(), Integer.parseInt(div.getOrder()), url.getUrl(), url_transcription_tpl + div.getOrder(), url_pageinfo_tpl + div.getOrder());
                Date to = new Date();
                long l = (to.getTime() - from.getTime());
            }
        }

        return pagerItem;
    }

    @Override
    public PagerItem getPagerPageInfo(String eadId, String metsId, int pageId, int start, int rows, String use) throws Exception {

        final METS mets = loadMetsDocument(metsId);
        final String url_tpl = proxy_host + "rest/resource/reference_image?metsId=" + metsId + "&pageId=";
        final String url_thumbnail_tpl = proxy_host + "rest/resource/thumbnail_image?metsId=" + metsId + "&pageId=";
        final String url_transcription_tpl = proxy_host + "rest/resource/get_transcription?metsId=" + metsId + "&pageId=";
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

        final METSReader mr = new METSReader();
        //final Node node = GetNode(document, "//mets:mets");
        mr.mapToDOM(cacheService.inputStream(url));
        final METSWrapper mw = new METSWrapper(mr.getMETSDocument());
        //mw.validate();
        return mw.getMETSObject();
    }

   /* private Node GetNode(Node node, String xquery) throws XPathExpressionException {
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
    }*/
}