package org.iish.visualmets.services;


import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.apache.pdfbox.PDFSplit;
import org.apache.pdfbox.exceptions.COSVisitorException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.edit.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.util.PDFMergerUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.util.UriUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;


import it.svario.xpathapi.jaxp.XPathAPI;


/**
 * Created by IntelliJ IDEA.
 * User: Michael
 * Date: 28-5-13
 * Time: 12:38
 */
public class MyService {

    @Autowired
    public CacheService cacheService;

    public static final String KEY_NOTE = "note_key";
    public static final String KEY_BREADCRUMB = "breadcrumb_key";
    public static final String KEY_NUMBER = "number_key";
    public static final String KEY_ARCHIVE = "archive_key";
    public static final String KEY_CODE = "code_key";
    public static final String KEY_MESSAGE = "code_message";

    @Value("#{visualmetsProperties['proxy.host']}")
    private String proxy_host = "/";

    @Value("#{visualmetsProperties['handle.host']}")
    private String handle_host = "/";

    @Value("#{visualmetsProperties['ead.host']}")
    private String ead_host = "/";

    @Value("#{visualmetsProperties['ead.namespace']}")
    private String ead_namespace;

    public String generatePdfUrl(String _metsId) {
        return proxy_host + "rest/resource/get_pdf?metsId=" + _metsId;
    }

    private Logger log = Logger.getLogger(getClass());


    public ArrayList generateBreadcrumbUrls(String _archive, String _number) {
        ArrayList breadcrumbUrls = new ArrayList();

        breadcrumbUrls.add(handle_host + "/" + _archive + "?locatt=view:catalog");
        breadcrumbUrls.add("");
        breadcrumbUrls.add("");
        breadcrumbUrls.add(handle_host + "/" + _archive + "." + _number + "?locatt=view:catalog");

        return breadcrumbUrls;
    }

    private int codeMets(String _metsId, Map _map) throws Exception {

        int resultCode;// = HttpServletResponse.SC_UNAUTHORIZED;
        final String eUrl = UriUtils.encodeHttpUrl(_metsId, "utf-8");


        try {
            URL server = new URL(eUrl);
            HttpURLConnection connection = (HttpURLConnection) server.openConnection();
            resultCode = connection.getResponseCode();
            connection.disconnect();

            if (resultCode == HttpServletResponse.SC_OK) {
                Map<String, String> nsMap = new HashMap<String, String>();
                nsMap.put("epdcx", "http://purl.org/eprint/epdcx/2006-11-16/");
                final Document doc = cacheService.loadDocument(_metsId);
                doc.getDocumentElement().normalize();
                String accessString = XPathAPI.selectSingleNodeAsString(doc, "//epdcx:description[@epdcx:resourceId='level1']/child::epdcx:statement/@epdcx:valueRef", nsMap);
                if (accessString != null && accessString.equals("http://purl.org/eprint/accessRights/OpenAccess"))
                    resultCode = HttpServletResponse.SC_OK;
                else if (accessString == null)
                    resultCode = HttpServletResponse.SC_OK;
                else
                    resultCode = HttpServletResponse.SC_UNAUTHORIZED;
            }

        } catch (IOException e) {
            log.error(eUrl);
            log.error(e);
            _map.put(KEY_MESSAGE, e.getMessage());
            resultCode = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
        }

        return resultCode;
    }


    private String extractArchive(String _metsId) {

        int pos = StringUtils.lastIndexOf(_metsId, "/");
        String temp = _metsId.substring(pos, _metsId.length());
        String result = StringUtils.substringBetween(temp, "/", ".");
        return result;
    }

    //hdl.handle.net/10622/ARCH01225.35?locatt=view:mets
    private String extractNumber(String _metsId) {
        int pos = StringUtils.lastIndexOf(_metsId, ".");
        int pos2 = StringUtils.indexOf(_metsId, "?");
        return (pos == -1 || pos2 == -1 || pos > pos2) ? "0" : _metsId.substring(pos + 1, pos2);
    }

    private String generateEadUrl(String _metsId) {
        String archive = this.extractArchive(_metsId);
        if (archive != null)
            return ead_host.replace("{0}", archive);
        return null;
    }


    public Map extract(String _metsId) throws Exception {
        HashMap map = new HashMap();
        List<String> list = new ArrayList<String>();
        Map<String, String> nsMap = new HashMap<String, String>();

        String number = this.extractNumber(_metsId);
        String archive = this.extractArchive(_metsId);
        final ArrayList dummy = new ArrayList();
        map.put(KEY_NUMBER, number);
        map.put(KEY_BREADCRUMB, dummy);
        map.put(KEY_NOTE, "");
        map.put(KEY_ARCHIVE, archive);

        int response_code = codeMets(_metsId, map);
        if (response_code == HttpServletResponse.SC_OK) {

            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            dbFactory.setNamespaceAware(true);
            nsMap.put("ead", ead_namespace);

            String eadUrl = this.generateEadUrl(_metsId);
            Document doc = (eadUrl != null) ? cacheService.loadDocument(eadUrl) : null;
            if (doc != null) {
                String[] array = {number};

                if (XPathAPI.selectSingleNode(doc, "//ead:ead", nsMap, array) == null) {
                    map.put(KEY_NOTE, "");
                    map.put(KEY_BREADCRUMB, list);
                    map.put(KEY_CODE, HttpServletResponse.SC_OK);
                    return map;
                }

                Node levelNode = XPathAPI.selectSingleNode(doc, "//ead:unitid[normalize-space(.)='{}']", nsMap, array);
                if (levelNode == null) {
                    // response_code = HttpServletResponse.SC_NOT_FOUND;
                    map.put(KEY_NOTE, "");
                    map.put(KEY_BREADCRUMB, list);
                    map.put(KEY_CODE, HttpServletResponse.SC_OK);
                    return map;
                } else {
                    response_code = HttpServletResponse.SC_OK;

                    Node noteNode = XPathAPI.selectSingleNode(doc, "//ead:unitid[normalize-space(.)='{}']/following-sibling::ead:note", nsMap, array);
                    if (noteNode != null) {
                        map.put(KEY_NOTE, flattenString(noteNode.getTextContent()));
                    }

                    String nodeName = levelNode.getParentNode().getParentNode().getNodeName();
                    int levels = numberOfLevels(nodeName);

                    //first level from titleproper
                    for (int i = 2; i <= levels; i++) {
                        Node aNode = XPathAPI.selectSingleNode(doc, "//ead:unitid[normalize-space(.)='{}']/ancestor::ead:c0" + i + "/ead:did/ead:unittitle", nsMap, array);
                        if (aNode == null) {
                            list.add("");
                        } else {
                            if (i == levels)
                                list.add((String) map.get(MyService.KEY_NUMBER) + ": " + flattenString(aNode.getTextContent()));
                            else
                                list.add(flattenString(aNode.getTextContent()));
                        }
                    }

                    Node firstNode = XPathAPI.selectSingleNode(doc, "//ead:titleproper", nsMap);
                    list.add(0, flattenString(firstNode.getTextContent()));

                    map.put(KEY_BREADCRUMB, list);
                }
            }
        }

        map.put(KEY_CODE, response_code);

        return map;
    }

    private byte[] createTocPdf(List _breadcrumbList, String _number, String _archive, String _note, String _selection) throws IOException, COSVisitorException, Exception {

        PDDocument doc = null;
        try {
            doc = new PDDocument();

            PDPage page = new PDPage();
            doc.addPage(page);
            //PDFont font = PDTrueTypeFont.loadTTF(doc, "C:\\projects\\HelloWorldTTF\\tahoma.ttf");

            PDPageContentStream contentStream = new PDPageContentStream(doc,
                    page);
            contentStream.beginText();
            contentStream.setFont(PDType1Font.TIMES_ROMAN, 15);

            contentStream.moveTextPositionByAmount(100, 700);

            Iterator iter = _breadcrumbList.iterator();
            boolean first = true;
            while (iter.hasNext()) {

                String item = (String) iter.next();
                contentStream.drawString(item);
                contentStream.moveTextPositionByAmount(0, -50);
                if (first) {
                    contentStream.setFont(PDType1Font.TIMES_ROMAN, 10);
                    first = false;
                }
            }




			/*contentStream.drawString("Breadcrumb: " + _breadcrumbList.toString());
            contentStream.moveTextPositionByAmount(0, -50);*/
            contentStream.drawString("Number: " + _number);
            contentStream.moveTextPositionByAmount(0, -50);
            contentStream.drawString("Archive: " + _archive);
            contentStream.moveTextPositionByAmount(0, -50);
            contentStream.drawString("Note: " + _note);
            if (_selection != null) {
                contentStream.moveTextPositionByAmount(0, -50);
                contentStream.drawString("Selection: " + _selection);
            }
            //contentStream.drawString("Nummer:+"+_number);
            contentStream.endText();
            contentStream.close();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();


            doc.save(outputStream);
            byte[] bytes = outputStream.toByteArray();

            //System.out.println(file + " created!");
            return bytes;
        } finally {
            if (doc != null) {
                doc.close();
            }
        }
    }

    //http://hdl.handle.net/10622/ARCH01225.85a?locatt=view:pdf
    public byte[] createPdf(String _metsId, String _selection) throws IOException, COSVisitorException, Exception {
        Map map = this.extract(_metsId);
        //_selection="1-19,19";
        String number = (String) map.get(MyService.KEY_NUMBER);
        String archive = (String) map.get(MyService.KEY_ARCHIVE);
        String note = (String) map.get(MyService.KEY_NOTE);
        List breadcrumbList = (List) map.get(MyService.KEY_BREADCRUMB);


        //String mets="http://disseminate.objectrepository.org/mets/10622/ARCH01225.85a";

        List<InputStream> sourcePDFs = new ArrayList<InputStream>();


        byte[] bytes = createTocPdf(breadcrumbList, number, archive, note, _selection);

        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);


        String args0 = archive + "." + number;
        //pdf.host=http://hdl.handle.net/10622/{0}?locatt=view:pdf
        //System.out.println(handle_host+"/"+args0+"?locatt=view:pdf");
        InputStream pdfIS = this.getInputStream(handle_host + "/" + args0 + "?locatt=view:pdf");

        sourcePDFs.add(byteArrayInputStream);


        if (pdfIS != null) {
            if (_selection != null) {
                PDDocument document = PDDocument.load(pdfIS);

                List<Integer> pageNumbers = this.pageNumbers(_selection, document.getNumberOfPages());

                org.apache.pdfbox.util.Splitter splitter = new org.apache.pdfbox.util.Splitter();
                List<PDDocument> list = splitter.split(document);
                for (int i = 0; i < pageNumbers.size(); i++) {
                    PDDocument pdDocument = list.get(pageNumbers.get(i));
                    ByteArrayOutputStream temp = new ByteArrayOutputStream();
                    pdDocument.save(temp);

                    ByteArrayInputStream inputStream = new ByteArrayInputStream(temp.toByteArray());
                    sourcePDFs.add(inputStream);
                }

            } else {
                sourcePDFs.add(pdfIS);
            }
        }

        // initialize the Merger utility and add pdfs to be merged
        PDFMergerUtility mergerUtility = new PDFMergerUtility();
        mergerUtility.addSources(sourcePDFs);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        mergerUtility.setDestinationStream(outputStream);
        // set the destination pdf name and merge input pdfs
        //mergerUtility.setDestinationFileName("c:\\merged3.pdf");
        mergerUtility.mergeDocuments();

        return outputStream.toByteArray();
    }

    private List<Integer> pageNumbers(String _selection, int numberOfPages) {
        ArrayList<Integer> result = new ArrayList<Integer>();
        String[] statements = _selection.split(",");

        for (int i = 0; i < statements.length; i++) {

            String statement = statements[i];
            try {
                if (statement.contains("-")) {
                    int pos = statement.indexOf("-");
                    int start = Integer.parseInt(statement.substring(0, pos)) - 1;
                    int end = Integer.parseInt(statement.substring(pos + 1, statement.length())) - 1;
                    int current = start;
                    while (current <= end) {
                        if (!(current > numberOfPages - 1) && !(current < 0))
                            result.add(current);
                        current++;
                    }
                } else {
                    int value = Integer.parseInt(statement);
                    if (!(value > numberOfPages - 1) && !(value < 0))
                        result.add(value - 1);
                }
            } catch (NumberFormatException e) {
                log.error(e);
            }
        }


        return result;
    }

    private int numberOfLevels(String _nodeName) {
        String temp = _nodeName.substring(5);
        int result = Integer.parseInt(temp);

        return result;
    }

    private String flattenString(String _s) {
        String result;
        result = _s.replaceAll("[\r\n]+", "");
        result = result.replaceAll("\\s+", " ");
        result = result.replaceAll("\"", "'");
        return result.trim();
    }

    private InputStream getInputStream(String _url) {
        InputStream in = null;
        try {

            URL server = new URL(_url);
            HttpURLConnection connection = (HttpURLConnection) server.openConnection();
            //System.out.println(connection.getResponseCode());

            connection.connect();
            in = connection.getInputStream();

        } catch (IOException e) {
            e.printStackTrace();
        }
        return in;

    }

    //TODO replace with IOUtils
    /*public String readResponse(InputStream is) throws IOException {
        BufferedInputStream bis = new BufferedInputStream(is);
		ByteArrayOutputStream buf = new ByteArrayOutputStream();
		int result = bis.read();
		while (result != -1) {
			byte b = (byte) result;
			buf.write(b);
			result = bis.read();
		}
		//System.out.println(buf.toString());
		return buf.toString();
	}*/
}
