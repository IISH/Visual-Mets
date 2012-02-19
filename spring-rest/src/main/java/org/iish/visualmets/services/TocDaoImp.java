/*
 * Copyright 2010 International Institute for Social History, The Netherlands.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.iish.visualmets.services;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.iish.visualmets.dao.TocDao;
import org.iish.visualmets.datamodels.TocFolderItem;
import org.iish.visualmets.datamodels.TocMetsItem;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.XMLConstants;
import javax.xml.namespace.NamespaceContext;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

/**
 * This class offers methods to send a Solr query and return a datastructure.
 *
 * @author Lucien van Wouw <lwo@iisg.nl>
 * @author Gordan Cupac <gcu@iisg.nl>
 */
public class TocDaoImp implements TocDao {

    private String namespaceName;

    /**
     * Selects child folders that directly fall under the parent folder
     * Each child folder includes all objects ( Mets documents ) that fall under those folders.
     *
     * @param eadId URL to TableOfContents XML file
     * @param group The identity of the parent folder
     * @return An arraylist of all child folders and their objects
     */
    @Override
    public List<TocFolderItem> getEADFolders(String eadId, String group, int namespace) {

        if ( namespace ==  1 ) {
            namespaceName = "mets:";
        } else {
            namespaceName = "";
        }

        if ( group.equals("0")) {
            group = "";
        }
        List<TocFolderItem> list = new ArrayList<TocFolderItem>();
        TocFolderItem folderItem = null;
        TocFolderItem folderItem2 = null;

        DocumentBuilderFactory domFactory = DocumentBuilderFactory.newInstance();
        domFactory.setNamespaceAware(true); // never forget this!

        DocumentBuilder builder = null;
        try {
            builder = domFactory.newDocumentBuilder();
        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        }
        Document doc = null;

        try {
            doc = builder.parse(eadId);
        } catch (SAXException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        XPathExpression expr   =    null;
        try {
            // als geen group pak dan root mets:div directory
            if ( group.equals("") ) {
//                if ( namespaceName.equals("") ) {
////                    expr = xpath.compile("/mets/structMap");
//                    expr = xpath.compile("/mets");
//                } else {
                expr = getXPathExpression("/" + namespaceName + "mets/" + namespaceName + "structMap");
//                expr = getXPathExpression("//" + namespaceName + "structMap");
//                }
            } else {
                expr = getXPathExpression("/" + namespaceName + "mets/" + namespaceName + "structMap//" + namespaceName + "div[@ID='" + group +"']");
            }
        } catch (XPathExpressionException e) {
            e.printStackTrace();
        }
//System.out.println(eadId);
//System.out.println("/" + namespaceName + "mets/" + namespaceName + "structMap");
        Object result = null;
        try {
            result = expr.evaluate(doc, XPathConstants.NODESET);
        } catch (XPathExpressionException e) {
            e.printStackTrace();
        }

        ArrayList<TocFolderItem> breadCrumbs = new ArrayList<TocFolderItem>();
        NodeList nodes = (NodeList) result;
//System.out.println("Found: " + nodes.getLength());
        // use first found node
        if ( nodes.getLength() > 0 ) {

            int i = 0;
//            for ( int i = 0; i < nodes.getLength(); i++ ) {
            // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

            // try to find breadcrumbs
            breadCrumbs = findBreadCrumbs(breadCrumbs, nodes.item(i));

            // if found multiple breadcrumbs
            if ( breadCrumbs.size() > 1 ) {
                // reverse order of found breadcrumbs (root parent als eerst, dan sub parent, dan sub sub parent)
                Collections.reverse(breadCrumbs);
            }

            // if there are breadcrumbs add to result list
            if ( breadCrumbs.size() > 0 ) {
                folderItem = new TocFolderItem();
                folderItem.setBreadcrumbs(breadCrumbs);
                list.add(folderItem);
            }

            // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

            // try to find XML files in current directory
            folderItem2 = new TocFolderItem();

            // acherhaal alle xml files in huidige directory
            ArrayList<TocMetsItem> lijst = new ArrayList<TocMetsItem>();
            String nodeId = "";
            try {
                nodeId = nodes.item(i).getAttributes().getNamedItem("ID").getNodeValue();
            } catch (NullPointerException e) {
                nodeId = "";
            }
            System.out.println("ID: " + nodeId);
            lijst = getFilesRecursive(doc, lijst, nodeId, 0);

            for (TocMetsItem tocMetsItem : lijst) {
                folderItem2.addDocs(tocMetsItem);
            }

            list.add(folderItem2);

            // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

            // try to find subdirectories, if found, create for each one a mets folder item
            ArrayList<String> listOfSubDirectories = getArrayOfSubDirectories(nodes.item(i));
            if ( listOfSubDirectories.size() > 0 ) {
                for ( String id : listOfSubDirectories ) {
                    folderItem = createFolder(doc, id, 1); // recursive on
//                    folderItem = createFolder(doc, id, 0); // recursive off
                    //
                    list.add(folderItem);
                }
            }

            // DEZE HELE IF BLOCK MOET EIGENLIJK WEG, DE FRONT END CODE MOET ANDERS
//            if ( areThereSubs == 0 ) {
//                folderItem = new TocFolderItem();
//
//                folderItem.setIndex(nodes.item(0).getAttributes().getNamedItem("ID").getNodeValue());
//                folderItem.setTitle(nodes.item(0).getAttributes().getNamedItem("LABEL").getNodeValue());
//                //folderItem.setTitle("---");
//                // does node (directory) have subdirectories (also a node, but watch out, files are also nodes)
//                folderItem.setHaschildren("false");
//
//
//                // acherhaal alle xml files in huidige directory
//                ArrayList<TocMetsItem> lijst3 = new ArrayList<TocMetsItem>();
//                System.out.println("ID: " + nodes.item(0).getAttributes().getNamedItem("ID").getNodeValue());
//                lijst3 = getFilesRecursive(doc, lijst3, nodes.item(0).getAttributes().getNamedItem("ID").getNodeValue(), 0);
//
//                for (TocMetsItem tocMetsItem : lijst3) {
//                    folderItem.add(tocMetsItem);
//                }
//
//                //
//                list.add(folderItem);
//            }

            // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

//            }
        }

        return list;
    }

    private ArrayList<String> getArrayOfSubDirectories(Node node) {
        ArrayList<String> listOfSubDirectories = new ArrayList<String>();

        for ( int j = 0; j < node.getChildNodes().getLength(); j++  ) {
            if ( node.getChildNodes().item(j).getNodeName().equals(namespaceName + "div") ) {

                // controleer of huidige node subnodes (mapjes en/of files) bevat
                for ( int k = 0; k < node.getChildNodes().item(j).getChildNodes().getLength(); k++  ) {
                    if ( node.getChildNodes().item(j).getChildNodes().item(k).getNodeName().equals(namespaceName + "div") ) {

                        listOfSubDirectories.add(node.getChildNodes().item(j).getAttributes().getNamedItem("ID").getNodeValue());

                    }
                }
            }
        }

        // make unique
        ArrayList<String> listOfSubDirectories2 = null;
        if ( listOfSubDirectories.size() > 0 ) {
            listOfSubDirectories2 = uniqueArrayList(listOfSubDirectories);
        } else {
            listOfSubDirectories2 = new ArrayList<String>();
        }

        return listOfSubDirectories2;
    }

    public ArrayList<String> uniqueArrayList(ArrayList<String> arrl) {
        int i;

        for(int k=0; k<arrl.size(); k++) {
            Object s=arrl.get(k);
            i=Collections.frequency(arrl,s);

            for(int j=1;j<i;j++) {
                arrl.remove(s);
            }
        }

        return arrl;
    }

    private TocFolderItem createFolder(Document doc, String group, int recursive) {
        XPathExpression expr   =    null;
        try {
            // als geen group pak dan root mets:div directory
            if ( group.equals("") ) {
//                expr = getXPathExpression("/mets:mets/mets:structMap/mets:div");
                expr = getXPathExpression("/" + namespaceName + "mets/" + namespaceName + "structMap");
            } else {
                expr = getXPathExpression("/" + namespaceName + "mets/" + namespaceName + "structMap//" + namespaceName + "div[@ID='" + group +"']");
            }
        } catch (XPathExpressionException e) {
            e.printStackTrace();
        }

        Object result = null;
        try {
            result = expr.evaluate(doc, XPathConstants.NODESET);
        } catch (XPathExpressionException e) {
            e.printStackTrace();
        }

        NodeList nodes = (NodeList) result;

//        System.out.println("++++ " + "/mets:mets/mets:structMap//mets:div[@ID='" + group +"']");

        TocFolderItem folderItem = new TocFolderItem();


        folderItem.setIndex(nodes.item(0).getAttributes().getNamedItem("ID").getNodeValue());
        folderItem.setTitle(nodes.item(0).getAttributes().getNamedItem("LABEL").getNodeValue());

        // does node (directory) have subdirectories (also a node, but watch out, files are also nodes)
        String hasDirs = "false";
        ArrayList<String> listOfSubDirectories = getArrayOfSubDirectories(nodes.item(0));
        if ( listOfSubDirectories.size() > 0 ) {
            hasDirs = "true";
        }
        folderItem.setHaschildren(hasDirs);

        //
        ArrayList<TocMetsItem> lijst = new ArrayList<TocMetsItem>();
        System.out.println("ID: " + nodes.item(0).getAttributes().getNamedItem("ID").getNodeValue());
        lijst = getFilesRecursive(doc, lijst, nodes.item(0).getAttributes().getNamedItem("ID").getNodeValue(), recursive);

        for (TocMetsItem tocMetsItem : lijst) {
            folderItem.add(tocMetsItem);
        }

        return folderItem;
    }

    private ArrayList<TocMetsItem> getFilesRecursive(Document doc, ArrayList<TocMetsItem> lijst, String group, int recursive) {
        XPathExpression expr   =    null;
        try {
            // als geen group pak dan root mets:div directory
            if ( group.equals("") ) {
//                expr = getXPathExpression("/mets:mets/mets:structMap/mets:div");
                expr = getXPathExpression("/"+ namespaceName + "mets/" + namespaceName + "structMap");
            } else {
                expr = getXPathExpression("/" + namespaceName + "mets/" + namespaceName + "structMap//" + namespaceName + "div[@ID='" + group +"']");
            }
        } catch (XPathExpressionException e) {
            e.printStackTrace();
        }

        Object result = null;
        try {
            result = expr.evaluate(doc, XPathConstants.NODESET);
        } catch (XPathExpressionException e) {
            e.printStackTrace();
        }

        NodeList nodes = (NodeList) result;

//        System.out.println("++++ " + "/mets:mets/mets:structMap//mets:div[@ID='" + group +"']");

        for ( int j = 0; j < nodes.item(0).getChildNodes().getLength(); j++  ) {
            if ( nodes.item(0).getChildNodes().item(j).getNodeName().equals(namespaceName + "div") ) {
                int somethingFound = 0;
                String xlink_href = "";
                String thumbnail_href = "";
                String FILEID = "";

                for ( int k = 0; k < nodes.item(0).getChildNodes().item(j).getChildNodes().getLength(); k++  ) {
                    if ( nodes.item(0).getChildNodes().item(j).getChildNodes().item(k).getNodeName().equals(namespaceName + "mptr") ) {
                        somethingFound = 1;
                        xlink_href = nodes.item(0).getChildNodes().item(j).getChildNodes().item(k).getAttributes().getNamedItem("xlink:href").getNodeValue();
                    }

                    if ( nodes.item(0).getChildNodes().item(j).getChildNodes().item(k).getNodeName().equals(namespaceName + "fptr") ) {
                        somethingFound = 1;
                        FILEID = nodes.item(0).getChildNodes().item(j).getChildNodes().item(k).getAttributes().getNamedItem("FILEID").getNodeValue();
                    }
                }

                if ( somethingFound == 1 ) {
                    String title = null;
                    try {
                        title = nodes.item(0).getChildNodes().item(j).getAttributes().getNamedItem("LABEL").getNodeValue();
                    } catch ( NullPointerException e ) {
                        title = "BIJ FILE DIV MOET OOK EEN LABEL!";
                    }
                    if ( !FILEID.equals("") ) {
                        thumbnail_href = getThumbnailUrl(doc, FILEID);
                    }

                    // add doc to list
                    TocMetsItem ttt = addItem(xlink_href, title, thumbnail_href);
                    lijst.add(ttt);
                }
            }
        }

        if ( recursive == 1 ) {
            // find if current directory has subdirectories
            ArrayList<String> listOfSubDirectories = getArrayOfSubDirectories(nodes.item(0));
            if ( listOfSubDirectories.size() > 0 ) {
                for ( String s : listOfSubDirectories ) {
                    lijst = getFilesRecursive(doc, lijst, s, recursive);
                }
            }
        }

        return lijst;
    }

    private String getThumbnailUrl(Document doc, String FILEID) {
        String url = "";

//        XPathFactory factory = XPathFactory.newInstance();
        XPathExpression expr   =    null;
        try {
            expr = getXPathExpression("/" + namespaceName + "mets/" + namespaceName + "fileSec/" + namespaceName + "fileGrp/" + namespaceName + "file[@ID='" + FILEID +"']/" + namespaceName + "FLocat");
        } catch (XPathExpressionException e) {
            e.printStackTrace();
        }

        Object result = null;
        try {
            result = expr.evaluate(doc, XPathConstants.NODESET);
        } catch (XPathExpressionException e) {
            e.printStackTrace();
        }

        NodeList nodes = (NodeList) result;
        if ( nodes.getLength() > 0 ) {
            url = nodes.item(0).getAttributes().getNamedItem("xlink:href").getNodeValue();
        }

        return url;
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

//        if ( !namespaceName.equals("") ) {
            xpath.setNamespaceContext(ns);
//        }
        XPathExpression expr = xpath.compile(xquery);

        return expr;
    }


    private ArrayList<TocFolderItem> findBreadCrumbs(ArrayList<TocFolderItem> breadCrumbs, Node breadNode) {

        // maak breadcrumb item
        try {
            TocFolderItem breadCrumbItem = new TocFolderItem();
            breadCrumbItem.setIndex(String.valueOf(breadNode.getAttributes().getNamedItem("ID").getNodeValue()));
            breadCrumbItem.setTitle(breadNode.getAttributes().getNamedItem("LABEL").getNodeValue());

           // voeg breadcrumb toe aan lijst van breadcrumbs
            breadCrumbs.add(breadCrumbItem);
        } catch ( NullPointerException e) {

        }

        // try to find parentNode
        Node parentNode = breadNode.getParentNode();
        if ( parentNode.getNodeName().equals(namespaceName + "div") ) {

            // recursive: try fo find parents parentnode
            breadCrumbs = findBreadCrumbs(breadCrumbs, parentNode);
        }

        return breadCrumbs;
    }

    private TocMetsItem addItem(String id, String title, String url) {
        TocMetsItem MetsItem = new TocMetsItem();
        MetsItem.setMetsId(id);
        MetsItem.setTitle(title);
        MetsItem.setThumbnail(url);
        return MetsItem;
    }

    protected final Log log = LogFactory.getLog(getClass());
}