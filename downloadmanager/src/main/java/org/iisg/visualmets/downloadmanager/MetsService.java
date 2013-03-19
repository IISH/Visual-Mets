package org.iisg.visualmets.downloadmanager;

import au.edu.apsr.mtk.base.*;
import au.edu.apsr.mtk.ch.METSReader;
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
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: lwo
 * Date: 1/12/13
 * Time: 2:34 PM
 * To change this template use File | Settings | File Templates.
 */
public final class MetsService {

    private DocumentBuilderFactory dbf;
    public static String USE_THUMBNAIL_IMAGE = "thumbnail image";

    public MetsService() {
        dbf = DocumentBuilderFactory.newInstance();
        dbf.setIgnoringComments(true);
        dbf.setNamespaceAware(true);
        dbf.setValidating(false);
    }

    public au.edu.apsr.mtk.base.METS load(File f) throws IOException, SAXException, ParserConfigurationException, METSException, TransformerException, XPathExpressionException {
        if (!f.exists()) return null;
        InputStream in = new FileInputStream(f);
        METSReader mr = new METSReader();
        mr.mapToDOM(in);
        METSWrapper mw = new METSWrapper(mr.getMETSDocument());
        //mw.validate();
        return mw.getMETSObject();
    }

    private void normalise(Node node, File file) throws IOException, TransformerException {

        TransformerFactory transformerFactory =
                TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        DOMSource source = new DOMSource(node);
        StreamResult result = new StreamResult(file);
        transformer.transform(source, result);
    }

    private Node requestMetsDocument(File url) throws IOException, ParserConfigurationException, SAXException, XPathExpressionException, TransformerException {

        DocumentBuilder db = dbf.newDocumentBuilder();
        final Document document = db.parse(url);
        return GetNode(document, "//mets:mets");
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

        return xpath.compile(xquery);
    }

    public Map<Integer, String[]> getURLs(METS mets, String use, boolean unsecure) throws METSException {

        final List<StructMap> physical = mets.getStructMapByType("physical");
        final StructMap map = physical.get(0);
        List<FileGrp> fileGrpByUse = mets.getFileSec().getFileGrpByUse(use);
        if (fileGrpByUse == null) fileGrpByUse = mets.getFileSec().getFileGrpByUse(getFileGrpUseTypes(mets).get(0));

        final FileGrp fileGrp = fileGrpByUse.get(0);

        final List<Div> divs = map.getDivs().get(0).getDivs();
        final Map<Integer, String[]> thumbs = new HashMap<Integer, String[]>(divs.size());
        int count = 0;
        for (Div div : divs) {
            final List<Fptr> fptrs = div.getFptrs();
            for (Fptr fptr : fptrs) {
                final String fileID = fptr.getFileID();
                final au.edu.apsr.mtk.base.File file = fileGrp.getFile(fileID);
                if (file != null) {
                    count++;
                    String label = div.getLabel();
                    if (label == null) label = div.getOrderLabel();
                    if ( label == null ) label = String.valueOf(count);
                    final FLocat fLocat = file.getFLocats().get(0);
                    String direct = null;
                    if (unsecure || fLocat.getLocType().equalsIgnoreCase("URL") || fLocat.getLocType().equalsIgnoreCase("OTHER")) {
                        direct=fLocat.getHref();
                    } else {
                        // In this case the URL may be different. IF the URL needs to be secure, we will obtain the resolve
                        // URL first.
                        try {
                            HttpURLConnection url = (HttpURLConnection) new URL(fLocat.getHref()).openConnection();
                            url.setInstanceFollowRedirects(false);
                            url.connect();
                            String location = url.getHeaderField("location");
                            url.disconnect();
                            if (location != null && location.toLowerCase().startsWith("http:")) direct = location.replace("http:", "https:");
                        } catch (MalformedURLException e) {
                            e.printStackTrace();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                        if ( direct == null ) direct = fLocat.getHref();
                    }
                    thumbs.put(count, new String[]{direct, label});
                }
            }
        }
        return thumbs;
    }

    public List<String> getFileGrpUseTypes(METS mets) throws METSException {
        final List<String> uses = new ArrayList<String>();
        final List<FileGrp> fileGrps = mets.getFileSec().getFileGrps();
        for (FileGrp grp : fileGrps) {
            uses.add(grp.getUse());
        }
        return uses;
    }
}
