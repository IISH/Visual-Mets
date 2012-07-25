package org.iisg.visualmets.metsmaker;


import au.edu.apsr.mtk.base.*;
import au.edu.apsr.mtk.base.File;
import org.xml.sax.SAXException;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.TimeZone;

/**
 * Author: Christian Roosendaal
 */
public class MetsMaker {
    METS mets;
    METSWrapper mw;
    ArrayList<Page> pageArrayList;
    String baseUrl;
    String outputDirectory;
    String objId;

    String pageColumnName;
    String pidColumnName;



    int nrOfMets = 0;
    int pidColumnNr;
    int pageColumnNr;

    // column nummers beginnen bij 0
    private static int ARCHIVE_URL_COLUMN = 2;
    private static int REFERENCE_URL_COLUMN = 3;
    private static int PAGE_NUMBER_COLUMN = 4;
    private static int THUMBNAIL_URL_COLUMN = 5;
    private static int OCR_COLUMN = 6;

    private static final String PID_COLUMN_DEFAULT = "PID";
    private static final String CSV_SEPARATOR = ",";

    public MetsMaker(String inputDir, String baseUrl, String outputDirectory, String objId, String pidColumn) {
        if (!(Character.toString(baseUrl.charAt(baseUrl.length() - 1)).equals("/"))) {
            baseUrl = baseUrl.concat("/");
        }
        System.out.println("Base url: " + baseUrl);
        this.baseUrl = baseUrl;

        if (!(Character.toString(outputDirectory.charAt(outputDirectory.length() - 1)).equals("/"))) {
            outputDirectory = outputDirectory.concat("/");
        }
        System.out.println("Output directory: " + outputDirectory);
        this.outputDirectory = outputDirectory;

        System.out.println("Object id: " + objId);
        this.objId = objId;

        if(pidColumn.isEmpty()){
            this.pidColumnName = PID_COLUMN_DEFAULT;
        } else {
            this.pidColumnName = pidColumn;
        }

        pageArrayList = new ArrayList<Page>();

        try {
            mw = new METSWrapper();
        } catch (METSException e) {
            e.printStackTrace();
        }
        mets = mw.getMETSObject();

        try {
            openDirAndCreateMets(inputDir);
        } catch (METSException e) {
            e.printStackTrace();
        } catch (SAXException e) {
            e.getMessage();
        }
    }

    public void parseColumns(String header) {
        String[] columnNames = header.split(CSV_SEPARATOR);

        for (int i = 0; i < columnNames.length; i++) {

            if (columnNames[i].equals(pidColumnName)) {
                pidColumnNr = i;
            } else if (columnNames[i].equals(pageColumnName)) {
                pageColumnNr = i;
            }

        }

    }

    public void openDirAndCreateMets(String inputDir) throws METSException, SAXException {
        System.out.println("Input directory: " + inputDir);
        java.io.File directory = new java.io.File(inputDir);

        FilenameFilter filter = new FilenameFilter() {
            @Override
            public boolean accept(java.io.File dir, String name) {
                return (name.endsWith(".txt"));
            }
        };

        String[] textFiles = directory.list(filter);
        for (String file : textFiles) {
            System.out.println("Processing file: " + file);
            readFileAndCreateMets(inputDir + "/" + file, file.replace(".txt", ""));
            this.nrOfMets++;
        }
    }

    public void readFileAndCreateMets(String inputFile, String baseName) throws METSException, SAXException {
        String prevFolder = "";
        String folder = "";
        StringBuilder output = new StringBuilder();

        try {
            BufferedReader input = new BufferedReader(new FileReader(inputFile));
            try {
                String line;

                parseColumns(input.readLine()); // skip first line containing column headers


                while ((line = input.readLine()) != null) {
                    String[] split = line.split(CSV_SEPARATOR);

                    folder = split[1];
                    if (!folder.equals(prevFolder) && !prevFolder.isEmpty()) {
                        createMets(output, prevFolder, baseName);
                        output.setLength(0);
                        this.nrOfMets++;
                    }
                    prevFolder = folder;

                    line += "\n";
                    output.append(line);
                }
                createMets(output, folder, baseName);
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

    public void createMets(StringBuilder document, String folder, String baseName) throws METSException, IOException, SAXException {
        mw = new METSWrapper();
        mets = mw.getMETSObject();

        System.out.println("counter: " + this.nrOfMets);
        java.io.File output_file = new java.io.File(outputDirectory + baseName + "_" + this.nrOfMets + ".xml");
        FileOutputStream output = new FileOutputStream(output_file);
        System.out.println(folder);
        createMetsHeader();
        createFileSec(document.toString());
        createStructMap();
        pageArrayList.clear();
        mw.validate();
        mw.write(output);
        output.close();
    }

    /*  ToDo: wat moet er in header LABEL, PROFILE en OBJID?
    */
    public void createMetsHeader() throws METSException {
        if (this.objId.equals("")) {
            mets.setObjID("Auto-generated content");
        } else {
            mets.setObjID(this.objId);
        }

        mets.setProfile("Auto-generated content");
        mets.setType("Text");

        MetsHdr mh = mets.newMetsHdr();

        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
        String currentTime = df.format(cal.getTime());
        mh.setCreateDate(currentTime);
        mh.setLastModDate(currentTime);

        Agent agentArchivist = mh.newAgent();
        agentArchivist.setRole("ARCHIVIST");
        agentArchivist.setType("INDIVIDUAL");
        agentArchivist.setName("Jack Hofman");
        mh.addAgent(agentArchivist);

        Agent agentCreator = mh.newAgent();
        agentCreator.setRole("CREATOR");
        agentCreator.setType("INDIVIDUAL");
        agentCreator.setName("");
        mh.addAgent(agentCreator);

        Agent agentPreservation = mh.newAgent();
        agentPreservation.setRole("PRESERVATION");
        agentPreservation.setType("ORGANIZATION");
        agentPreservation.setName("International Institute for Social History");
        mh.addAgent(agentPreservation);

        mets.setMetsHdr(mh);
    }

    public void createFileSec(String document) throws METSException {
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

            File f = archive.newFile();
            f.setID(archiveId);
            f.setMIMEType("image/jpeg");
            f.setSeq(String.valueOf(seq));
            f.setGroupID(String.valueOf(seq));

            // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

            FLocat fl = f.newFLocat();
            fl.setLocType("URL");
            fl.setType("simple");
            archiveImageUrl = this.baseUrl + columns[pidColumnNr] + "?locatt=view:master";
            archiveImageUrl = archiveImageUrl.replace("\"", "");
            fl.setHref(archiveImageUrl);

            f.addFLocat(fl);
            archive.addFile(f);

            // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

            File f2 = reference.newFile();
            f2.setID(referenceId);
            f2.setMIMEType("image/jpeg");
            f2.setSeq(String.valueOf(seq));
            f2.setGroupID(String.valueOf(seq));

            FLocat fl2 = f2.newFLocat();
            fl2.setLocType("URL");
            fl2.setType("simple");
            referenceImageUrl = this.baseUrl + columns[pidColumnNr] + "?locatt=view:level2";
            referenceImageUrl = referenceImageUrl.replace("\"", "");
            fl2.setHref(referenceImageUrl);

            f2.addFLocat(fl2);
            reference.addFile(f2);

            // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

            File f3 = thumbnail.newFile();
            f3.setID(thumbnailId);
            f3.setMIMEType("image/jpeg");
            f3.setSeq(String.valueOf(seq));
            f3.setGroupID(String.valueOf(seq));

            FLocat fl3 = f3.newFLocat();
            fl3.setLocType("URL");
            fl3.setType("simple");
            thumbnailImageUrl = this.baseUrl + columns[pidColumnNr] + "?locatt=view:level2";
            thumbnailImageUrl = thumbnailImageUrl.replace("\"", "");
            fl3.setHref(thumbnailImageUrl);
            f3.addFLocat(fl3);
            thumbnail.addFile(f3);

            // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

            if (columns.length >= 7) {
                ocrUrl = this.baseUrl + columns[OCR_COLUMN];
                ocrUrl = ocrUrl.replace("\"", "");

                File f4 = ocr.newFile();
                f4.setID(ocrId);
                f4.setMIMEType("text/plain");
                f4.setSeq(String.valueOf(seq));
                f4.setGroupID(String.valueOf(seq));

                FLocat fl4 = f4.newFLocat();
                fl4.setLocType("URL");
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
        fs.addFileGrp(ocr);

        mets.setFileSec(fs);
    }

    /* ToDo: wat moet er in innerDiv.setDmdID, ORDER en LABEL?*/
    public void createStructMap() throws METSException, IOException, SAXException {
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
