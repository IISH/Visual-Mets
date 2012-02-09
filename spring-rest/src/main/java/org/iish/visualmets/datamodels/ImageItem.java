package org.iish.visualmets.datamodels;

/**
 * Created by IntelliJ IDEA.
 * Date: 9-dec-2010
 * Time: 15:28:50
 * @author: Gordan Cupac <gcu@iisg.nl)
 */
public class ImageItem {
    private static final long serialVersionUID = 7526471155622776147L;

    private String eadid;
    private String metsid;
    private int pageid;
    private String use;
    private String url;
    private String mimetype;

    // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

    public String getEadid() {
        return this.eadid;
    }

    public String getMetsid() {
        return this.metsid;
    }

    public int getPageid() {
        return this.pageid;
    }

    public String getUse() {
        return this.use;
    }

    public String getUrl() {
        return this.url;
    }

    public String getMimetype() {
        return this.mimetype;
    }

    // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

    public void setEadid(String eadid) {
        this.eadid = eadid;
    }

    public void setMetsid(String metsid) {
        this.metsid = metsid;
    }

    public void setPageid(int pageid) {
        this.pageid = pageid;
    }

    public void setUse(String use) {
        this.use = use;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setMimetype(String mimetype) {
        this.mimetype = mimetype;
    }

    // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
}



