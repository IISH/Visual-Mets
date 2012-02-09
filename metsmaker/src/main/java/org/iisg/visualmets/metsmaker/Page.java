package org.iisg.visualmets.metsmaker;

/* This class describes a page of a METS document */
public class Page {
    String archiveId;
    String referenceId;
    String thumbnailId;
    String ocrId;
    int seq;
    int columns;

    public Page(){
        this("","","","",0, 0);
    }

    public Page(String archiveId, String referenceId, String thumbnailId, String ocrId, int seq, int columns){
        this.archiveId = archiveId;
        this.referenceId = referenceId;
        this.thumbnailId = thumbnailId;
        this.ocrId = ocrId;
        this.seq = seq;
        this.columns = columns;
    }
}
