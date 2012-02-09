package org.iish.visualmets.datamodels;

import java.io.IOException;
import java.util.ArrayList;

/**
 * User: gcu
 * Date: 9-dec-2010
 * Time: 15:57:29
 * @author: Gordan Cupac <gcu@iisg.nl>
 */
public class PagerItem {

    private static final long serialVersionUID = 7526471155622776147L;

    private String eadid;
    private String metsid;
    private int pageId;
    private int start;
    private int rows;
    private String use;
    private int count;

    PagerImageItem firstpage;
    PagerImageItem lastpage;
    ArrayList<PagerImageItem> listofpages;

    public PagerItem() {
        firstpage = new PagerImageItem();
        lastpage = new PagerImageItem();
        listofpages = new ArrayList();
    }

    // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

    public String getEadid() {
        return this.eadid;
    }

    public String getMetsid() {
        return this.metsid;
    }

    public void setStart(int start)
    {
        this.start = start;
    }

    public int getStart() {
        return this.start;
    }

    public int getRows() {
        return this.rows;
    }

    public String getUse() {
        return this.use;
    }

    public int getPageId() {
        return pageId;
    }

    public void setPageId(int pageId) {
        this.pageId = pageId;
    }

    public PagerImageItem getFirstpage() {
        return this.firstpage;
    }

    public PagerImageItem getLastpage() {
        return this.lastpage;
    }

    public ArrayList<PagerImageItem> getListofpages() {
        return listofpages;
    }


    // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

    public void setEadid(String eadid) {
        this.eadid = eadid;
    }

    public void setMetsid(String metsid) {
        this.metsid = metsid;
    }

    public void setRows(int rows) {
        this.rows = rows;
    }

    public void setUse(String use) {
        this.use = use;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public void add(String url, String label, int pageId) {
        PagerImageItem pagerImageItem = new PagerImageItem(url, label, pageId);
        listofpages.add(pagerImageItem);
    }

    public void add(String url, String label, int pageId, String thumbnailUrl, String transcription, String pageInfo) {
        PagerImageItem pagerImageItem = new PagerImageItem(url, label, pageId, thumbnailUrl, transcription, pageInfo);
        listofpages.add(pagerImageItem);
    }

    public void addPageInfo(String url, String label, int pageId, String thumbnailUrl, String transcription) throws Exception, IOException {
        PagerImageItem pagerImageItem = new PagerImageItem(url, label, pageId, thumbnailUrl, transcription, true);
        listofpages.add(pagerImageItem);
    }
}
