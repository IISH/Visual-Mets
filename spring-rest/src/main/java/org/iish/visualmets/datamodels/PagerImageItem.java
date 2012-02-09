package org.iish.visualmets.datamodels;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

/**
 * User: IISG/GC
 * Date: 14-09-2011
 * Time: 17:00
 */
public class PagerImageItem {
    private String url = "";
    private String thumbnailUrl = "";
    private String transcriptionUrl = "";
    private String pageInfoUrl = "";
    private String label = "";
    private int pageid;
    private int imageWidth = 0;
    private int imageHeight = 0;
    private String imageMimetype = "";
    private int thumbnailWidth = 0;
    private int thumbnailHeight = 0;
    private String thumbnailMimetype = "";
    private String transcription = "";

    public PagerImageItem(String url, String label, int pageid) {
        this.url = url;
        this.label = label;
        this.pageid = pageid;
    }

    public PagerImageItem(String url, String label, int pageid, String thumbnailUrl, String transcriptionUrl, String pageInfoUrl) {
        this.url = url;
        this.label = label;
        this.pageid = pageid;
        this.thumbnailUrl = thumbnailUrl;
        this.transcriptionUrl = transcriptionUrl;
        this.pageInfoUrl = pageInfoUrl;
    }

    public PagerImageItem(String url, String label, int pageid, String thumbnailUrl, String transcriptionUrl, Boolean showExtraImageInfo) throws Exception, IOException {
        this.url = url;
        this.label = label;
        this.pageid = pageid;
        this.thumbnailUrl = thumbnailUrl;
        this.transcriptionUrl = transcriptionUrl;

        if ( showExtraImageInfo ) {
            BufferedImage img;

            if ( !url.equals("") ) {
                // imageWidth & imageHeight
                img = ImageIO.read(new URL(url));
                this.imageWidth = img.getWidth();
                this.imageHeight = img.getHeight();
                img = null;

                // imageMimetype
                this.imageMimetype = findMimetype(url);
            }

            if ( !thumbnailUrl.equals("") ) {
                // thumbnailWidth & thumbnailHeight
                img = ImageIO.read(new URL(thumbnailUrl));
                this.thumbnailWidth = img.getWidth();
                this.thumbnailHeight = img.getHeight();
                img = null;

                // thumbnailMimetype
                this.thumbnailMimetype = findMimetype(thumbnailUrl);
            }

            if ( !transcriptionUrl.equals("") ) {
                // transcription
                this.transcription = readTextFromUrl(transcriptionUrl);
            }
        }
    }

    public PagerImageItem() {
    }

    private String findMimetype(String filename) {
        String mimetype = "";

        try {
            URL u = new URL(filename);
            URLConnection uc = u.openConnection();
            mimetype = uc.getContentType();
            uc = null;
            u = null;
        } catch (MalformedURLException e) {
          	e.printStackTrace();
        } catch (IOException e) {
        	e.printStackTrace();
        } finally {
        }

        return mimetype;
    }

    private String readTextFromUrl(String url) {
        String text = "";
        String inputLine;

        try {
            URL oUrl = new URL(url);
            BufferedReader in = new BufferedReader( new InputStreamReader( oUrl.openStream()));

            while ((inputLine = in.readLine()) != null)
                text += inputLine;

            in.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
        }

        return text;
    }

    public String getUrl() {
        return this.url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getLabel() {
        return this.label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public int getPageid() {
        return this.pageid;
    }

    public void setPageid(int pageid) {
        this.pageid = pageid;
    }

    public String getThumbnailUrl() {
        return this.thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getTranscriptionUrl() {
        return transcriptionUrl;
    }

    public void setTranscriptionUrl(String transcriptionUrl) {
        this.transcriptionUrl = transcriptionUrl;
    }

    public String getPageInfoUrl() {
        return pageInfoUrl;
    }

    public void setPageInfoUrl(String pageInfoUrl) {
        this.pageInfoUrl = pageInfoUrl;
    }

    public int getImageWidth() {
        return imageWidth;
    }

    public void setImageWidth(int imageWidth) {
        this.imageWidth = imageWidth;
    }

    public int getImageHeight() {
        return imageHeight;
    }

    public void setImageHeight(int imageHeight) {
        this.imageHeight = imageHeight;
    }

    public String getImageMimetype() {
        return imageMimetype;
    }

    public void setImageMimetype(String imageMimetype) {
        this.imageMimetype = imageMimetype;
    }

    public String getTranscription() {
        return transcription;
    }

    public void setTranscription(String transcription) {
        this.transcription = transcription;
    }

    public int getThumbnailWidth() {
        return thumbnailWidth;
    }

    public void setThumbnailWidth(int thumbnailWidth) {
        this.thumbnailWidth = thumbnailWidth;
    }

    public int getThumbnailHeight() {
        return thumbnailHeight;
    }

    public void setThumbnailHeight(int thumbnailHeight) {
        this.thumbnailHeight = thumbnailHeight;
    }

    public String getThumbnailMimetype() {
        return thumbnailMimetype;
    }

    public void setThumbnailMimetype(String thumbnailMimetype) {
        this.thumbnailMimetype = thumbnailMimetype;
    }
}
