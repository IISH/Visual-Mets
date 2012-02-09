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

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.iish.visualmets.dao.DocumentDao;
import org.iish.visualmets.datamodels.ImageItem;
import org.iish.visualmets.datamodels.PagerItem;
import org.springframework.beans.factory.annotation.Value;

/*
* Created by IntelliJ IDEA.
* Date: 1-dec-2010
* Time: 16:00:21
*
* @author: Lucien van Wouw <lwo@iisg.nl>
* @author: Gordan Cupac <gcu@iisg.nl>
*/

public class SolrQueryFactoryDocumentsImp extends SolrQueryFactory implements DocumentDao {


    @Value("#{visualmetsProperties['proxy.host']}")
    private String proxy_host = "/";
    @Value("#{visualmetsProperties['proxy.host.mets']}")
    private String proxy_host_mets = "/";

    // functie moet een datamodel teruggeven
    @Override
    public ImageItem getUrl(String eadId, String metsId, int pageId, String use) throws SolrServerException {

        String query = "eadid:10767897_EAD AND metsid:" + metsId + " AND order_sort:" + pageId + " AND use:" + use;
        SolrQuery solrQuery = new SolrQuery(query);
        solrQuery.setFields("url,mimetype"); // in 1 regel
        solrQuery.setRows(1);

        QueryResponse response = getSolrResponse(solrQuery);
        SolrDocumentList documentList = response.getResults();

        String url = "";
        String mimetype = "";

        if (documentList.getNumFound() == 0) {
            url = "http://www.iisg.nl/"; // No url ? Throw a nice exception... or some default url
            mimetype = "unknown";
        } else {
            url = (String) documentList.get(0).getFieldValue("url");
            mimetype = (String) documentList.get(0).getFieldValue("mimetype");
        }

        ImageItem imageInfo = new ImageItem();
        imageInfo.setEadid(eadId);
        imageInfo.setMetsid(metsId);
        imageInfo.setPageid(pageId);
        imageInfo.setUse(use);
        imageInfo.setUrl(url);
        imageInfo.setMimetype(mimetype);

        return imageInfo;
    }

    // TODO:GCU
    // moet een datamodel terug geven: label, url, pageId ( pagina positie ) en use.
    // Er wordt in dit overzicht gepaged... in het data model moet duidelijk zijn wat de eerste en laatste pagina's zijn.
    // die eadId kan later echt worden
//    public HashMap getPager(String eadId, String metsId, int start, int rows, String use) throws SolrServerException {
    @Override
    public PagerItem getPager(String eadId, String metsId, int pageId, int start, int rows, String use) throws SolrServerException {
        String query = "eadid:10767897_EAD AND metsid:" + metsId + " AND use:" + use;
        SolrQuery solrQuery = new SolrQuery(query);
        solrQuery.setFields("label,url"); // opmerking: moet in 1 regel
        solrQuery.setRows(9999);
        solrQuery.setStart(0);

        QueryResponse response = getSolrResponse(solrQuery);
        SolrDocumentList documentList = response.getResults();

        PagerItem pagerItem = new PagerItem();
        pagerItem.setEadid(eadId);
        pagerItem.setMetsid(metsId);
        pagerItem.setPageId(pageId);
        pagerItem.setStart(start);
        pagerItem.setRows(rows);
        pagerItem.setUse(use);


        int documentCount = documentList.size();
        pagerItem.setCount(documentCount);

        if (documentCount > 0) {
            // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

            //   HashMap hashMapFirst = new HashMap();
            //   HashMap hashMapFirstPage = new HashMap();

            //  hashMapFirst.put("url", (String) documentList.get(0).getFieldValue("url"));
            //   hashMapFirst.put("label", (String) documentList.get(0).getFieldValue("label"));
            //   hashMapFirst.put("number", (Integer) 1);

            //   hashMapFirstPage.put("page", (HashMap) hashMapFirst);
            //   hashMapTotal.put("first", (HashMap) hashMapFirstPage);

            // todox
//            pagerItem.getFirstpage().setUrl((String) documentList.get(0).getFieldValue("url"));

            // PROBLEM
            // TODOX: wat is proxy host
            // het gaat niet goed als je de website vanaf een andere pc bezoekt
            // via http://IPADRES...
            // de proxy_host blijkt dan localhost te zijn, en die bestaat niet op de 'andere' pc
            String url_thumbnail = proxy_host_mets + "rest/resource/thumbnail_image?eadId=" + eadId + "&metsId=" + metsId + "&pageId=" + 1;
            pagerItem.getFirstpage().setUrl(url_thumbnail);
            pagerItem.getFirstpage().setLabel((String) documentList.get(0).getFieldValue("label"));
            pagerItem.getFirstpage().setPageid(1);

            // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

            //   HashMap hashMapLast = new HashMap();
            //  HashMap hashMapLastPage = new HashMap();

            //  hashMapLast.put("url", (String) documentList.get(documentCount-1).getFieldValue("url"));
            // hashMapLast.put("label", (String) documentList.get(documentCount-1).getFieldValue("label"));
            // hashMapLast.put("number", (Integer) documentCount);

            // hashMapLastPage.put("page", (HashMap) hashMapLast);
            // hashMapTotal.put("last", (HashMap) hashMapLastPage);

            // todox
//            pagerItem.getLastpage().setUrl((String) documentList.get(documentCount - 1).getFieldValue("url"));
            pagerItem.getLastpage().setUrl(proxy_host_mets + "rest/resource/thumbnail_image?eadId=" + eadId + "&metsId=" + metsId + "&pageId=" + documentCount);
            pagerItem.getLastpage().setLabel((String) documentList.get(documentCount - 1).getFieldValue("label"));
            pagerItem.getLastpage().setPageid(documentCount);

            // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

            //ArrayList<HashMap> arrListPages = new ArrayList<HashMap>();
            int counter = 0;
            int startCriterium = start;
            int endCriterium = start + rows - 1;
            //int a = documentList.size();
            for (SolrDocument doc : documentList) {
                counter++;

                if (counter >= startCriterium && counter <= endCriterium) {
                    //     HashMap hashMapCurrent = new HashMap();

                    //     hashMapCurrent.put("url", (String) doc.getFieldValue("url"));
                    //       hashMapCurrent.put("label", (String) doc.getFieldValue("label"));
                    //      hashMapCurrent.put("number", (Integer) counter);

                    // todox
//                    String url = (String) doc.getFieldValue("url");
//                    String url = proxy_host_mets + "rest/resource/thumbnail_image?eadId=" + eadId + "&metsId=" + metsId + "&pageId=" + counter;
                    String url = proxy_host_mets + "rest/resource/thumbnail_image?metsId=" + metsId + "&pageId=" + counter;
                    String label = (String) doc.getFieldValue("label");


                    pagerItem.add(url, label, counter);
                    //int itemCount = pagerItem.getListofpages().size();
                    //pagerItem.getListofpages().getItem(itemCount-1).setUrl((String) doc.getFieldValue("url"));
                    //pagerItem.getListofpages().getItem(itemCount-1).setLabel((String) doc.getFieldValue("label"));
                    //pagerItem.getListofpages().getItem(itemCount-1).setNumber((Integer) counter);

                    //   arrListPages.add(hashMapCurrent);

                    //    hashMapCurrent = null;
                }
            }

            //   hashMapTotal.put("pages", (ArrayList) arrListPages);
        }

//        return hashMapTotal;
        return pagerItem;
    }

    @Override
    public PagerItem getPagerPageInfo(String eadId, String metsId, int pageId, int start, int rows, String use) throws SolrServerException {
        String query = "eadid:10767897_EAD AND metsid:" + metsId + " AND use:" + use;
        SolrQuery solrQuery = new SolrQuery(query);
        solrQuery.setFields("label,url"); // opmerking: moet in 1 regel
        solrQuery.setRows(9999);
        solrQuery.setStart(0);

        QueryResponse response = getSolrResponse(solrQuery);
        SolrDocumentList documentList = response.getResults();

        PagerItem pagerItem = new PagerItem();
        pagerItem.setEadid(eadId);
        pagerItem.setMetsid(metsId);
        pagerItem.setPageId(pageId);
        pagerItem.setStart(start);
        pagerItem.setRows(rows);
        pagerItem.setUse(use);

        // CODE REMOVED
        // CODE REMOVED
        // CODE REMOVED

        return pagerItem;
    }
}