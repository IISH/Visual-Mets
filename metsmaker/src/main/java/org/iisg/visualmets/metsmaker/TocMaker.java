package org.iisg.visualmets.metsmaker;


import au.edu.apsr.mtk.base.*;
import au.edu.apsr.mtk.base.File;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.TimeZone;

/**
 * Created by IntelliJ IDEA.
 * User: Chris
 * Date: 3/14/11
 * Time: 4:58 PM
 */
public class TocMaker {
    METS mets;
    METSWrapper mw;
    ArrayList<Page> pageArrayList;
    String objId;

    // column nummers beginnen bij 0
    private static final int XML_FILENAME_COLUMN = 0;
    private static final int TITLE_XML_FILE_COLUMN = 1;
    private static final int THUMBNAIL_XML_FILE_COLUMN = 2;
    private static final int INDEX_COLUMN = 3;
    private static final int LEVEL_1_COLUMN = 3;
    private static final int LEVEL_2_COLUMN = 4;
    private static final int LEVEL_3_COLUMN = 5;
    private static final int LEVEL_4_COLUMN = 6;

    public TocMaker(String inputFile, String outputFile) {
//        if (!(Character.toString(outputDirectory.charAt(outputDirectory.length() - 1)).equals("/"))) {
//            outputDirectory = outputDirectory.concat("/");
//        }
        System.out.println("Output file: " + outputFile);

        pageArrayList = new ArrayList<Page>();

        try {
            mw = new METSWrapper();
        } catch (METSException e) {
            e.printStackTrace();
        }
        mets = mw.getMETSObject();

        try {
            openCsvAndCreateMets(inputFile, outputFile);
        } catch (METSException e) {
            e.printStackTrace();
        } catch (SAXException e) {
            e.getMessage();
        }
    }

    public void openCsvAndCreateMets(String inputFile, String outputFile) throws METSException, SAXException {
        System.out.println("Input file: " + inputFile);
        java.io.File file = new java.io.File(inputFile);
        readFileAndCreateMets(inputFile, outputFile);
    }

    public void readFileAndCreateMets(String inputFile, String outputFile) throws METSException, SAXException {
        String prevFolder = "";
        String folder = "";
        StringBuilder parsedCsv;

        try {
            BufferedReader input = new BufferedReader(new FileReader(inputFile));
            parsedCsv = parseCsv(input);
//            System.out.println(parsedCsv);
            try {
                createMets(parsedCsv, input, outputFile);
            } catch(SAXParseException e) {
                System.out.println(e);
                //e.printStackTrace();
            }finally {
                input.close();
            }
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    public StringBuilder parseCsv(BufferedReader input){
        StringBuilder parsedCsv = new StringBuilder();
        try{
            String line;
            while ((line = input.readLine()) != null) {
//                String[] split = line.split(";");
                parsedCsv.append(line + "\n");
            }
        } catch(IOException e){

        }


        return parsedCsv;
    }

    public void createMets(StringBuilder parsedCsv, BufferedReader input, String output) throws METSException, IOException, SAXException {
        mw = new METSWrapper();
        mets = mw.getMETSObject();

        java.io.File output_file = new java.io.File(output);
        FileOutputStream outputStream = new FileOutputStream(output_file);
//        System.out.println(folder);
        createMetsHeader();
        createFileSec(parsedCsv.toString());
        createStructMap(parsedCsv.toString());
//        pageArrayList.clear();
        mw.write(outputStream);
        mw.validate();
        outputStream.close();
    }

    /*  ToDo: wat moet er in header LABEL, PROFILE en OBJID?
    */
    public void createMetsHeader() throws METSException {
//        if ( this.objId.equals("") ) {
//            mets.setObjID("Auto-generated content");
//        } else {
//            mets.setObjID(this.objId);
//        }
        mets.setObjID("Auto-generated content");
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
        agentCreator.setName("Lucien van Wouw");
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

        FileSec fs = mets.newFileSec();
        FileGrp thumbnail = fs.newFileGrp();
        thumbnail.setUse("thumb");
        thumbnail.setID("A");

        for(int i = 0; i < lines.length ; i++){
            String[] columns = lines[i].split(";");
            File f = thumbnail.newFile();
            f.setID("FILE" + i);
            f.setMIMEType("image/jpeg");
//            f.setGroupID("A");

            FLocat fLocat = f.newFLocat();
            fLocat.setLocType("URL");
            fLocat.setType("simple");
            String thumbnailUrl = columns[THUMBNAIL_XML_FILE_COLUMN];
            fLocat.setHref(thumbnailUrl);

            f.addFLocat(fLocat);
            thumbnail.addFile(f);
        }

        fs.addFileGrp(thumbnail);
        mets.setFileSec(fs);

    }

    /* ToDo: wat moet er in innerDiv.setDmdID, ORDER en LABEL?*/
    public void createStructMap(String document) throws METSException, IOException, SAXException {
        Div[] path = new Div[10];
        int seq = 0;
        Div latestRootDiv = null;
        Div latestDiv = null;

        StructMap sm = mets.newStructMap();
        //sm.setType("physical");
        mets.addStructMap(sm);

        Div toc = sm.newDiv();
        toc.setLabel("TOC");
        sm.addDiv(toc);

        String[] lines = document.split("\n");

        for(String line : lines){
            String[] columns = line.split(";");
            for(int i = LEVEL_1_COLUMN; i < columns.length; i++){
                if(path[i] == null || !path[i].getLabel().equals(columns[i])){
                    Div subDiv = sm.newDiv();
                    subDiv.setID("" + (char)(i+62) + seq );
                    subDiv.setLabel(columns[i]);

                    if(i == LEVEL_1_COLUMN){
                        toc.addDiv(subDiv);
                    } else {
                        path[i-1].addDiv(subDiv);
                    }
                    path[i] = subDiv;
                    latestDiv = subDiv;
                }
            }

            if(latestDiv == null) continue;

            Div filediv = latestDiv.newDiv();
            filediv.setID("FOLDER" + seq);
            filediv.setLabel(columns[TITLE_XML_FILE_COLUMN]);
            latestDiv.addDiv(filediv);

            Mptr mptr = filediv.newMptr();
            mptr.setHref(columns[XML_FILENAME_COLUMN]);
            mptr.setLocType("URL");
            mptr.setID("METS" + seq);
            filediv.addMptr(mptr);

            Fptr thumbnailFp = filediv.newFptr();
            thumbnailFp.setFileID("FILE"+seq);
            filediv.addFptr(thumbnailFp);
            seq++;
        }
    }
}
