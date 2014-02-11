package org.iisg.visualmets.metsmaker;


import au.edu.apsr.mtk.base.*;
import au.edu.apsr.mtk.ch.METSReader;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.*;
import java.io.File;
import java.util.ArrayList;

/**
 * Author: Christian Roosendaal
 */
public class MetsMaker {
    ArrayList<Page> pageArrayList;
    String proxy;
    String outputDirectory;
    String inputFile;
    String na;

    String pageColumnName;
    String objectColumnName;
    String pidColumnName;

    int pidColumnNr;
    int pageColumnNr;
    int objectColumnNr;

    // column nummers beginnen bij 0
    private static int ARCHIVE_URL_COLUMN = 2;
    private static int REFERENCE_URL_COLUMN = 3;
    private static int PAGE_NUMBER_COLUMN = 4;
    private static int THUMBNAIL_URL_COLUMN = 5;
    private static int OCR_COLUMN = 6;

    private static final String PID_COLUMN_DEFAULT = "PID";
    private static final String PAGE_COLUMN_DEFAULT = "volgnr";
    private static final String OBJECT_COLUMN_DEFAULT = "objnr";
    private static final String CSV_SEPARATOR = ",";
    private static final String METS_HEADER_FILENAME = "metsheader.xml";

    public MetsMaker(String na, String inputFile, String proxy, String outputDirectory, String pidColumn, String pageColumn, String objectColumn) throws METSException, IOException, SAXException, ParserConfigurationException {
        if (!(Character.toString(proxy.charAt(proxy.length() - 1)).equals("/"))) {
            proxy = proxy.concat("/");
        }

        this.na = na;
        this.proxy = proxy;
        this.inputFile = inputFile;

        if (!(Character.toString(outputDirectory.charAt(outputDirectory.length() - 1)).equals("/")) &&
                !(Character.toString(outputDirectory.charAt(outputDirectory.length() - 1)).equals("\\"))) {
            outputDirectory = outputDirectory.concat("/");
        }
        this.outputDirectory = outputDirectory;

        if (pidColumn == null || pidColumn.isEmpty()) {
            this.pidColumnName = PID_COLUMN_DEFAULT;
        } else {
            this.pidColumnName = pidColumn;
        }

        if ( pageColumn == null || pageColumn.isEmpty()) {
            this.pageColumnName = PAGE_COLUMN_DEFAULT;
        } else {
            this.pageColumnName = pageColumn;
        }

        if (objectColumn == null || objectColumn.isEmpty()) {
            this.objectColumnName = OBJECT_COLUMN_DEFAULT;
        } else {
            this.objectColumnName = objectColumn;
        }

        pageArrayList = new ArrayList<Page>();
        System.out.println("Output directory: " + this.outputDirectory);
        System.out.println("Proxy url: " + this.proxy);
        System.out.println("pidColumnName: " + this.pidColumnName);
        System.out.println("pageColumnName: " + this.pageColumnName);
        System.out.println("objectColumnName: " + this.objectColumnName);
        System.out.println("na: " + this.na);
        System.out.println("inputFile: " + this.inputFile);

        readFileAndCreateMets();
    }

    public void parseColumns(String header) {
        String[] columnNames = header.split(CSV_SEPARATOR);

        for (int i = 0; i < columnNames.length; i++) {

            if (columnNames[i].equals(pidColumnName)) {
                pidColumnNr = i;
            } else if (columnNames[i].equals(pageColumnName)) {
                pageColumnNr = i;
            } else if (columnNames[i].equals(objectColumnName)) {
                objectColumnNr = i;
            }

        }

    }


    public void readFileAndCreateMets() throws METSException, SAXException {
        String prevFolder = "";
        String folder = "";
        StringBuilder output = new StringBuilder();
        File f = new File(inputFile);

        try {
            BufferedReader input = new BufferedReader(new FileReader(inputFile));
            try {
                String line;

                parseColumns(input.readLine()); // skip first line containing column headers

                while ((line = input.readLine()) != null) {
                    String[] split = line.split(CSV_SEPARATOR);

                    folder = split[objectColumnNr];
                    if (!folder.equals(prevFolder) && !prevFolder.isEmpty()) {
                        createMets(prevFolder, output);
                        output.setLength(0);
                    }
                    prevFolder = folder;

                    line += "\n";
                    output.append(line);
                }
                createMets(folder, output);
                output.setLength(0);
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                input.close();
            }
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    public void createMets(String folder, StringBuilder document) throws METSException, IOException, SAXException, ParserConfigurationException {

        final METSWrapper mw = initMetsTemplate();

        createFileSec(mw.getMETSObject(), document.toString());
        createStructMap(mw.getMETSObject());
        mw.validate();
        pageArrayList.clear();


        File parent = new File(outputDirectory);
        final String objId = parent.getName() + "." + folder;
        mw.getMETSObject().setObjID("hdl:" + na + "/" + objId);
        File output_file = new File(parent, objId + ".xml");
        System.out.println("Creating METS file " + output_file.getAbsoluteFile());
        FileOutputStream output = new FileOutputStream(output_file);
        mw.write(output);
        output.close();
    }

    public METSWrapper initMetsTemplate() throws IOException, SAXException, ParserConfigurationException, METSException {

        final File file = new File(inputFile);
        final File t = new File(file.getParentFile() + File.separator + METS_HEADER_FILENAME);
        METSWrapper mw;
        if (t.exists()) {
            METSReader mr = new METSReader();
            mr.mapToDOM(new FileInputStream(t));
            mw = new METSWrapper(mr.getMETSDocument());
        } else {
            mw = new METSWrapper();
        }
        return mw;
    }

    public void createFileSec(METS mets, String document) throws METSException {
        String[] lines = document.split("\n");

        String thumbnailImageUrl = "";
        String referenceImageUrl = "";
        String archiveImageUrl = "";
        String ocrUrl = "";

        FileSec fs = mets.newFileSec();
        FileGrp archive = fs.newFileGrp();
        archive.setUse("archive image");
        FileGrp reference = fs.newFileGrp();
        reference.setUse("reference image");
        FileGrp thumbnail = fs.newFileGrp();
        thumbnail.setUse("thumbnail image");
        FileGrp ocr = fs.newFileGrp();
        ocr.setUse("ocr");

        for (String line : lines) {
            int seq;
            String archiveId;
            String referenceId;
            String thumbnailId;
            String ocrId;
            String[] columns = line.split(CSV_SEPARATOR);
            seq = Integer.parseInt(columns[pageColumnNr]);
            archiveId = "A" + seq;
            referenceId = "B" + seq;
            thumbnailId = "C" + seq;
            ocrId = "D" + seq;

            // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

            au.edu.apsr.mtk.base.File f = archive.newFile();
            f.setID(archiveId);
            f.setMIMEType("image/tiff");
            f.setSeq(String.valueOf(seq));
            f.setGroupID(String.valueOf(seq));

            // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

            FLocat fl = f.newFLocat();
            fl.setLocType("HANDLE");
            fl.setType("simple");
            archiveImageUrl = this.proxy + columns[pidColumnNr] + "?locatt=view:master";
            archiveImageUrl = archiveImageUrl.replace("\"", "");
            fl.setHref(archiveImageUrl);

            f.addFLocat(fl);
            archive.addFile(f);

            // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

            au.edu.apsr.mtk.base.File f2 = reference.newFile();
            f2.setID(referenceId);
            f2.setMIMEType("image/jpeg");
            f2.setSeq(String.valueOf(seq));
            f2.setGroupID(String.valueOf(seq));

            FLocat fl2 = f2.newFLocat();
            fl2.setLocType("HANDLE");
            fl2.setType("simple");
            referenceImageUrl = this.proxy + columns[pidColumnNr] + "?locatt=view:level1";
            referenceImageUrl = referenceImageUrl.replace("\"", "");
            fl2.setHref(referenceImageUrl);

            f2.addFLocat(fl2);
            reference.addFile(f2);

            // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

            au.edu.apsr.mtk.base.File f3 = thumbnail.newFile();
            f3.setID(thumbnailId);
            f3.setMIMEType("image/jpeg");
            f3.setSeq(String.valueOf(seq));
            f3.setGroupID(String.valueOf(seq));

            FLocat fl3 = f3.newFLocat();
            fl3.setLocType("HANDLE");
            fl3.setType("simple");
            thumbnailImageUrl = this.proxy + columns[pidColumnNr] + "?locatt=view:level3";
            thumbnailImageUrl = thumbnailImageUrl.replace("\"", "");
            fl3.setHref(thumbnailImageUrl);
            f3.addFLocat(fl3);
            thumbnail.addFile(f3);

            // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

            if (columns.length >= 7) {
                ocrUrl = this.proxy + columns[OCR_COLUMN];
                ocrUrl = ocrUrl.replace("\"", "");

                au.edu.apsr.mtk.base.File f4 = ocr.newFile();
                f4.setID(ocrId);
                f4.setMIMEType("text/plain");
                f4.setSeq(String.valueOf(seq));
                f4.setGroupID(String.valueOf(seq));

                FLocat fl4 = f4.newFLocat();
                fl4.setLocType("HANDLE");
                fl4.setType("simple");
                fl4.setHref(ocrUrl);
                f4.addFLocat(fl4);
                ocr.addFile(f4);
            }

            // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

            Page page = new Page(archiveId, referenceId, thumbnailId, ocrId, seq, columns.length);
            pageArrayList.add(page);
        }

        fs.addFileGrp(archive);
        fs.addFileGrp(reference);
        fs.addFileGrp(thumbnail);
        //fs.addFileGrp(ocr);

        mets.setFileSec(fs);
    }

    /* ToDo: wat moet er in innerDiv.setDmdID, ORDER en LABEL?*/
    public void createStructMap(METS mets) throws METSException, IOException, SAXException {
        StructMap sm = mets.newStructMap();
        sm.setType("physical");
        mets.addStructMap(sm);

        Div innerDiv = sm.newDiv();
        innerDiv.setType("text");
        innerDiv.setOrder("1");
        //innerDiv.setDmdID("DMD1");

        sm.addDiv(innerDiv);

        for (Page page : pageArrayList) {
            Div pageDiv = innerDiv.newDiv();
            pageDiv.setType("page");
            pageDiv.setLabel("page " + page.seq);
            pageDiv.setOrder(String.valueOf(page.seq));
            innerDiv.addDiv(pageDiv);

            Fptr archiveFp = innerDiv.newFptr();
            archiveFp.setFileID(page.archiveId);
            pageDiv.addFptr(archiveFp);

            Fptr referenceFp = innerDiv.newFptr();
            referenceFp.setFileID(page.referenceId);
            pageDiv.addFptr(referenceFp);

            Fptr thumbnailFp = innerDiv.newFptr();
            thumbnailFp.setFileID(page.thumbnailId);
            pageDiv.addFptr(thumbnailFp);

            if (page.columns >= 7) {
                Fptr ocrFp = innerDiv.newFptr();
                ocrFp.setFileID(page.ocrId);
                pageDiv.addFptr(ocrFp);
            }
        }
    }
}
